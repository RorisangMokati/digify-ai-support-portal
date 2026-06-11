import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { AlertCircle, CheckCircle2, SendHorizonal } from "lucide-react";

// ✅ SERVER FUNCTION (no fetch, no CORS)
//import { createTicket } from "@/server/tickets/create";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit Request — AI Support Operations" },
      {
        name: "description",
        content: "Open a new support request for the AI operations team.",
      },
    ],
  }),
  component: SubmitRequest,
});

function SubmitRequest() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("SUBMIT BUTTON CLICKED");

    // basic validation
    if (!subject.trim() || !description.trim() || !category) {
      setStatus("error");
      return;
    }

    try {
      // ✅ SERVER CALL (NO FETCH)
      console.log("Ticket would be created", {
  title: subject,
  message: description,
  category,
  priority,
});

setStatus("success");

      toast.success("Request submitted", {
        description: "Frontend test successful.",
      });

      // reset form
      setSubject("");
      setDescription("");
      setCategory("");
      setPriority("Medium");
    } catch (error) {
      console.error(error);

      setStatus("error");

      toast.error("Failed to create ticket");
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Submit a Support Request
        </h1>
        <p className="text-sm text-muted-foreground">
          Provide as much detail as possible. AI triage will route the ticket.
        </p>
      </div>

      {status === "success" && (
        <Alert className="border-green-500/30 bg-green-500/5">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Request submitted</AlertTitle>
          <AlertDescription>
            Your ticket has been created successfully.
          </AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing information</AlertTitle>
          <AlertDescription>
            Please fill in all required fields.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>
            Fields marked with * are required.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-5">
            {/* Subject */}
            <div className="grid gap-2">
              <Label>Subject *</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Short summary of the issue"
              />
            </div>

            {/* Category + Priority */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Infrastructure">
                      Infrastructure
                    </SelectItem>
                    <SelectItem value="AI Ops">AI Ops</SelectItem>
                    <SelectItem value="Data">Data</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Integrations">
                      Integrations
                    </SelectItem>
                    <SelectItem value="Automation">Automation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label>Description *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue..."
                rows={6}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSubject("");
                  setDescription("");
                  setCategory("");
                  setPriority("Medium");
                  setStatus("idle");
                }}
              >
                Reset
              </Button>

              <Button type="submit">
                Submit request{" "}
                <SendHorizonal className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}