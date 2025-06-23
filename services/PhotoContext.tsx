import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CapturedPhoto {
  id: string;
  uri: string;
  timestamp: Date;
  width?: number;
  height?: number;
}

interface PhotoContextType {
  photos: CapturedPhoto[];
  addPhoto: (photo: Omit<CapturedPhoto, 'id' | 'timestamp'>) => void;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);

  const addPhoto = (photo: Omit<CapturedPhoto, 'id' | 'timestamp'>) => {
    const newPhoto: CapturedPhoto = {
      ...photo,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setPhotos(prev => [newPhoto, ...prev]); // Add to beginning for newest first
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

  return (
    <PhotoContext.Provider value={{ photos, addPhoto, removePhoto, clearPhotos }}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotos() {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
} 