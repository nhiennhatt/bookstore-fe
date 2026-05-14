import { BookVariant } from "@/lib/interfaces/bookVariant";

interface VariantSelectorProps {
  variants: BookVariant[];
  selectedVariantId: string | null;
  onSelect: (variantId: string, imageIndex: number) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold uppercase tracking-widest text-deep-charcoal">
        Chọn phiên bản
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {variants.map((variant, index) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant.id, index + 1)}
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
  );
}
