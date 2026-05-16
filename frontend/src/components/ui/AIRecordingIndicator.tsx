export function AIRecordingIndicator({ isRecording }: { isRecording: boolean }) {
  if (!isRecording) return null;
  return (
    <div className="flex items-center gap-2 text-secondary">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
      </span>
      <span className="text-sm font-medium tracking-wide">Gravando...</span>
    </div>
  );
}
