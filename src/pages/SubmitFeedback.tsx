import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addFeedback } from "../lib/feedback-store";
import { FeedbackCategory } from "../types/feedback";
import { StarRating } from "../components/StarRating";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";

const schema = z.object({
  customerName: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  rating: z.number().min(1, "Please select a rating").max(5),
  category: z.enum(["Product", "Service", "Support"], { required_error: "Select a category" }),
  comments: z.string().trim().min(1, "Comments are required").max(1000, "Max 1000 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function SubmitFeedback() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { customerName: "", email: "", rating: 0, category: undefined, comments: "" },
  });

  function onSubmit(data: FormValues) {
    addFeedback({
      customerName: data.customerName,
      email: data.email,
      rating: data.rating,
      category: data.category,
      comments: data.comments,
    });
    setSubmitted(true);
    toast.success("Feedback submitted successfully!");
  }

  if (submitted) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto text-center py-20 animate-scale-in">
          <div className="h-16 w-16 rounded-full bg-status-resolved/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-status-resolved" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-6">Your feedback has been submitted successfully.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setSubmitted(false); form.reset(); }}>Submit Another</Button>
            <Button variant="outline" onClick={() => navigate("/feedback")}>View All Feedback</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Submit Feedback</CardTitle>
            <CardDescription>We value your input. Share your experience with us.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="customerName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input placeholder="john@example.com" type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="rating" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <StarRating value={field.value} onChange={field.onChange} size="lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Product">Product</SelectItem>
                          <SelectItem value="Service">Service</SelectItem>
                          <SelectItem value="Support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="comments" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl><Textarea placeholder="Tell us about your experience..." rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" size="lg" className="w-full sm:w-auto gap-2">
                  <Send className="h-4 w-4" /> Submit Feedback
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
