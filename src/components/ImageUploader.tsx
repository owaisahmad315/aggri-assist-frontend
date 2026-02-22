import React, { useRef, useCallback, useState } from 'react';
import type { UploadedImage } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
console.log('is dragging', isDragging);
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
      const remaining = maxImages - images.length;
      const toProcess = fileArray.slice(0, remaining);

      const newImages: UploadedImage[] = toProcess.map((file) => ({
        id: uuidv4(),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));

      onImagesChange([...images, ...newImages]);
    },
    [images, maxImages, onImagesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  console.log('handle drop', handleDrop);

  const removeImage = (id: string) => {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.preview);
    onImagesChange(images.filter((i) => i.id !== id));
  };

  if (images.length === 0) return null;

  return (
    <div className="image-preview-strip">
      {images.map((img) => (
        <div key={img.id} className="image-thumb">
          <img src={img.preview} alt={img.name} />
          <button
            className="remove-image-btn"
            onClick={() => removeImage(img.id)}
            type="button"
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      ))}
      {images.length < maxImages && (
        <button
          className="add-more-btn"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          +
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && processFiles(e.target.files)}
          />
        </button>
      )}
    </div>
  );
};

export default ImageUploader;