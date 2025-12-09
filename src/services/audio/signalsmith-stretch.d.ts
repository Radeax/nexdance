declare module 'signalsmith-stretch' {
  export interface StretchSampleState {
    buffers?: Float32Array[];
    endPosition?: number;
    loopPosition?: number;
    position?: number;
    speed?: number;
    playing?: boolean;
  }

  export interface StretchPitchState {
    semitones?: number;
  }

  export interface StretchState {
    sample?: StretchSampleState;
    pitch?: StretchPitchState;
  }

  export interface StretchNode extends AudioWorkletNode {
    setState(state: StretchState): Promise<void>;
    getState(): Promise<StretchState>;
  }

  export interface StretchOptions extends AudioWorkletNodeOptions {
    numberOfInputs?: number;
    numberOfOutputs?: number;
    outputChannelCount?: number[];
  }

  export default function SignalsmithStretch(
    audioContext: AudioContext,
    options?: StretchOptions
  ): Promise<StretchNode>;
}
