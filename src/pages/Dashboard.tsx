import { useMemo } from "react";
import { getStats } from "../lib/feedback-store";
import { Layout } from "../components/Layout";
import { FeedbackCard } from "../components/FeedbackCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { StarRating } from "../components/StarRating";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MessageSquare, Star, TrendingUp, Users } from "lucide-react";

const PIE_COLORS = [
  "hsl(172, 66%, 40%)",
  "hsl(262, 52%, 55%)",
  "hsl(38, 92%, 55%)",
];

export default function Dashboard() {
  const stats = useMemo(() => getStats(), []);

  const categoryData = Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }));
  const ratingData = Object.entries(stats.byRating).map(([rating, count]) => ({
    rating: `${rating}★`,
    count,
  }));

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of customer feedback insights</p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="animate-fade-in">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-medium">Total Feedback</span>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-display font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="animate-fade-in" style={{ animationDelay: "0.05s" }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-medium">Avg Rating</span>
                <Star className="h-4 w-4 text-accent" />
              </div>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-display font-bold">{stats.avgRating.toFixed(1)}</p>
                <StarRating value={Math.round(stats.avgRating)} readonly size="sm" />
              </div>
            </CardContent>
          </Card>
          <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-medium">New</span>
                <TrendingUp className="h-4 w-4 text-status-new" />
              </div>
              <p className="text-3xl font-display font-bold">{stats.byStatus.New}</p>
            </CardContent>
          </Card>
          <Card className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-medium">Resolved</span>
                <Users className="h-4 w-4 text-status-resolved" />
              </div>
              <p className="text-3xl font-display font-bold">{stats.byStatus.Resolved}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base font-display">Rating Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={ratingData}>
                  <XAxis dataKey="rating" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(222, 60%, 22%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base font-display">Category Breakdown</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent */}
        <div>
          <h2 className="text-xl font-display font-bold mb-4">Recent Feedback</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {stats.recent.map((f) => <FeedbackCard key={f.id} feedback={f} />)}
          </div>
        </div>
      </div>
    </Layout>
  );
}
