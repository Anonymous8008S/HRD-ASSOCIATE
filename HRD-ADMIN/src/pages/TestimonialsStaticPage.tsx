import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Star, Trash2, Pencil, Plus, Upload, X, Home, Users, Award, Handshake, BarChart3, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import useTestimonialStore from "@/stores/useTestimonialStore";
import useStatisticStore from "@/stores/useStatisticStore";
import { uploadFilesWithProgress } from "@/lib/uploadFiles";
export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Statistic {
  id?: string;
  icon: string;
  value: string;
  label: string;
  createdAt?: string;
  updatedAt?: string;
}

const ICON_OPTIONS = [
  { value: "Home", label: "Home", Icon: Home },
  { value: "Users", label: "Users", Icon: Users },
  { value: "Award", label: "Award", Icon: Award },
  { value: "Handshake", label: "Handshake", Icon: Handshake },
  { value: "BarChart3", label: "Chart", Icon: BarChart3 },
];

const getIconComponent = (name: string) => {
  const found = ICON_OPTIONS.find((o) => o.value === name);
  return found ? found.Icon : Home;
};

const TestimonialsStatsPage = () => {
  const { toast } = useToast();

  // Testimonials
  const { testimonials, loading: tLoading, fetchAll: fetchTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonialStore();
  const [tDialogOpen, setTDialogOpen] = useState(false);
  const [editingT, setEditingT] = useState<Testimonial | null>(null);
  const [tForm, setTForm] = useState({ name: "", role: "", text: "", rating: 5, image: "" });
  const [tImageFile, setTImageFile] = useState<File | null>(null);
  const [tUploadProgress, setTUploadProgress] = useState(0);
  const [tActionLoading, setTActionLoading] = useState(false);
  const tFileRef = useRef<HTMLInputElement>(null);

  // Statistics
  const { statistics, loading: sLoading, fetchAll: fetchStatistics, addStatistic, updateStatistic, deleteStatistic } = useStatisticStore();
  const [sDialogOpen, setSDialogOpen] = useState(false);
  const [editingS, setEditingS] = useState<Statistic | null>(null);
  const [sForm, setSForm] = useState({ icon: "Home", value: "", label: "" });
  const [sActionLoading, setSActionLoading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
    fetchStatistics();
  }, []);

  // ── Testimonial handlers ──
  const openAddT = () => {
    setEditingT(null);
    setTForm({ name: "", role: "", text: "", rating: 5, image: "" });
    setTImageFile(null);
    setTUploadProgress(0);
    setTDialogOpen(true);
  };

  const openEditT = (t: Testimonial) => {
    setEditingT(t);
    setTForm({ name: t.name, role: t.role, text: t.text, rating: t.rating, image: t.image || "" });
    setTImageFile(null);
    setTUploadProgress(0);
    setTDialogOpen(true);
  };

  const handleSaveT = async () => {
    if (!tForm.name || !tForm.text) {
      toast({ title: "Error", description: "Name and text are required", variant: "destructive" });
      return;
    }
    setTActionLoading(true);
    try {
      let imageUrl = tForm.image;
      if (tImageFile) {
        const urls = await uploadFilesWithProgress([tImageFile], "testimonials", setTUploadProgress);
        imageUrl = urls[0];
      }
      const data = { ...tForm, image: imageUrl };
      if (editingT?.id) {
        await updateTestimonial(editingT.id, data);
        toast({ title: "Updated", description: "Testimonial updated successfully" });
      } else {
        await addTestimonial(data);
        toast({ title: "Added", description: "Testimonial added successfully" });
      }
      setTDialogOpen(false);
      fetchTestimonials();
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setTActionLoading(false);
    }
  };

  const handleDeleteT = async (id: string) => {
    await deleteTestimonial(id);
    toast({ title: "Deleted", description: "Testimonial removed" });
  };

  // ── Statistic handlers ──
  const openAddS = () => {
    setEditingS(null);
    setSForm({ icon: "Home", value: "", label: "" });
    setSDialogOpen(true);
  };

  const openEditS = (s: Statistic) => {
    setEditingS(s);
    setSForm({ icon: s.icon, value: s.value, label: s.label });
    setSDialogOpen(true);
  };

  const handleSaveS = async () => {
    if (!sForm.value || !sForm.label) {
      toast({ title: "Error", description: "Value and label are required", variant: "destructive" });
      return;
    }
    setSActionLoading(true);
    try {
      if (editingS?.id) {
        await updateStatistic(editingS.id, sForm);
        toast({ title: "Updated", description: "Statistic updated successfully" });
      } else {
        await addStatistic(sForm);
        toast({ title: "Added", description: "Statistic added successfully" });
      }
      setSDialogOpen(false);
      fetchStatistics();
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setSActionLoading(false);
    }
  };

  const handleDeleteS = async (id: string) => {
    await deleteStatistic(id);
    toast({ title: "Deleted", description: "Statistic removed" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-serif gold-text">Content Management</h1>

      <Tabs defaultValue="testimonials" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="testimonials" className="gap-2">
            <MessageSquareQuote className="w-4 h-4" /> Testimonials
          </TabsTrigger>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Statistics
          </TabsTrigger>
        </TabsList>

        {/* ═══ TESTIMONIALS TAB ═══ */}
        <TabsContent value="testimonials">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-serif">Testimonials</CardTitle>
              <Button size="sm" onClick={openAddT}><Plus className="w-4 h-4 mr-1" /> Add</Button>
            </CardHeader>
            <CardContent>
              {tLoading ? (
                <p className="text-muted-foreground text-sm">Loading...</p>
              ) : testimonials.length === 0 ? (
                <p className="text-muted-foreground text-sm">No testimonials yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Photo</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden md:table-cell">Text</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonials.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={t.image} alt={t.name} />
                            <AvatarFallback className="bg-secondary text-xs">{t.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell className="text-muted-foreground">{t.role}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-[200px] truncate text-muted-foreground">{t.text}</TableCell>
                        <TableCell>
                          <div className="flex gap-0.5">
                            {Array.from({ length: t.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEditT(t)}><Pencil className="w-4 h-4" /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
                                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteT(t.id!)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ STATISTICS TAB ═══ */}
        <TabsContent value="statistics">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-serif">Statistics</CardTitle>
              <Button size="sm" onClick={openAddS}><Plus className="w-4 h-4 mr-1" /> Add</Button>
            </CardHeader>
            <CardContent>
              {sLoading ? (
                <p className="text-muted-foreground text-sm">Loading...</p>
              ) : statistics.length === 0 ? (
                <p className="text-muted-foreground text-sm">No statistics yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Icon</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statistics.map((s) => {
                      const IconComp = getIconComponent(s.icon);
                      return (
                        <TableRow key={s.id}>
                          <TableCell><IconComp className="w-5 h-5 text-primary" /></TableCell>
                          <TableCell className="font-semibold">{s.value}</TableCell>
                          <TableCell className="text-muted-foreground">{s.label}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openEditS(s)}><Pencil className="w-4 h-4" /></Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete statistic?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteS(s.id!)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ═══ TESTIMONIAL DIALOG ═══ */}
      <Dialog open={tDialogOpen} onOpenChange={setTDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingT ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={tForm.name} onChange={(e) => setTForm({ ...tForm, name: e.target.value })} placeholder="Full name" />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={tForm.role} onChange={(e) => setTForm({ ...tForm, role: e.target.value })} placeholder="e.g. Home Buyer" />
            </div>
            <div>
              <Label>Testimonial Text</Label>
              <Textarea value={tForm.text} onChange={(e) => setTForm({ ...tForm, text: e.target.value })} placeholder="What they said..." rows={3} />
            </div>
            <div>
              <Label>Rating (1-5)</Label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} type="button" onClick={() => setTForm({ ...tForm, rating: r })}>
                    <Star className={`w-5 h-5 ${r <= tForm.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Photo</Label>
              <input ref={tFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                if (e.target.files?.[0]) setTImageFile(e.target.files[0]);
              }} />
              <div className="flex items-center gap-3 mt-1">
                {(tImageFile || tForm.image) && (
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={tImageFile ? URL.createObjectURL(tImageFile) : tForm.image} />
                    <AvatarFallback>{tForm.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <Button type="button" variant="outline" size="sm" onClick={() => tFileRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1" /> {tForm.image || tImageFile ? "Change" : "Upload"}
                </Button>
                {(tImageFile || tForm.image) && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => { setTImageFile(null); setTForm({ ...tForm, image: "" }); }}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {tUploadProgress > 0 && tUploadProgress < 100 && <Progress value={tUploadProgress} className="mt-2 h-2" />}
            </div>
            <Button className="w-full" onClick={handleSaveT} disabled={tActionLoading}>
              {tActionLoading ? (
                <span className="flex items-center justify-center"><Loader2 className="animate-spin w-4 h-4 mr-2" />Saving...</span>
              ) : (
                editingT ? "Update" : "Add" 
              )} Testimonial
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══ STATISTIC DIALOG ═══ */}
      <Dialog open={sDialogOpen} onOpenChange={setSDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingS ? "Edit Statistic" : "Add Statistic"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Icon</Label>
              <Select value={sForm.icon} onValueChange={(v) => setSForm({ ...sForm, icon: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      <span className="flex items-center gap-2"><o.Icon className="w-4 h-4" /> {o.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Value</Label>
              <Input value={sForm.value} onChange={(e) => setSForm({ ...sForm, value: e.target.value })} placeholder="e.g. 2,500+" />
            </div>
            <div>
              <Label>Label</Label>
              <Input value={sForm.label} onChange={(e) => setSForm({ ...sForm, label: e.target.value })} placeholder="e.g. Properties Listed" />
            </div>
            <Button className="w-full" onClick={handleSaveS} disabled={sActionLoading}>
              {sActionLoading ? (
                <span className="flex items-center justify-center"><Loader2 className="animate-spin w-4 h-4 mr-2" />Saving...</span>
              ) : (
                editingS ? "Update" : "Add" 
              )} Statistic
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsStatsPage;
