export interface AudioEngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  currentTime: number; // Source time in seconds
  duration: number;
  speed: number; // Tempo multiplier (0.5 - 2.0)
}

export interface AudioEngineConfig {
  numberOfOutputs?: number;
  outputChannelCount?: number[];
}

export type AudioEngineEventType =
  | 'play'
  | 'pause'
  | 'ended'
  | 'timeupdate'
  | 'loaded'
  | 'error';

export type AudioEngineEventCallback = (data?: unknown) => void;
