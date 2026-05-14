interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-border rounded-xl h-14 overflow-hidden bg-white">
      <button
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        className="w-12 h-full flex items-center justify-center hover:bg-muted transition-colors text-xl"
      >
        -
      </button>
      <div className="w-12 h-full flex items-center justify-center font-bold">
        {quantity}
      </div>
      <button
        onClick={() => onQuantityChange(quantity + 1)}
        className="w-12 h-full flex items-center justify-center hover:bg-muted transition-colors text-xl"
      >
        +
      </button>
    </div>
  );
}
