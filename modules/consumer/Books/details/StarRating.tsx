import { Star, StarHalf } from "lucide-react";

export function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex gap-0.5 text-yellow-400">
      {Array.from({ length: fullStars }, (_, i) => (
        <Star key={`full-${i}`} size={16} fill="currentColor" />
      ))}
      {hasHalfStar && <StarHalf size={16} fill="currentColor" />}
      {Array.from({ length: 5 - Math.ceil(rating) }, (_, i) => (
        <Star key={`empty-${i}`} size={16} className="text-gray-200" />
      ))}
    </div>
  );
}
