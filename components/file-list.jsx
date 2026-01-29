import { cn } from "@/lib/utils";
import { FileItem } from "./file-item";

export function  FileList({
  uploadedFiles,
  fileProgresses,
  removeFile,
}) {
  if (uploadedFiles.length === 0) {
    return null;
  }

  return (
    <div className={cn("pb-5 space-y-3 mt-4")}>
      {uploadedFiles.map((file, index) => (
        <FileItem
          key={file.name + index}
          file={file}
          progress={fileProgresses[file.name] || 0}
          onRemove={removeFile}
        />
      ))}
    </div>
  );
}
