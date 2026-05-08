"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft,
  ShoppingCart,
  Heart,
  Share2,
  BookOpen,
  ShieldCheck,
  Truck,
  Star,
  StarHalf,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { BookDetail } from "@/lib/interfaces/book";
import { BookVariant } from "@/lib/interfaces/bookVariant";
import { getBookVariants } from "@/services/bookVariants";
import { presentStatus } from "@/lib/utils/presentStatus";
const MOCK_REVIEWS = [
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

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex gap-0.5 text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} size={16} fill="currentColor" />
      ))}
      {hasHalfStar && <StarHalf size={16} fill="currentColor" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={i} size={16} className="text-gray-200" />
      ))}
    </div>
  );
}

export function BookInform({ book }: { book: BookDetail }) {
  const { label: statusLabel, color: statusColor } = presentStatus(book.status, book.stock ?? 0);
  const formatter = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  });
  const [imageGallery, setImageGallery] = useState<string[]>([
    book.image ?? "",
  ]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [variants, setVariants] = useState<BookVariant[]>([]);

  useEffect(() => {
    const fetchVariants = async () => {
      const response = await getBookVariants(book.id);
      if (response.error || !response.data) {
        setVariants([]);
        return;
      }
      setVariants(response.data);
      setImageGallery([
        ...(book.image ? [book.image] : []),
        ...response.data.map((variant) => variant.image ?? ""),
      ]);
    };
    fetchVariants();
  }, [book]);

  if (!book) {
    return (
      <div className="grow flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4 font-h2">Không tìm thấy sách</h2>
        <Button asChild variant="outline">
          <Link href="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    );
  }

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  const handleVariantChange = (variantId: string, imageIndex: number) => {
    setSelectedVariantId(variantId);
    setActiveImageIndex(imageIndex);
  };

  return (
    <main className="grow pt-24 pb-20">
      <div className="container mx-auto px-4">
        <nav className="mb-12 flex items-center flex-wrap gap-2 text-sm font-medium text-cool-slate">
          <Link href="/" className="hover:text-deep-charcoal transition-colors">
            Trang chủ
          </Link>
          {book.category && (
            <>
              <span className="text-cool-slate/30 select-none">/</span>
              <Link
                href={`/collections/${book.category.slug}`}
                className="hover:text-deep-charcoal transition-colors"
              >
                {book.category.name}
              </Link>
            </>
          )}
          <span className="text-cool-slate/30 select-none">/</span>
          <span className="text-deep-charcoal font-semibold truncate max-w-[200px] md:max-w-none">
            {book.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="sticky top-32 flex flex-col gap-6">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="aspect-3/4 rounded-3xl overflow-hidden bg-muted shadow-2xl relative group"
              >
                <img
                  src={imageGallery[activeImageIndex]}
                  alt={book.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-electric-indigo text-white px-4 py-1.5 rounded-full border-none uppercase tracking-widest text-[10px] font-bold">
                    Bản tuyển chọn
                  </Badge>
                </div>
              </motion.div>

              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {imageGallery.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`shrink-0 w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? "border-electric-indigo scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${book.name} view ${idx}`}
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
                  <Heart
                    size={20}
                    className="text-cool-slate hover:text-red-500"
                  />
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
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-electric-indigo mb-4 block">
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-h1 tracking-tighter text-deep-charcoal mb-4 leading-[1.1]">
                {book.name}
              </h1>
              <p className="text-xl md:text-2xl text-cool-slate font-medium mb-8">
                Tác giả:{" "}
                <span className="text-deep-charcoal">{book.author}</span>
              </p>

              <div className="flex items-center gap-6 mb-10">
                <span className="text-4xl font-bold text-deep-charcoal tracking-tight">
                  {formatter.format(selectedVariant?.salePrice ?? 0)}đ
                </span>
                <Badge
                  variant="outline"
                  className={`px-3 py-1 text-xs text-${statusColor}-600 border-${statusColor}-200 bg-${statusColor}-50 font-bold`}
                >
                  {statusLabel}
                </Badge>
              </div>

              <div className="space-y-8 mb-12">
                <p className="text-lg leading-relaxed text-cool-slate">
                  {book.description}
                </p>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-deep-charcoal">
                    Chọn phiên bản
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {variants.map((variant, index) => (
                      <button
                        key={variant.id}
                        onClick={() =>
                          handleVariantChange(variant.id, index + 1)
                        }
                        className={`flex flex-col p-4 rounded-xl border text-left transition-all text-sm font-bold ${
                          selectedVariantId === variant.id
                            ? "text-electric-indigo border-electric-indigo bg-indigo-50/50 ring-1 ring-electric-indigo"
                            : "text-deep-charcoal border-border/50 hover:border-cool-slate/50"
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 p-6 bg-vapor-white rounded-2xl border border-border/30">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cool-slate">
                      Nhà xuất bản
                    </span>
                    <span className="font-bold text-deep-charcoal">
                      {book.publisher ?? "--"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cool-slate">
                      Phân phối
                    </span>
                    <span className="font-bold text-deep-charcoal">
                      {book.distributor ?? "--"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <div className="flex items-center border border-border rounded-xl h-14 overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center hover:bg-muted transition-colors text-xl"
                  >
                    -
                  </button>
                  <div className="w-12 h-full flex items-center justify-center font-bold">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-full flex items-center justify-center hover:bg-muted transition-colors text-xl"
                  >
                    +
                  </button>
                </div>
                <Button className="grow h-14 rounded-xl bg-deep-charcoal hover:bg-deep-charcoal/90 text-white font-bold uppercase tracking-widest text-xs gap-3">
                  <ShoppingCart size={18} />
                  Thêm vào giỏ hàng
                </Button>
              </div>

              <Separator className="mb-12" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-3">
                  <div className="h-10 w-10 rounded-full bg-electric-indigo/10 flex items-center justify-center text-electric-indigo">
                    <Truck size={20} />
                  </div>
                  <h4 className="font-bold text-sm">Giao hàng nhanh</h4>
                  <p className="text-xs text-cool-slate leading-relaxed">
                    Giao hàng toàn quốc trong vòng 2-3 ngày làm việc.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="h-10 w-10 rounded-full bg-electric-indigo/10 flex items-center justify-center text-electric-indigo">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="font-bold text-sm">Bảo đảm chất lượng</h4>
                  <p className="text-xs text-cool-slate leading-relaxed">
                    Sách thật 100%, chất lượng in ấn cao cấp nhất.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="h-10 w-10 rounded-full bg-electric-indigo/10 flex items-center justify-center text-electric-indigo">
                    <BookOpen size={20} />
                  </div>
                  <h4 className="font-bold text-sm">Đọc thử linh hoạt</h4>
                  <p className="text-xs text-cool-slate leading-relaxed">
                    Hỗ trợ đọc thử 10 trang đầu tiên cho mọi ấn bản.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

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
            <div className="md:col-span-4 p-8 bg-vapor-white rounded-3xl border border-border/30 flex flex-col items-center justify-center text-center">
              <span className="text-6xl font-bold text-deep-charcoal mb-2">
                4.8
              </span>
              <StarRating rating={4.8} />
              <p className="text-sm text-cool-slate mt-4">
                Dựa trên {MOCK_REVIEWS.length} đánh giá thực tế
              </p>
              <Button className="mt-8 w-full rounded-xl bg-white border border-border text-deep-charcoal hover:bg-muted font-bold text-xs uppercase tracking-widest h-12">
                Viết đánh giá
              </Button>
            </div>

            <div className="md:col-span-8 space-y-10">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="flex flex-col gap-4">
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
                  <p className="text-cool-slate leading-relaxed">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="text-xs font-bold text-cool-slate hover:text-electric-indigo transition-colors flex items-center gap-1.5">
                      <MessageSquare size={14} /> Trả lời
                    </button>
                    <button className="text-xs font-bold text-cool-slate hover:text-electric-indigo transition-colors">
                      Hữu ích?
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
