import SignalsmithStretch from 'signalsmith-stretch';
import type {
  AudioEngineState,
  AudioEngineEventType,
  AudioEngineEventCallback,
} from './types';

// The signalsmith-stretch node type with its actual API
interface StretchNode extends AudioWorkletNode {
  start(when?: number, offset?: number, duration?: number): void;
  stop(when?: number): void;
  schedule(options: {
    output?: number;
    active?: boolean;
    input?: number;
    rate?: number;
    semitones?: number;
    tonalityHz?: number;
    loopStart?: number;
    loopEnd?: number;
  }): void;
  addBuffers(buffers: Float32Array[]): Promise<number>;
  dropBuffers(toSeconds?: number): Promise<{ start: number; end: number }> | void;
  inputTime: number;
  setUpdateInterval(seconds: number, callback?: () => void): void;
  latency(): number;
  configure(options: { blockMs?: number; intervalMs?: number; preset?: string }): void;
}

class AudioEngine {
  private static instance: AudioEngine | null = null;

  private audioContext: AudioContext | null = null;
  private stretchNode: StretchNode | null = null;
  private gainNode: GainNode | null = null;

  private isInitialized = false;
  private isPlaying = false;
  private currentDuration = 0;
  private currentSpeed = 1.0;
  private currentPitch = 0; // semitones

  // Event listeners
  private listeners: Map<AudioEngineEventType, Set<AudioEngineEventCallback>> =
    new Map();

  // Position tracking
  private positionUpdateInterval: ReturnType<typeof setInterval> | null = null;
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
      const audioContext = new AudioContext();

      // Initialize Signalsmith-Stretch
      // Let the library use its default channel configuration
      const node = (await SignalsmithStretch(audioContext)) as StretchNode;

      this.stretchNode = node;

      // Use the context from the node to ensure consistency
      this.audioContext = node.context as AudioContext;

      // Create gain node for volume control using the same context
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);

      // Connect stretch node to gain
      this.stretchNode.connect(this.gainNode);

      // Configure the stretch node for optimal quality
      this.stretchNode.configure({ preset: 'default' });

      this.isInitialized = true;
      console.log('AudioEngine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AudioEngine:', error);
      throw error;
    }
  }

  // Helper to ensure stretch node is ready
  private ensureReady(): void {
    if (!this.isInitialized || !this.stretchNode) {
      throw new Error('AudioEngine not initialized');
    }
  }

  // ==================== Track Loading ====================

  async loadTrack(audioBuffer: AudioBuffer): Promise<void> {
    this.ensureReady();

    // Stop any current playback
    if (this.isPlaying) {
      await this.pause();
    }

    try {
      // Drop any existing buffers (await to ensure completion)
      await this.stretchNode!.dropBuffers();

      // Extract channel data as Float32Arrays - must copy since getChannelData returns views
      const leftChannel = new Float32Array(audioBuffer.getChannelData(0));
      const rightChannel =
        audioBuffer.numberOfChannels > 1
          ? new Float32Array(audioBuffer.getChannelData(1))
          : new Float32Array(leftChannel); // Mono -> duplicate to stereo

      this.currentDuration = audioBuffer.duration;

      console.log('Loading audio buffer:', {
        duration: this.currentDuration,
        sampleRate: audioBuffer.sampleRate,
        channels: audioBuffer.numberOfChannels,
        samplesPerChannel: leftChannel.length,
      });

      // Add the audio buffers to the stretch node
      const endTime = await this.stretchNode!.addBuffers([leftChannel, rightChannel]);
      console.log('Buffers added, end time:', endTime);

      // Set up position update callback
      this.stretchNode!.setUpdateInterval(0.05, () => {
        if (this.isPlaying && this.stretchNode) {
          const position = this.stretchNode.inputTime;

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
        }
      });

      // Reset position to start and configure playback bounds
      // active: false ensures we don't start playing yet
      // output: 0 and input: 0 reset both playback and source positions
      this.stretchNode!.schedule({
        active: false,
        output: 0,
        input: 0,
        rate: this.currentSpeed,
        semitones: this.currentPitch,
        loopStart: 0,
        loopEnd: 0, // Same values = no looping
      });

      this.lastReportedPosition = 0;
      this.emit('loaded', { duration: this.currentDuration });
      console.log('Track loaded successfully');
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

    console.log('AudioEngine.play() called, duration:', this.currentDuration);

    // Resume AudioContext if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      console.log('Resuming suspended AudioContext');
      await this.audioContext.resume();
    }

    console.log('AudioContext state:', this.audioContext.state);

    // Start playback with current parameters using schedule
    this.stretchNode.schedule({
      active: true,
      rate: this.currentSpeed,
      semitones: this.currentPitch,
    });
    console.log('stretchNode.schedule({active: true}) called');

    this.isPlaying = true;
    this.startPositionPolling();
    this.emit('play');
  }

  async pause(): Promise<void> {
    if (!this.stretchNode) return;

    // Pause playback using schedule
    this.stretchNode.schedule({ active: false });

    this.isPlaying = false;
    this.stopPositionPolling();
    this.emit('pause');
  }

  async seek(time: number): Promise<void> {
    if (!this.stretchNode) return;

    const clampedTime = Math.max(0, Math.min(time, this.currentDuration));

    // Set both input (source position) and output (playback position)
    this.stretchNode.schedule({ input: clampedTime, output: clampedTime });

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

    this.stretchNode.schedule({ rate: clampedSpeed });
  }

  // ==================== Pitch Control ====================

  async setPitch(semitones: number): Promise<void> {
    if (!this.stretchNode) return;

    const clampedPitch = Math.max(-12, Math.min(12, semitones));
    this.currentPitch = clampedPitch;

    this.stretchNode.schedule({ semitones: clampedPitch });
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

    console.log('Starting position polling');

    // Use a fallback interval in case the node's callback doesn't fire
    this.positionUpdateInterval = setInterval(() => {
      if (this.isPlaying && this.stretchNode) {
        const position = this.stretchNode.inputTime;

        // Debug log every few seconds
        if (Math.floor(position) !== Math.floor(this.lastReportedPosition)) {
          console.log('Position:', position, '/', this.currentDuration);
        }

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
      }
    }, 100);
  }

  private stopPositionPolling(): void {
    if (this.positionUpdateInterval !== null) {
      clearInterval(this.positionUpdateInterval);
      this.positionUpdateInterval = null;
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
