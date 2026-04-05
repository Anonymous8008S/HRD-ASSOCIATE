import { useEffect } from "react";
import { Building2, Briefcase, FolderKanban, MessageSquare, Clock, CheckCircle } from "lucide-react";
import usePropertyStore from "@/stores/usePropertyStore";
import useCommercialStore from "@/stores/useCommercialStore";
import useProjectStore from "@/stores/useProjectStore";
import useInquiryStore from "@/stores/useInquiryStore";

const StatCard = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: number; sub?: string }) => (
  <div className="bg-card border border-border rounded-lg p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-muted-foreground text-sm">{label}</span>
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <p className="text-2xl font-bold font-serif text-foreground">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </div>
);

const Dashboard = () => {
  const { properties, fetchAll: fetchProperties } = usePropertyStore();
  const { properties: commercials, fetchAll: fetchCommercials } = useCommercialStore();
  // const { projects, fetchProjects } = useProjectStore();
  const { inquiries, fetchAll: fetchInquiries } = useInquiryStore();

  useEffect(() => {
    fetchProperties();
    fetchCommercials();
    // fetchProjects();
    fetchInquiries();
  }, []);

  const pendingProps = properties.filter((p) => p.status === "pending").length;
  const pendingComm = commercials.filter((p) => p.status === "pending").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif gold-text">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome to HRD Associates Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Properties" value={properties.length} sub={`${pendingProps} pending approval`} />
        <StatCard icon={Briefcase} label="Commercial" value={commercials.length} sub={`${pendingComm} pending approval`} />
        {/* <StatCard icon={FolderKanban} label="Projects" value={projects.length} /> */}
        <StatCard icon={MessageSquare} label="Inquiries" value={inquiries.length} sub={`${inquiries.filter((i) => i.status === "new").length} new`} />
      </div>

      {/* Pending Approvals */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h2 className="font-semibold font-serif text-foreground">Pending Approvals</h2>
        </div>
        <div className="p-4">
          {[...properties.filter((p) => p.status === "pending"), ...commercials.filter((p) => p.status === "pending")].length === 0 ? (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-primary/40" />
              <p className="text-sm">No pending approvals</p>
            </div>
          ) : (
            <div className="space-y-2">
              {properties.filter((p) => p.status === "pending").map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">Property • {p.location}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Pending</span>
                </div>
              ))}
              {commercials.filter((p) => p.status === "pending").map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">Commercial • {p.location}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Pending</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
