import SignalsmithStretch, { type StretchNode } from 'signalsmith-stretch';
import type {
  AudioEngineState,
  AudioEngineEventType,
  AudioEngineEventCallback,
} from './types';

class AudioEngine {
  private static instance: AudioEngine | null = null;

  private audioContext: AudioContext | null = null;
  private stretchNode: StretchNode | null = null;
  private gainNode: GainNode | null = null;

  private isInitialized = false;
  private isPlaying = false;
  private currentDuration = 0;
  private currentSpeed = 1.0;

  // Event listeners
  private listeners: Map<AudioEngineEventType, Set<AudioEngineEventCallback>> =
    new Map();

  // Position tracking
  private positionPollInterval: ReturnType<typeof setInterval> | null = null;
  private animationFrameId: number | null = null;
  private lastReportedPosition = 0;

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  // ==================== Initialization ====================

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create AudioContext
      this.audioContext = new AudioContext();

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);

      // Initialize Signalsmith-Stretch
      // Returns an AudioWorkletNode configured for sample playback
      this.stretchNode = await SignalsmithStretch(this.audioContext, {
        numberOfInputs: 0, // No live input (sample playback only)
        numberOfOutputs: 1,
        outputChannelCount: [2], // Stereo output
      });

      // Connect stretch node to gain
      this.stretchNode.connect(this.gainNode!);

      this.isInitialized = true;
      console.log('AudioEngine initialized');
    } catch (error) {
      console.error('Failed to initialize AudioEngine:', error);
      throw error;
    }
  }

  // ==================== Track Loading ====================

  async loadTrack(audioBuffer: AudioBuffer): Promise<void> {
    if (!this.isInitialized || !this.stretchNode) {
      throw new Error('AudioEngine not initialized');
    }

    // Stop any current playback
    await this.pause();

    try {
      // Extract channel data as Float32Arrays
      const leftChannel = audioBuffer.getChannelData(0);
      const rightChannel =
        audioBuffer.numberOfChannels > 1
          ? audioBuffer.getChannelData(1)
          : leftChannel; // Mono -> duplicate to stereo

      const duration = audioBuffer.duration;
      this.currentDuration = duration;

      // Configure Signalsmith-Stretch with the sample
      await this.stretchNode.setState({
        sample: {
          buffers: [leftChannel, rightChannel],
          endPosition: duration,
          loopPosition: duration + 1, // > endPosition = no loop
          position: 0,
          speed: this.currentSpeed,
          playing: false,
        },
        pitch: {
          semitones: 0, // No pitch shift
        },
      });

      this.lastReportedPosition = 0;
      this.emit('loaded', { duration });
    } catch (error) {
      console.error('Failed to load track:', error);
      this.emit('error', { error });
      throw error;
    }
  }

  async loadFromBlob(blob: Blob): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioEngine not initialized');
    }

    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    await this.loadTrack(audioBuffer);
  }

  async loadFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioEngine not initialized');
    }

    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    await this.loadTrack(audioBuffer);
  }

  // ==================== Playback Control ====================

  async play(): Promise<void> {
    if (!this.stretchNode || !this.audioContext) return;

    // Resume AudioContext if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    await this.stretchNode.setState({
      sample: { playing: true },
    });

    this.isPlaying = true;
    this.startPositionPolling();
    this.emit('play');
  }

  async pause(): Promise<void> {
    if (!this.stretchNode) return;

    await this.stretchNode.setState({
      sample: { playing: false },
    });

    this.isPlaying = false;
    this.stopPositionPolling();
    this.emit('pause');
  }

  async seek(time: number): Promise<void> {
    if (!this.stretchNode) return;

    const clampedTime = Math.max(0, Math.min(time, this.currentDuration));

    await this.stretchNode.setState({
      sample: { position: clampedTime },
    });

    this.lastReportedPosition = clampedTime;
    this.emit('timeupdate', { time: clampedTime });
  }

  async stop(): Promise<void> {
    await this.pause();
    await this.seek(0);
  }

  // ==================== Tempo Control ====================

  async setSpeed(speed: number): Promise<void> {
    if (!this.stretchNode) return;

    const clampedSpeed = Math.max(0.5, Math.min(2.0, speed));
    this.currentSpeed = clampedSpeed;

    await this.stretchNode.setState({
      sample: { speed: clampedSpeed },
    });
  }

  // ==================== Volume Control ====================

  setVolume(volume: number): void {
    if (!this.gainNode) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.gainNode.gain.setValueAtTime(
      clampedVolume,
      this.audioContext?.currentTime ?? 0
    );
  }

  // ==================== Position Tracking ====================

  private startPositionPolling(): void {
    this.stopPositionPolling();

    const poll = async () => {
      if (!this.isPlaying || !this.stretchNode) return;

      try {
        const state = await this.stretchNode.getState();
        const position = state?.sample?.position ?? 0;

        // Check for track end
        if (position >= this.currentDuration - 0.1) {
          this.isPlaying = false;
          this.stopPositionPolling();
          this.emit('ended');
          return;
        }

        // Only emit if position changed meaningfully
        if (Math.abs(position - this.lastReportedPosition) > 0.01) {
          this.lastReportedPosition = position;
          this.emit('timeupdate', { time: position });
        }
      } catch (error) {
        console.error('Position polling error:', error);
      }

      // Continue polling if still playing
      if (this.isPlaying) {
        this.animationFrameId = requestAnimationFrame(poll);
      }
    };

    // Start RAF loop
    this.animationFrameId = requestAnimationFrame(poll);
  }

  private stopPositionPolling(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.positionPollInterval !== null) {
      clearInterval(this.positionPollInterval);
      this.positionPollInterval = null;
    }
  }

  // ==================== Event System ====================

  on(event: AudioEngineEventType, callback: AudioEngineEventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: AudioEngineEventType, callback: AudioEngineEventCallback): void {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: AudioEngineEventType, data?: unknown): void {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }

  // ==================== State Queries ====================

  getState(): AudioEngineState {
    return {
      isInitialized: this.isInitialized,
      isPlaying: this.isPlaying,
      currentTime: this.lastReportedPosition,
      duration: this.currentDuration,
      speed: this.currentSpeed,
    };
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  // ==================== Cleanup ====================

  async dispose(): Promise<void> {
    this.stopPositionPolling();

    if (this.stretchNode) {
      this.stretchNode.disconnect();
      this.stretchNode = null;
    }

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    this.isInitialized = false;
    this.listeners.clear();
    AudioEngine.instance = null;
  }
}

// Export singleton getter
export function getAudioEngine(): AudioEngine {
  return AudioEngine.getInstance();
}

export { AudioEngine };
