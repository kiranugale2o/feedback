
// import { FeedbackCategory, FeedbackStatus } from "@/types/feedback";
import { FeedbackCategory,FeedbackStatus } from "../types/feedback";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
;

const categoryStyles: Record<FeedbackCategory, string> = {
  Product: "bg-category-product/10 text-category-product border-category-product/20",
  Service: "bg-category-service/10 text-category-service border-category-service/20",
  Support: "bg-category-support/10 text-category-support border-category-support/20",
};

const statusStyles: Record<FeedbackStatus, string> = {
  New: "bg-status-new/10 text-status-new border-status-new/20",
  Read: "bg-status-read/10 text-status-read border-status-read/20",
  Resolved: "bg-status-resolved/10 text-status-resolved border-status-resolved/20",
};

export function CategoryBadge({ category }: { category: FeedbackCategory }) {
  return (
    <Badge variant="outline" className={cn("font-medium text-xs", categoryStyles[category])}>
      {category}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: FeedbackStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium text-xs", statusStyles[status])}>
      {status}
    </Badge>
  );
}
