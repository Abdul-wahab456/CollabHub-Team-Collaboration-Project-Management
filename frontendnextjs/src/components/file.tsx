import { Button } from "@/components/ui/button";

type FileItem = {
  id: number;
  fileName: string;
  url: string;
  uploader: { name: string };
};

interface FileComponentProps {
  files: FileItem[];
  selectedFile: File | null;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleUploadClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
}

export default function FileComponent({
  files,
  selectedFile,
  uploading,
  fileInputRef,
  handleUploadClick,
  handleFileChange,
  handleUpload,
}: FileComponentProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-balance text-2xl font-semibold">File Sharing</h1>

      <div className="flex justify-between items-center gap-2">
        <div className="text-sm text-muted-foreground">
          Upload and manage project files.
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button onClick={handleUploadClick} aria-label="Choose file">
            Choose File
          </Button>
          {selectedFile && (
            <>
              <span className="text-sm">{selectedFile.name}</span>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-3 gap-2 border-b p-3 text-xs text-muted-foreground">
          <div>File</div>
          <div>Date</div>
          <div>Uploader</div>
        </div>
        <ul className="divide-y">
          {files.map((f) => (
            <li key={f.id} className="grid grid-cols-3 gap-2 p-3 text-sm">
              <div>{f.fileName}</div>
              <div>{new Date(Date.now()).toLocaleDateString()}</div>
              <div>{f.uploader?.name ?? "Unknown"}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}