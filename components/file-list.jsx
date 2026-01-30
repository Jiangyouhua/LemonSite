import { cn } from "@/lib/utils";
import { FileItem } from "./file-item";

export function  FileList({
  disabled,
  selectedFiles,
  fileProgresses,
  removeFile,
}) {
  if (!selectedFiles || selectedFiles.length === 0) {
    return null;
  }

  return (
    <div className={cn("pb-5 space-y-3 mt-4")}>
      {selectedFiles.map((file, index) => (
        <FileItem
          key={"file_list_" + index}
          file={file}
          progress={(file.statue || !file.localFile) ? 100 : (fileProgresses[file.localFile.name] || 0)}
          onRemove={removeFile}
          disabled = {disabled}
        />
      ))}
    </div>
  );
}
