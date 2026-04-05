import { useEffect, useState } from "react";
import useInquiryStore from "@/stores/useInquiryStore";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { Inquiry } from "@/types";

type FilterTab = "all" | "new" | "contacted" | "closed";

const InquiriesPage = () => {
  const {
    inquiries,
    counts,
    loading,
    loadingMore,
    hasMore,
    fetchInquiries,
    fetchMore,
    fetchCounts,
    updateStatus,
  } = useInquiryStore();

  const [filter, setFilter] = useState<FilterTab>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionDone, setActionDone] = useState<"phone" | "email" | null>(null);
  const [updating, setUpdating] = useState(false);

  // ── On mount: fetch counts once + initial page ────────────────────────────
  useEffect(() => {
    fetchCounts();
    fetchInquiries("all");
  }, []);

  // ── Re-fetch list when filter tab changes ─────────────────────────────────
  useEffect(() => {
    fetchInquiries(filter);
  }, [filter]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const statusColor = (s: string) => {
    if (s === "new") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (s === "contacted") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    return "bg-green-500/10 text-green-400 border-green-500/20";
  };

  const openLink = (href: string) => {
    const a = document.createElement("a");
    a.href = href;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const markContacted = async (inquiry: Inquiry) => {
    if (!inquiry.id) { toast.error("Missing inquiry ID"); return; }
    if (updating) return;
    setUpdating(true);
    try {
      await updateStatus(inquiry.id, "contacted");
      toast.success(`${inquiry.name} marked as contacted`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleClose = async (id: string) => {
    if (!id || updating) return;
    setUpdating(true);
    try {
      await updateStatus(id, "closed");
      toast.success("Inquiry closed");
    } catch {
      toast.error("Failed to close inquiry");
    } finally {
      setUpdating(false);
    }
  };

  // ── Modal ─────────────────────────────────────────────────────────────────
  const openContactModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setActionDone(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedInquiry(null);
    setActionDone(null);
  };

  const handleCallInModal = (inquiry: Inquiry) => {
    openLink(`tel:${inquiry.phone}`);
    if (actionDone === null) setActionDone("phone");
  };

  const handleEmailInModal = (inquiry: Inquiry) => {
    openLink(`mailto:${inquiry.email}`);
    if (actionDone === null) setActionDone("email");
  };

  const handleConfirmContacted = async () => {
    if (!selectedInquiry || updating) return;
    setUpdating(true);
    try {
      await updateStatus(selectedInquiry.id!, "contacted");
      toast.success(`${selectedInquiry.name} marked as contacted`);
      closeModal();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleEmailRow = (inquiry: Inquiry) => {
    openLink(`mailto:${inquiry.email}`);
    markContacted(inquiry);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold font-serif gold-text">Inquiries</h1>
        <p className="text-sm text-muted-foreground">Manage customer inquiries</p>
      </div>

      {/* Filter Tabs — counts come from store, never change with active filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "new", "contacted", "closed"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
            disabled={loading}
          >
            {f} ({counts[f]})
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">Phone</TableHead>
                <TableHead className="text-muted-foreground">Subject</TableHead>
                <TableHead className="text-muted-foreground">Message</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No inquiries found
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((i) => (
                  <TableRow key={i.id} className="border-border hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">{i.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{i.email}</TableCell>
                    <TableCell className="text-muted-foreground">{i.phone}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">
                      {i.subject || "N/A"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                      {i.message}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor(i.status)}>
                        {i.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {i.status === "new" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openContactModal(i)}
                              className="text-xs"
                              disabled={updating}
                            >
                              📞 Contact
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEmailRow(i)}
                              className="text-xs"
                              disabled={updating}
                            >
                              ✉️ Email
                            </Button>
                          </>
                        )}
                        {i.status === "contacted" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleClose(i.id!)}
                            className="text-xs"
                            disabled={updating}
                          >
                            ✓ Close
                          </Button>
                        )}
                        {i.status === "closed" && (
                          <span className="text-xs text-muted-foreground italic">Resolved</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Load More */}
        {hasMore && !loading && (
          <div className="flex justify-center py-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMore}
              disabled={loadingMore}
              className="min-w-[120px]"
            >
              {loadingMore ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />Loading...</>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {selectedInquiry?.name}</DialogTitle>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-3 py-2">
              <div className="border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Subject</p>
                <p className="text-sm text-foreground">{selectedInquiry.subject || "N/A"}</p>
              </div>

              <div className="border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Message</p>
                <p className="text-sm text-foreground">{selectedInquiry.message}</p>
              </div>

              <div className="flex items-center justify-between border border-border rounded-lg p-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                  <p className="text-base font-semibold text-foreground">{selectedInquiry.phone}</p>
                </div>
                <Button
                  size="sm"
                  variant={actionDone === "phone" ? "default" : "outline"}
                  onClick={() => handleCallInModal(selectedInquiry)}
                  className="text-xs"
                >
                  {actionDone === "phone" ? "✓ Called" : "📞 Call"}
                </Button>
              </div>

              <div className="flex items-center justify-between border border-border rounded-lg p-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <p className="text-base font-semibold text-foreground">{selectedInquiry.email}</p>
                </div>
                <Button
                  size="sm"
                  variant={actionDone === "email" ? "default" : "outline"}
                  onClick={() => handleEmailInModal(selectedInquiry)}
                  className="text-xs"
                >
                  {actionDone === "email" ? "✓ Emailed" : "✉️ Email"}
                </Button>
              </div>

              {actionDone === null ? (
                <p className="text-xs text-muted-foreground text-center">
                  Call or email the customer first, then mark as contacted.
                </p>
              ) : (
                <p className="text-xs text-green-400 text-center">
                  ✓ Action recorded via {actionDone}. Ready to mark as contacted.
                </p>
              )}
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={closeModal} disabled={updating}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmContacted}
              disabled={actionDone === null || updating}
            >
              {updating ? "Saving..." : "✓ Mark as Contacted"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InquiriesPage;