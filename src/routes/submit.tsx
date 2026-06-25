import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, CheckCircle2, SendHorizonal } from "lucide-react";
import { toast } from "sonner";

import { createSupportRequest, type SupportRequest } from "@/lib/support-requests";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriorityBadge, StatusBadge } from "@/components/status-badges";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit Request - AI Support Operations" },
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
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<SupportRequest | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [evidence, setEvidence] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !requesterName.trim() ||
      !requesterEmail.trim() ||
      !department
    ) {
      setStatus("error");
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setStatus("idle");
    setErrorMessage("");
    setCreatedRequest(null);

    try {
      const request = await createSupportRequest({
        title,
        description,
        requesterName,
        requesterEmail,
        department,
        evidenceLinks: evidence
          .split("\n")
          .map((link) => link.trim())
          .filter(Boolean),
      });

      setCreatedRequest(request);
      setStatus("success");
      toast.success("Request submitted", {
        description: "AI triage completed and the tracker has been updated.",
      });

      setTitle("");
      setDescription("");
      setRequesterName("");
      setRequesterEmail("");
      setDepartment("");
      setEvidence("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create request.";
      setStatus("error");
      setErrorMessage(message);
      toast.error("Failed to create request", { description: message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Submit a Support Request</h1>
        <p className="text-sm text-muted-foreground">
          Capture intake details, evidence links, and AI-ready context for the operations tracker.
        </p>
      </div>

      {status === "success" && createdRequest && (
        <Alert className="border-green-500/30 bg-green-500/5">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Request submitted and triaged</AlertTitle>
          <AlertDescription>
            <div className="mt-2 grid gap-3">
              <p>{createdRequest.ai_summary}</p>
              <div className="flex flex-wrap gap-2">
                <PriorityBadge priority={createdRequest.priority} />
                <StatusBadge status={createdRequest.status} />
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                  Owner: {createdRequest.assigned_owner}
                </span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Request not submitted</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>Fields marked with * are required.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="requesterName">Requester name *</Label>
                <Input
                  id="requesterName"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="requesterEmail">Requester email *</Label>
                <Input
                  id="requesterEmail"
                  type="email"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-[1fr_260px]">
              <div className="grid gap-2">
                <Label htmlFor="title">Request title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Short summary of the request"
                />
              </div>

              <div className="grid gap-2">
                <Label>Department *</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="IT Support">IT Support</SelectItem>
                    <SelectItem value="Data">Data</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Project Team">Project Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the request, business impact, deadline, and any known blockers."
                rows={7}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="evidence">Evidence links</Label>
              <Textarea
                id="evidence"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Paste one link per line: screenshots, documents, tickets, spreadsheets, or meeting notes."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={submitting}
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setRequesterName("");
                  setRequesterEmail("");
                  setDepartment("");
                  setEvidence("");
                  setStatus("idle");
                  setErrorMessage("");
                  setCreatedRequest(null);
                }}
              >
                Reset
              </Button>

              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit request"}
                <SendHorizonal className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
