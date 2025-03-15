"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  onDrop: (acceptedFiles: File[]) => void
}

export function FileUploader({ onDrop }: FileUploaderProps) {

  
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles)
    },
    [onDrop],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10485760, // 10MB
  })

  return (
    <div
      {...getRootProps()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center hover:bg-muted/50 ${
        isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
        <div className="rounded-full bg-muted p-2">
          <Upload className="h-6 w-6" />
        </div>
        <div className="flex flex-col space-y-1">
          <span className="font-medium">{isDragActive ? "Drop files here" : "Drag & drop files here"}</span>
          <span className="text-xs">or click to browse (PDF, JPG, PNG up to 10MB)</span>
        </div>
      </div>
    </div>
  )
}

