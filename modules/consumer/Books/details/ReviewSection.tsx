"use client";

import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    user: "Hoàng Ngân",
    avatar: "https://i.pravatar.cc/150?u=ngan",
    rating: 5,
    date: "24/04/2024",
    comment:
      "Một cuốn sách tuyệt vời! Nội dung sâu sắc và bìa sách thực sự rất đẹp. Rất đáng để sưu tầm.",
  },
  {
    id: 2,
    user: "Minh Tuấn",
    avatar: "https://i.pravatar.cc/150?u=tuan",
    rating: 4.5,
    date: "20/04/2024",
    comment:
      "Giao hàng nhanh, đóng gói cẩn thận. Nội dung sách lôi cuốn ngay từ những trang đầu tiên.",
  },
  {
    id: 3,
    user: "Lan Anh",
    avatar: "https://i.pravatar.cc/150?u=lan",
    rating: 5,
    date: "15/04/2024",
    comment:
      "Chất lượng in ấn tuyệt vời, đúng chất Lumina. Sẽ tiếp tục ủng hộ shop.",
  },
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={review.avatar}
            alt={review.user}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-bold text-sm text-deep-charcoal">
              {review.user}
            </h4>
            <span className="text-[10px] text-cool-slate font-medium">
              {review.date}
            </span>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-cool-slate leading-relaxed">{review.comment}</p>
      <div className="flex items-center gap-4 mt-2">
        <button className="text-xs font-bold text-cool-slate hover:text-electric-indigo transition-colors flex items-center gap-1.5">
          <MessageSquare size={14} /> Trả lời
        </button>
        <button className="text-xs font-bold text-cool-slate hover:text-electric-indigo transition-colors">
          Hữu ích?
        </button>
      </div>
    </div>
  );
}

function RatingSummary({ reviews }: { reviews: Review[] }) {
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="md:col-span-4 p-8 bg-vapor-white rounded-3xl border border-border/30 flex flex-col items-center justify-center text-center">
      <span className="text-6xl font-bold text-deep-charcoal mb-2">
        {avgRating.toFixed(1)}
      </span>
      <StarRating rating={avgRating} />
      <p className="text-sm text-cool-slate mt-4">
        Dựa trên {reviews.length} đánh giá thực tế
      </p>
      <Button className="mt-8 w-full rounded-xl bg-white border border-border text-deep-charcoal hover:bg-muted font-bold text-xs uppercase tracking-widest h-12">
        Viết đánh giá
      </Button>
    </div>
  );
}

export function ReviewSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-32 max-w-4xl"
    >
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-bold font-h2 tracking-tight">
          Đánh giá từ độc giả
        </h2>
        <Badge variant="secondary" className="rounded-full px-3 py-0.5">
          {MOCK_REVIEWS.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <RatingSummary reviews={MOCK_REVIEWS} />
        <div className="md:col-span-8 space-y-10">
          {MOCK_REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
