import { Star } from "lucide-react";
import { cn } from "../lib/utils";


interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" };

export function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            "transition-transform",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizes[size],
              "transition-colors",
              star <= value
                ? "fill-accent text-accent"
                : "fill-transparent text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}
