import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PleaseSelectAddress() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>---</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Vui lòng chọn địa chỉ giao hàng</p>
      </TooltipContent>
    </Tooltip>
  );
}
