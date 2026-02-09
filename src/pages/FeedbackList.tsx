import { useState, useMemo } from "react";
import { filterFeedback, FeedbackFilters } from "../lib/feedback-store";
import { FeedbackCategory } from "../types/feedback";
import { Layout } from "../components/Layout";
import { FeedbackCard } from "../components/FeedbackCard";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Search, X, MessageSquare } from "lucide-react";

export default function FeedbackList() {
  const [filters, setFilters] = useState<FeedbackFilters>({});
  const [key, setKey] = useState(0);

  const results = useMemo(() => filterFeedback(filters), [filters, key]);

  const resetFilters = () => {
    setFilters({});
    setKey((k) => k + 1);
  };

  const hasFilters = filters.rating || filters.category || filters.search;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">All Feedback</h1>
          <p className="text-muted-foreground mt-1">{results.length} feedback entries</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, or comments..."
              className="pl-9"
              value={filters.search || ""}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            />
          </div>
          <Select
            value={filters.rating?.toString() || "all"}
            onValueChange={(v) => setFilters((f) => ({ ...f, rating: v === "all" ? undefined : Number(v) }))}
          >
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Rating" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              {[5, 4, 3, 2, 1].map((r) => (
                <SelectItem key={r} value={r.toString()}>{"★".repeat(r) + "☆".repeat(5 - r)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.category || "all"}
            onValueChange={(v) => setFilters((f) => ({ ...f, category: v === "all" ? undefined : (v as FeedbackCategory) }))}
          >
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Service">Service</SelectItem>
              <SelectItem value="Support">Support</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1">
              <X className="h-3 w-3" /> Reset
            </Button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No feedback found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((f) => <FeedbackCard key={f.id} feedback={f} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
