'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
}

export default function ImageLightboxModal({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  title,
}: ImageLightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  // Sync index when opening with specific initialIndex
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
    }
  }, [isOpen, initialIndex]);

  const validImages = images.filter(Boolean);
  const total = validImages.length;
  const currentImage = validImages[currentIndex] || validImages[0];

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setZoom(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setZoom(1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.35, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.35, 0.7));
  const handleResetZoom = () => setZoom(1);

  // Keyboard navigation & Esc to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-md p-3 sm:p-6 select-none"
      >
        {/* Top Bar: Title, Counter & Action Controls */}
        <div className="w-full flex items-center justify-between z-20 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {title && (
              <h3 className="text-white text-sm sm:text-base font-bold truncate max-w-xs sm:max-w-md">
                {title}
              </h3>
            )}
            {total > 1 && (
              <span className="bg-white/10 text-white/90 text-xs px-2.5 py-1 rounded-full font-medium tracking-wide">
                {currentIndex + 1} / {total}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/10">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.7}
                title="Zoom Out (-)"
                className="p-1.5 text-white/75 hover:text-white disabled:opacity-30 transition-colors rounded hover:bg-white/10"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={handleResetZoom}
                title="Reset Zoom (0)"
                className="px-2 py-1 text-xs font-mono text-white/90 hover:text-brand-yellow transition-colors"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                title="Zoom In (+)"
                className="p-1.5 text-white/75 hover:text-white disabled:opacity-30 transition-colors rounded hover:bg-white/10"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Open Raw Image in New Tab */}
            <a
              href={currentImage}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full image in new tab"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors border border-white/10 hidden sm:flex items-center justify-center"
            >
              <ExternalLink size={16} />
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Close (Esc)"
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white transition-colors border border-red-500/30 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Stage: Image & Navigation Arrows */}
        <div className="relative flex-1 w-full max-w-6xl flex items-center justify-center overflow-hidden my-2">
          {/* Left Arrow */}
          {total > 1 && (
            <button
              onClick={handlePrev}
              title="Previous Image (←)"
              className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-brand-yellow hover:text-black text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Right Arrow */}
          {total > 1 && (
            <button
              onClick={handleNext}
              title="Next Image (→)"
              className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-brand-yellow hover:text-black text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Zoomable Image Container */}
          <div
            className="relative w-full h-full flex items-center justify-center cursor-zoom-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                if (zoom === 1) handleZoomIn();
                else handleResetZoom();
              }
            }}
          >
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: zoom }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-full max-h-full flex items-center justify-center"
              style={{
                cursor: zoom > 1 ? 'grab' : 'zoom-in',
              }}
              onClick={() => {
                if (zoom === 1) handleZoomIn();
                else handleResetZoom();
              }}
            >
              <img
                src={currentImage}
                alt={title || 'Product view'}
                className="max-h-[72vh] max-w-[90vw] sm:max-w-[80vw] object-contain rounded-lg shadow-2xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
              />
            </motion.div>
          </div>
        </div>

        {/* Bottom Thumbnails Strip (if multiple images) */}
        {total > 1 && (
          <div className="w-full flex items-center justify-center gap-2 overflow-x-auto py-2 z-20 custom-scrollbar max-w-2xl">
            {validImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setZoom(1);
                  setCurrentIndex(idx);
                }}
                className={cn(
                  'relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0',
                  idx === currentIndex
                    ? 'border-brand-yellow ring-2 ring-brand-yellow/50 scale-105 opacity-100'
                    : 'border-white/20 opacity-50 hover:opacity-90 hover:border-white/50'
                )}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
