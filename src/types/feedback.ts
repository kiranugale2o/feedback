export type FeedbackCategory = "Product" | "Service" | "Support";
export type FeedbackStatus = "New" | "Read" | "Resolved";

export interface Feedback {
  id: string;
  customerName: string;
  email: string;
  rating: number;
  category: FeedbackCategory;
  comments: string;
  status: FeedbackStatus;
  createdAt: string;
}
