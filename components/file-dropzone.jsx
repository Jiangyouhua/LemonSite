import { Upload } from "lucide-react";
import React, { RefObject } from "react";

export function FileDropzone({
  fileInputRef,
  handleBoxClick,
  handleDragOver,
  handleDrop,
  handleFileSelect,
}) {
  return (
    <div
      className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
      onClick={handleBoxClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mb-2 bg-muted rounded-full p-3">
        <Upload className="h-5 w-5 text-muted-foreground" />
      </div>
      <input
        type="file"
        id="fileUpload"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </div>
  );
}
