import { Star } from "lucide-react";

export default function LogoVN() {
  return (
    <div className="inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 bg-[#5c0b0b] rounded-full border border-[#751b1b] shadow-sm select-none cursor-default">
      
     
      <div className="flex items-center justify-center w-6 h-6 bg-[#da251d] rounded-full shrink-0 shadow-inner">
 
        <Star className="w-3.5 h-3.5 text-[#ffff00] fill-[#ffff00]" strokeWidth={0} />
      </div>

      <span className="text-[13px] font-bold text-white tracking-wide leading-none pt-[1px]">
        Hoàng Sa & Trường Sa là của Việt Nam!
      </span>
    </div>
  );
}