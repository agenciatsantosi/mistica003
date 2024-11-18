import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div 
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    role="status"
    aria-label="Carregando..."
  />
);

export const PlaceCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-6">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  </div>
);