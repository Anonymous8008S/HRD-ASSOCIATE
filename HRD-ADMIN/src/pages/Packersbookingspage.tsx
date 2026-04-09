import { useEffect, useState } from "react";
import usePackersStore from "@/stores/usePackersStore";
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
import { Loader2, Truck } from "lucide-react";
import type { PackersBooking } from "@/types";

type FilterTab = "all" | PackersBooking["status"];

const STATUS_TABS: FilterTab[] = ["all", "pending", "confirmed", "in_transit", "delivered", "cancelled"];

const statusColor = (s: string) => {
  if (s === "pending")    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  if (s === "confirmed")  return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (s === "in_transit") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
  if (s === "delivered")  return "bg-green-500/10 text-green-400 border-green-500/20";
  if (s === "cancelled")  return "bg-red-500/10 text-red-400 border-red-500/20";
  return "bg-muted text-muted-foreground border-border";
};

const statusLabel = (s: string) => s.replace("_", " ");

const PackersBookingsPage = () => {
  const {
    bookings,
    counts,
    loading,
    loadingMore,
    hasMore,
    fetchBookings,
    fetchMore,
    fetchCounts,
    updateBooking,
    deleteBooking,
  } = usePackersStore();

  const [filter, setFilter] = useState<FilterTab>("all");
  const [selectedBooking, setSelectedBooking] = useState<PackersBooking | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── On mount ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchCounts();
    fetchBookings("all");
  }, []);

  // ── Re-fetch when filter changes ──────────────────────────────────────────
  useEffect(() => {
    fetchBookings(filter);
  }, [filter]);

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openModal = (booking: PackersBooking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  // ── Status update ─────────────────────────────────────────────────────────
  const handleStatusChange = async (id: string, status: PackersBooking["status"]) => {
    if (!id || updating) return;
    setUpdating(true);
    try {
      await updateBooking(id, { status });
      toast.success(`Booking marked as ${statusLabel(status)}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleModalStatusChange = async (status: PackersBooking["status"]) => {
    if (!selectedBooking?.id || updating) return;
    setUpdating(true);
    try {
      await updateBooking(selectedBooking.id, { status });
      toast.success(`Booking marked as ${statusLabel(status)}`);
      closeModal();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!id || deletingId) return;
    setDeletingId(id);
    try {
      await deleteBooking(id);
      toast.success("Booking deleted");
    } catch {
      toast.error("Failed to delete booking");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold font-serif gold-text flex items-center gap-2">
          <Truck className="w-6 h-6" />
          Packers &amp; Movers
        </h1>
        <p className="text-sm text-muted-foreground">Manage relocation booking requests</p>
      </div>

      {/* Filter Tabs — counts come from store, never change with active filter */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab}
            variant={filter === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tab)}
            className="capitalize"
            disabled={loading}
          >
            {statusLabel(tab)} ({counts[tab]})
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
                <TableHead className="text-muted-foreground">Phone</TableHead>
                <TableHead className="text-muted-foreground">From → To</TableHead>
                <TableHead className="text-muted-foreground">Date / Time</TableHead>
                <TableHead className="text-muted-foreground">Load</TableHead>
                <TableHead className="text-muted-foreground">Floors</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((b) => (
                  <TableRow key={b.id} className="border-border hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">{b.name}</TableCell>
                    <TableCell className="text-muted-foreground">{b.phone}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <span className="block max-w-[180px] truncate">
                        {b.from} → {b.destination}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {b.date} {b.time && `@ ${b.time}`}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm capitalize">
                      {b.weight}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm capitalize">
                      {b.floors}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor(b.status)}>
                        {statusLabel(b.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => openModal(b)}
                        >
                          View
                        </Button>
                        {b.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            disabled={updating}
                            onClick={() => handleStatusChange(b.id!, "confirmed")}
                          >
                            ✓ Confirm
                          </Button>
                        )}
                        {b.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            disabled={updating}
                            onClick={() => handleStatusChange(b.id!, "in_transit")}
                          >
                            🚛 In Transit
                          </Button>
                        )}
                        {b.status === "in_transit" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            disabled={updating}
                            onClick={() => handleStatusChange(b.id!, "delivered")}
                          >
                            ✓ Delivered
                          </Button>
                        )}
                        {b.status !== "delivered" && b.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                            disabled={updating}
                            onClick={() => handleStatusChange(b.id!, "cancelled")}
                          >
                            Cancel
                          </Button>
                        )}
                        {(b.status === "delivered" || b.status === "cancelled") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                            disabled={deletingId === b.id}
                            onClick={() => handleDelete(b.id!)}
                          >
                            {deletingId === b.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "Delete"
                            )}
                          </Button>
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

      {/* Detail / Action Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking — {selectedBooking?.name}</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-3 py-2">
              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                  <a
                    href={`tel:${selectedBooking.phone}`}
                    className="text-sm font-semibold text-foreground hover:underline"
                  >
                    {selectedBooking.phone}
                  </a>
                </div>
                <div className="border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <a
                    href={`mailto:${selectedBooking.email}`}
                    className="text-sm font-semibold text-foreground hover:underline truncate block"
                  >
                    {selectedBooking.email || "—"}
                  </a>
                </div>
              </div>

              {/* Route */}
              <div className="border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Route</p>
                <p className="text-sm text-foreground">
                  <span className="font-medium">{selectedBooking.from}</span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="font-medium">{selectedBooking.destination}</span>
                </p>
              </div>

              {/* Move details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Date &amp; Time</p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedBooking.date}
                    {selectedBooking.time && ` @ ${selectedBooking.time}`}
                  </p>
                </div>
                <div className="border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Load / Floor</p>
                  <p className="text-sm font-semibold text-foreground capitalize">
                    {selectedBooking.weight} · {selectedBooking.floors}
                  </p>
                </div>
              </div>

              {/* Current Status */}
              <div className="flex items-center justify-between border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Current status</p>
                <Badge variant="outline" className={statusColor(selectedBooking.status)}>
                  {statusLabel(selectedBooking.status)}
                </Badge>
              </div>

              {/* Quick status actions */}
              {selectedBooking.status !== "delivered" && selectedBooking.status !== "cancelled" && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedBooking.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs flex-1"
                      disabled={updating}
                      onClick={() => handleModalStatusChange("confirmed")}
                    >
                      ✓ Confirm Booking
                    </Button>
                  )}
                  {selectedBooking.status === "confirmed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs flex-1"
                      disabled={updating}
                      onClick={() => handleModalStatusChange("in_transit")}
                    >
                      🚛 Mark In Transit
                    </Button>
                  )}
                  {selectedBooking.status === "in_transit" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs flex-1"
                      disabled={updating}
                      onClick={() => handleModalStatusChange("delivered")}
                    >
                      ✓ Mark Delivered
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                    disabled={updating}
                    onClick={() => handleModalStatusChange("cancelled")}
                  >
                    Cancel Booking
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeModal} disabled={updating}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackersBookingsPage;