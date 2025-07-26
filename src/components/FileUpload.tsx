import React, { useCallback, useState } from 'react';
import { Upload, Image, Video, X } from 'lucide-react';
import { FileUpload as FileUploadType } from '../types';

interface FileUploadProps {
  onFileSelect: (file: FileUploadType) => void;
  currentFile?: FileUploadType;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, currentFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      const fileUpload: FileUploadType = {
        file,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file)
      };
      onFileSelect(fileUpload);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUpload: FileUploadType = {
        file,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file)
      };
      onFileSelect(fileUpload);
    }
  }, [onFileSelect]);

  const clearFile = useCallback(() => {
    if (currentFile) {
      URL.revokeObjectURL(currentFile.url);
    }
  }, [currentFile]);

  return (
    <div className="w-full">
      {currentFile ? (
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              {currentFile.type === 'image' ? (
                <Image className="w-5 h-5 text-blue-400" />
              ) : (
                <Video className="w-5 h-5 text-purple-400" />
              )}
              <span className="text-white font-medium truncate">{currentFile.file.name}</span>
            </div>
            <button
              onClick={clearFile}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="p-4">
            {currentFile.type === 'image' ? (
              <img
                src={currentFile.url}
                alt="Preview"
                className="max-w-full max-h-48 mx-auto rounded"
              />
            ) : (
              <video
                src={currentFile.url}
                controls
                className="max-w-full max-h-48 mx-auto rounded"
                muted
              />
            )}
          </div>
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
            ${isDragOver 
              ? 'border-green-400 bg-green-400/10' 
              : 'border-gray-600 hover:border-gray-500'
            }
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={handleDrop}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? 'text-green-400' : 'text-gray-400'}`} />
          <h3 className="text-lg font-semibold text-white mb-2">
            Drop your media here
          </h3>
          <p className="text-gray-400 mb-4">
            Support for images (PNG, JPG, GIF) and videos (MP4, WebM)
          </p>
          <label className="inline-block">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer">
              Choose File
            </span>
          </label>
        </div>
      )}
    </div>
  );
};