// import { Feedback, FeedbackCategory, FeedbackStatus } from "@/types/feedback";
import { Feedback, FeedbackCategory, FeedbackStatus } from "../types/feedback";
const STORAGE_KEY = "feedback_entries";

const SEED_DATA: Feedback[] = [
  { id: "1", customerName: "Alice Johnson", email: "alice@example.com", rating: 5, category: "Product", comments: "Absolutely love the new dashboard redesign! It's so much easier to navigate.", status: "Resolved", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "2", customerName: "Bob Smith", email: "bob@example.com", rating: 4, category: "Service", comments: "Great customer service experience, the team was very helpful and responsive.", status: "Read", createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: "3", customerName: "Carol Williams", email: "carol@example.com", rating: 2, category: "Support", comments: "Had to wait too long for a response on my support ticket. Please improve response times.", status: "New", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "4", customerName: "David Lee", email: "david@example.com", rating: 5, category: "Product", comments: "The mobile app works flawlessly. Very impressed with the performance.", status: "Read", createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: "5", customerName: "Eva Martinez", email: "eva@example.com", rating: 3, category: "Service", comments: "Service was okay, but the onboarding process could be more streamlined.", status: "New", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "6", customerName: "Frank Chen", email: "frank@example.com", rating: 1, category: "Support", comments: "Very disappointed with the billing issue resolution. It took over a week.", status: "New", createdAt: new Date().toISOString() },
  { id: "7", customerName: "Grace Kim", email: "grace@example.com", rating: 4, category: "Product", comments: "Good product overall, but some features are hard to discover.", status: "Resolved", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "8", customerName: "Henry Brown", email: "henry@example.com", rating: 5, category: "Service", comments: "Exceptional service! The team went above and beyond to help me.", status: "Resolved", createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
];

function getAll(): Feedback[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(raw);
}

function save(feedbacks: Feedback[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
}

export function getAllFeedback(): Feedback[] {
  return getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addFeedback(data: Omit<Feedback, "id" | "status" | "createdAt">): Feedback {
  const all = getAll();
  const entry: Feedback = {
    ...data,
    id: crypto.randomUUID(),
    status: "New",
    createdAt: new Date().toISOString(),
  };
  all.push(entry);
  save(all);
  return entry;
}

export function deleteFeedback(id: string) {
  save(getAll().filter((f) => f.id !== id));
}

export function updateStatus(id: string, status: FeedbackStatus) {
  const all = getAll();
  const idx = all.findIndex((f) => f.id === id);
  if (idx !== -1) {
    all[idx].status = status;
    save(all);
  }
}

export function getFeedbackById(id: string): Feedback | undefined {
  return getAll().find((f) => f.id === id);
}

export interface FeedbackFilters {
  rating?: number;
  category?: FeedbackCategory;
  search?: string;
}

export function filterFeedback(filters: FeedbackFilters): Feedback[] {
  let results = getAllFeedback();
  if (filters.rating) results = results.filter((f) => f.rating === filters.rating);
  if (filters.category) results = results.filter((f) => f.category === filters.category);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (f) =>
        f.customerName.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.comments.toLowerCase().includes(q)
    );
  }
  return results;
}

export function getStats() {
  const all = getAllFeedback();
  const total = all.length;
  const avgRating = total ? all.reduce((s, f) => s + f.rating, 0) / total : 0;
  const byCategory = { Product: 0, Service: 0, Support: 0 };
  const byRating: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const byStatus = { New: 0, Read: 0, Resolved: 0 };
  all.forEach((f) => {
    byCategory[f.category]++;
    byRating[f.rating]++;
    byStatus[f.status]++;
  });
  return { total, avgRating, byCategory, byRating, byStatus, recent: all.slice(0, 5) };
}
