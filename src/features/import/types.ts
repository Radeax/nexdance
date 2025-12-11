export interface ExtractedMetadata {
  title: string;
  artist: string;
  album: string | null;
  bpm: number | null;
  duration: number;
}

export interface PendingImport {
  id: string;
  file: File;
  status:
    | 'pending'
    | 'extracting'
    | 'ready'
    | 'importing'
    | 'complete'
    | 'error';
  metadata: ExtractedMetadata | null;
  selectedDanceStyleId: string | null;
  error?: string;
}
