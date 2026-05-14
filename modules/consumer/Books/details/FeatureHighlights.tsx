import { BookOpen, ShieldCheck, Truck } from "lucide-react";
import type { ReactNode } from "react";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: <Truck size={20} />,
    title: "Giao hàng nhanh",
    description: "Giao hàng toàn quốc trong vòng 2-3 ngày làm việc.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Bảo đảm chất lượng",
    description: "Sách thật 100%, chất lượng in ấn cao cấp nhất.",
  },
  {
    icon: <BookOpen size={20} />,
    title: "Đọc thử linh hoạt",
    description: "Hỗ trợ đọc thử 10 trang đầu tiên cho mọi ấn bản.",
  },
];

export function FeatureHighlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {FEATURES.map((feature) => (
        <div key={feature.title} className="flex flex-col gap-3">
          <div className="h-10 w-10 rounded-full bg-electric-indigo/10 flex items-center justify-center text-electric-indigo">
            {feature.icon}
          </div>
          <h4 className="font-bold text-sm">{feature.title}</h4>
          <p className="text-xs text-cool-slate leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
