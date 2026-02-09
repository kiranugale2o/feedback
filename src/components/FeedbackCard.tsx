// import { Card, CardContent } from "@/components/ui/card";
// import { Feedback } from "@/types/feedback";
// import { StarRating } from "@/components/StarRating";
// import { CategoryBadge, StatusBadge } from "@/components/FeedbackBadges";
import { Card,CardContent } from "./ui/card";
import { Feedback } from "../types/feedback";
import { StarRating } from "./StarRating";
import { CategoryBadge,StatusBadge } from "./FeedbackBadges";
import { format } from "date-fns";
import { User, Mail, Clock } from "lucide-react";

export function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <Card className="animate-fade-in hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{feedback.customerName}</p>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="text-xs truncate">{feedback.email}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CategoryBadge category={feedback.category} />
            <StatusBadge status={feedback.status} />
          </div>
        </div>
        <StarRating value={feedback.rating} readonly size="sm" />
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{feedback.comments}</p>
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground/70">
          <Clock className="h-3 w-3" />
          {format(new Date(feedback.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </div>
      </CardContent>
    </Card>
  );
}
