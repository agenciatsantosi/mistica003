import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const LazyImage = ({ src, alt, className, ...props }: LazyImageProps) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {isIntersecting && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  );
};