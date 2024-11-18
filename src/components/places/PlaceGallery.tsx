import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { LazyImage } from '../ui/Image';
import { Modal } from '../ui/Modal';

interface GalleryImage {
  id: string;
  url: string;
  description: string;
}

interface PlaceGalleryProps {
  images: GalleryImage[];
}

const PlaceGallery = ({ images }: PlaceGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handlePrevious = () => {
    setSelectedImage(prev => 
      prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : null
    );
  };

  const handleNext = () => {
    setSelectedImage(prev => 
      prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : null
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Galeria</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setSelectedImage(index)}
          >
            <LazyImage
              src={image.url}
              alt={image.description}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      <Modal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        title="Galeria de Fotos"
      >
        {selectedImage !== null && (
          <div className="relative">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].description}
              className="w-full max-h-[70vh] object-contain"
            />
            <p className="text-center mt-4 text-gray-600">
              {images[selectedImage].description}
            </p>
            
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-r-lg hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-l-lg hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PlaceGallery;