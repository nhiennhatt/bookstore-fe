"use client";

import { motion } from "motion/react";
import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ImageGalleryProps {
  images: string[];
  activeIndex: number;
  bookName: string;
  onImageSelect: (index: number) => void;
}

export function ImageGallery({
  images,
  activeIndex,
  bookName,
  onImageSelect,
}: ImageGalleryProps) {
  return (
    <div className="sticky top-32 flex flex-col gap-6">
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="aspect-3/4 rounded-3xl overflow-hidden bg-muted shadow-2xl relative group"
      >
        <img
          src={images[activeIndex]}
          alt={bookName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 left-6">
          <Badge className="bg-electric-indigo text-white px-4 py-1.5 rounded-full border-none uppercase tracking-widest text-[10px] font-bold">
            Bản tuyển chọn
          </Badge>
        </div>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onImageSelect(idx)}
            className={`shrink-0 w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              activeIndex === idx
                ? "border-electric-indigo scale-105"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={img}
              alt={`${bookName} view ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-border/50 hover:bg-vapor-white transition-all"
        >
          <Heart size={20} className="text-cool-slate hover:text-red-500" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-border/50 hover:bg-vapor-white transition-all"
        >
          <Share2 size={20} className="text-cool-slate" />
        </Button>
      </div>
    </div>
  );
}
