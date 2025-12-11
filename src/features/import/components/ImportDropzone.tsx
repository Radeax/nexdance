import { useCallback, useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = [
  'audio/mpeg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/wav',
  'audio/wave',
  'audio/ogg',
  'audio/flac',
];

const ACCEPTED_EXTENSIONS = ['.mp3', '.m4a', '.wav', '.ogg', '.flac'];

interface ImportDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

export function ImportDropzone({ onFilesSelected }: ImportDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filterAudioFiles = useCallback((files: FileList | File[]): File[] => {
    return Array.from(files).filter((file) => {
      // Check MIME type
      if (ACCEPTED_TYPES.includes(file.type)) return true;
      // Fallback to extension check
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return ACCEPTED_EXTENSIONS.includes(ext);
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = filterAudioFiles(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [filterAudioFiles, onFilesSelected]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = filterAudioFiles(e.target.files);
        if (files.length > 0) {
          onFilesSelected(files);
        }
      }
      // Reset input for re-selecting same files
      e.target.value = '';
    },
    [filterAudioFiles, onFilesSelected]
  );

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer',
        'flex flex-col items-center justify-center gap-4',
        isDragOver
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <Upload
        className={cn(
          'h-10 w-10 transition-colors',
          isDragOver ? 'text-primary' : 'text-muted-foreground'
        )}
      />

      <div className="text-center">
        <p className="font-medium">
          {isDragOver ? 'Drop files here' : 'Drag audio files here'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          or click to browse (MP3, M4A, WAV, OGG, FLAC)
        </p>
      </div>
    </div>
  );
}
