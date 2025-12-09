declare module 'signalsmith-stretch' {
  interface StretchNodeOptions {
    numberOfInputs?: number;
    numberOfOutputs?: number;
    outputChannelCount?: number[];
  }

  interface ScheduleOptions {
    output?: number;
    active?: boolean;
    input?: number;
    rate?: number;
    semitones?: number;
    tonalityHz?: number;
    formantSemitones?: number;
    formantCompensation?: boolean;
    formantBaseHz?: number;
    loopStart?: number;
    loopEnd?: number;
  }

  interface ConfigureOptions {
    blockMs?: number | null;
    intervalMs?: number;
    splitComputation?: boolean;
    preset?: 'default' | 'cheaper';
  }

  interface BufferExtent {
    start: number;
    end: number;
  }

  interface StretchNode extends AudioNode {
    inputTime: number;
    addBuffers(buffers: Float32Array[]): Promise<number>;
    dropBuffers(toSeconds?: number): Promise<BufferExtent> | void;
    schedule(options: ScheduleOptions): void;
    start(when?: number): void;
    stop(when?: number): void;
    latency(): number;
    configure(options: ConfigureOptions): void;
    setUpdateInterval(seconds: number, callback?: () => void): void;
  }

  export default function SignalsmithStretch(
    context: AudioContext,
    options?: StretchNodeOptions
  ): Promise<StretchNode>;
}
