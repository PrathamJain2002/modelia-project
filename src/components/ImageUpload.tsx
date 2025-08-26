import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { UploadedImage } from '../types';
import { validateImage, downscaleImage, formatFileSize } from '../utils/imageUtils';

interface ImageUploadProps {
  onImageSelect: (image: UploadedImage | undefined) => void;
  selectedImage?: UploadedImage;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');

  const processImage = useCallback(async (file: File) => {
    try {
      setError('');
      
      // Validate image
      const validation = validateImage(file);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid image file');
        return;
      }

      // Convert to data URL
      const dataUrl = await downscaleImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      const uploadedImage: UploadedImage = {
        file,
        dataUrl,
        previewUrl
      };
      
      onImageSelect(uploadedImage);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Image processing error:', err);
    }
  }, [onImageSelect]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  }, [processImage]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      processImage(file);
    }
  }, [processImage]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeImage = useCallback(() => {
    onImageSelect(undefined as any);
    setError('');
  }, [onImageSelect]);

  if (selectedImage) {
    return (
      <div className="relative group">
        <div className="relative overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={selectedImage.previewUrl}
            alt="Selected image preview"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
          
          {/* Remove button */}
          <button
            onClick={removeImage}
            className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Remove image"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>
          
          {/* File info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="text-white text-sm">
              <p className="font-medium truncate">{selectedImage.file.name}</p>
              <p className="text-gray-200">{formatFileSize(selectedImage.file.size)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload image"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-primary-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {isDragOver ? 'Drop your image here' : 'Upload an image'}
            </h3>
            <p className="text-gray-500">
              Drag and drop or click to browse
            </p>
            <p className="text-sm text-gray-400">
              PNG, JPG up to 10MB • Will be automatically downscaled if needed
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Upload className="w-4 h-4" />
            <span>Click to browse files</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
