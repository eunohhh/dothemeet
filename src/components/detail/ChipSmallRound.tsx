import React from "react";
import { cn } from "@/lib/utils";
import { IChipSmallRound } from "@/types/detail/i-components";

export const ChipSmallRound: React.FC<IChipSmallRound> = ({
  text,
  variant,
  className,
}) => {
  return (
    <div 
      className={cn(
        'px-2 py-1 rounded-full text-caption-normal font-medium text-[12px] text-gray600', 
        variant === 'gray' && 'bg-gray200',
        variant === 'soso' && 'bg-background300 text-red200 font-semibold',
        variant === 'good' && 'bg-background300 text-orange200 font-semibold',
        variant === 'recommend' && 'bg-background300 text-olive200 font-semibold',

        className
      )}
    >
      {text}
    </div>
  );
};
