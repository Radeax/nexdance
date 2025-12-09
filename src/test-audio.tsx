import { useState, useRef } from 'react';

interface StretchNode extends AudioNode {
  addBuffers(buffers: Float32Array[]): Promise<number>;
  dropBuffers(): void;
  schedule(options: {
    output?: number;
    active?: boolean;
    input?: number;
    rate?: number;
    semitones?: number;
    loopStart?: number;
    loopEnd?: number;
  }): void;
  start(when?: number): void;
  stop(when?: number): void;
  inputTime: number;
}

export function AudioTest() {
  const [status, setStatus] = useState('Not initialized');
  const [tempo, setTempo] = useState(1.0);
  const stretchNodeRef = useRef<StretchNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAndPlay = async () => {
    try {
      setStatus('Initializing...');

      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const { default: SignalsmithStretch } = await import(
        'signalsmith-stretch'
      );

      // Use default configuration (1 input, 1 output, stereo)
      const stretchNode = (await SignalsmithStretch(ctx)) as StretchNode;

      // Don't connect yet - wait until we have audio loaded
      stretchNodeRef.current = stretchNode;

      setStatus('Select an audio file...');

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'audio/*';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        setStatus('Loading audio...');

        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        const channels: Float32Array[] = [];
        for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
          channels.push(audioBuffer.getChannelData(i));
        }

        // Ensure stereo
        if (channels.length === 1) {
          channels.push(channels[0]);
        }

        // Clear any existing buffers
        stretchNode.dropBuffers();

        // Add the audio buffers
        await stretchNode.addBuffers(channels);

        // Now connect to output (after buffers are loaded)
        stretchNode.connect(ctx.destination);

        // Schedule playback from the beginning at the current tempo
        stretchNode.schedule({
          input: 0,
          rate: tempo,
          semitones: 0,
          loopStart: 0,
          loopEnd: 0, // same value = no loop
        });

        // Start playback
        stretchNode.start();

        setStatus(
          `Playing "${file.name}" at ${(tempo * 100).toFixed(0)}% - NO PITCH SHIFT!`
        );
      };

      input.click();
    } catch (error) {
      setStatus(`Error: ${error}`);
      console.error(error);
    }
  };

  const changeTempo = (newTempo: number) => {
    setTempo(newTempo);
    if (stretchNodeRef.current) {
      stretchNodeRef.current.schedule({ rate: newTempo });
      setStatus(`Playing at ${(newTempo * 100).toFixed(0)}%`);
    }
  };

  const stopPlayback = () => {
    if (stretchNodeRef.current) {
      stretchNodeRef.current.stop();
      setStatus('Stopped');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Signalsmith-Stretch Test</h1>

      <p>Status: {status}</p>

      <div className="flex gap-2">
        <button
          onClick={initAndPlay}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Select Audio & Play
        </button>
        <button
          onClick={stopPlayback}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Stop
        </button>
      </div>

      <div>
        <p>Tempo: {(tempo * 100).toFixed(0)}%</p>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.05"
          value={tempo}
          onChange={(e) => changeTempo(parseFloat(e.target.value))}
          className="w-64"
        />

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => changeTempo(0.5)}
            className="px-2 py-1 border rounded"
          >
            50%
          </button>
          <button
            onClick={() => changeTempo(0.75)}
            className="px-2 py-1 border rounded"
          >
            75%
          </button>
          <button
            onClick={() => changeTempo(1.0)}
            className="px-2 py-1 border rounded"
          >
            100%
          </button>
          <button
            onClick={() => changeTempo(1.5)}
            className="px-2 py-1 border rounded"
          >
            150%
          </button>
          <button
            onClick={() => changeTempo(2.0)}
            className="px-2 py-1 border rounded"
          >
            200%
          </button>
        </div>
      </div>
    </div>
  );
}

export default AudioTest;
