import { Link } from "react-router-dom";
import { MapPin, Maximize, Clock } from "lucide-react";
import type { CommercialProperty } from "@/types";

const TYPE_LABELS: Record<CommercialProperty["type"], string> = {
  office: "Office",
  shop: "Shop",
  warehouse: "Warehouse",
  plot: "Plot",
};

const STATUS_STYLES = {
  approved: { bg: "bg-emerald-500/90", text: "text-white", label: "Approved" },
  pending:  { bg: "bg-amber-500/90",   text: "text-white", label: "Pending"  },
  rejected: { bg: "bg-red-500/90",     text: "text-white", label: "Rejected" },
};

function formatPrice(price: number): string {
  if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(2)} Cr`;
  if (price >= 100_000)    return `₹${(price / 100_000).toFixed(2)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

function formatDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const CommercialCard = ({
  id, title, price, location, area, type, images, status, role, createdAt,
}: CommercialProperty) => {
  const coverImage = images?.length > 0
    ? images[0]
    : `https://placehold.co/800x600/1a2744/c9a84c?text=No+Image`;

  const statusStyle = status ? STATUS_STYLES[status] : null;
  const postedDate = formatDate(createdAt);

  return (
    <Link
      to={`/commercial/${id}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-border"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {images?.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">
            +{images.length - 1} photos
          </span>
        )}

        {statusStyle && role && (
          <span className={`absolute top-3 left-3 ${statusStyle.bg} ${statusStyle.text} text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm`}>
            {statusStyle.label}
          </span>
        )}

        <span className="absolute top-3 right-3 bg-navy/80 text-gold text-xs font-medium px-3 py-1 rounded backdrop-blur-sm">
          {TYPE_LABELS[type]}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-base font-heading font-semibold text-foreground leading-snug mb-1 line-clamp-1">
          {title}
        </p>

        <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </p>

        {/* No beds/baths — just area */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Maximize className="w-3.5 h-3.5" />
            {area}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 gap-2">
          <span className="text-lg font-bold text-gold-dark leading-none">
            {formatPrice(price)}
          </span>
          <div className="flex items-center gap-3">
            {postedDate && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {postedDate}
              </span>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap group-hover:text-foreground transition-colors">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommercialCard;