import { useState, useMemo } from "react";
import { getAllFeedback ,deleteFeedback, updateStatus} from "../lib/feedback-store";
import { Feedback, FeedbackStatus } from "../types/feedback";
import { Layout } from "../components/Layout";
import { StarRating } from "../components/StarRating";
import { CategoryBadge, StatusBadge } from "../components/FeedbackBadges";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { Trash2, Eye, RefreshCw } from "lucide-react";

export default function AdminPanel() {
  const [refreshKey, setRefreshKey] = useState(0);
  const feedbacks = useMemo(() => getAllFeedback(), [refreshKey]);
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleDelete = () => {
    if (deleteId) {
      deleteFeedback(deleteId);
      toast.success("Feedback deleted");
      setDeleteId(null);
      refresh();
    }
  };

  const handleStatusChange = (id: string, status: FeedbackStatus) => {
    updateStatus(id, status);
    toast.success(`Status updated to ${status}`);
    refresh();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage and moderate feedback</p>
          </div>
          <Button variant="outline" size="sm" onClick={refresh} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((f) => (
                    <TableRow key={f.id} className="group">
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{f.customerName}</p>
                          <p className="text-xs text-muted-foreground">{f.email}</p>
                        </div>
                      </TableCell>
                      <TableCell><StarRating value={f.rating} readonly size="sm" /></TableCell>
                      <TableCell><CategoryBadge category={f.category} /></TableCell>
                      <TableCell>
                        <Select value={f.status} onValueChange={(v) => handleStatusChange(f.id, v as FeedbackStatus)}>
                          <SelectTrigger className="h-7 w-[110px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Read">Read</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(f.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(f)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(f.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Feedback Details</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> <span className="font-medium ml-1">{selected.customerName}</span></div>
                  <div><span className="text-muted-foreground">Email:</span> <span className="font-medium ml-1">{selected.email}</span></div>
                  <div className="flex items-center gap-2"><span className="text-muted-foreground">Rating:</span> <StarRating value={selected.rating} readonly size="sm" /></div>
                  <div className="flex items-center gap-2"><span className="text-muted-foreground">Category:</span> <CategoryBadge category={selected.category} /></div>
                  <div className="flex items-center gap-2"><span className="text-muted-foreground">Status:</span> <StatusBadge status={selected.status} /></div>
                  <div><span className="text-muted-foreground">Date:</span> <span className="ml-1">{format(new Date(selected.createdAt), "PPp")}</span></div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Comments</p>
                  <p className="text-sm bg-secondary p-3 rounded-lg">{selected.comments}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Feedback</DialogTitle>
              <DialogDescription>This action cannot be undone. Are you sure?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
