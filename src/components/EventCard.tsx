"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type Event = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  ctaLabel: string;
  ctaLink: string;
  image: string;
  position: string;
};

type Props = {
  event: Event;
};

export default function EventCard({ event }: Props) {
  const router = useRouter();

  return (
    <div className="px-4 sm:px-6 my-2">
      <div
        className="relative overflow-hidden rounded-2xl cursor-pointer group"
        style={{ width: "90%", maxWidth: "900px", margin: "0 auto", height: "180px" }}
        onClick={() => event.ctaLink && router.push(event.ctaLink)}
      >
        {/* Background image */}
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-8 gap-2">
          {event.badge && (
            <span className="inline-flex self-start text-[9px] font-bold tracking-[0.2em] uppercase bg-white/20 backdrop-blur-sm text-white border border-white/30 px-2.5 py-1 rounded-full">
              {event.badge}
            </span>
          )}
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">{event.title}</h3>
            {event.subtitle && (
              <p className="text-sm text-white/70 mt-0.5 font-light">{event.subtitle}</p>
            )}
          </div>
          {event.description && (
            <p className="text-xs text-white/60 max-w-xs leading-relaxed hidden sm:block line-clamp-2">{event.description}</p>
          )}
          {event.ctaLabel && (
            <button className="inline-flex self-start items-center gap-1.5 text-xs font-bold text-white border border-white/40 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full mt-1">
              {event.ctaLabel} <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
