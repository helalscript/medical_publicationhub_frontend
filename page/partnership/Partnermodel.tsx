"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { getPartnerModelSectionData } from "@/services/partnership";

interface PartnerModelItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface ApiPartnerData {
  content: {
    id: number;
    title: string;
  };
  items: PartnerModelItem[];
}

export default function PartnershipModels() {
  const [data, setData] = useState<ApiPartnerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPartnerModelSectionData();
        if (res?.status) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error fetching partner model data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-[#0A0C0F] flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
      </div>
    );
  }

  if (!data || data.items.length < 4) return null;

  const items = data.items;

  // Split title if it has more than one word to highlight the first word
  const titleWords = data.content.title.split(" ");
  const firstWord = titleWords[0];
  const restOfTitle = titleWords.slice(1).join(" ");

  return (
    <div
      style={{
        background: "#0A0C0F", // Consistent with page theme
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "60px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "860px" }}>
        {/* Title */}
        <h2
          style={{
            textAlign: "center",
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: "60px",
            letterSpacing: "0.01em",
          }}
        >
          <span style={{ color: "#22d3ee" }}>{firstWord}</span> {restOfTitle}
        </h2>

        {/* Diagram container — fixed 860×320 coordinate space */}
        <div style={{ position: "relative", height: "320px" }}>

          {/* SVG lines layer */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
            viewBox="0 0 860 320"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Vertical line between top-left and bottom-left circles */}
            <line x1="290" y1="115" x2="290" y2="245" stroke="#2a3040" strokeWidth="1.5" />

            {/* Horizontal top line connecting left and right top circles */}
            <line x1="325" y1="90" x2="535" y2="90" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" />

            {/* Horizontal bottom line connecting left and right bottom circles */}
            <line x1="325" y1="230" x2="535" y2="230" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />

            {/* Vertical right line connecting top-right and bottom-right circles */}
            <line x1="570" y1="115" x2="570" y2="205" stroke="#2a3040" strokeWidth="1.5" />

            {/* Junction dots */}
            <circle cx="290" cy="90" r="3.5" fill="#1e293b" stroke="#22d3ee" strokeWidth="1" opacity="0.8" />
            <circle cx="570" cy="90" r="3.5" fill="#1e293b" stroke="#22d3ee" strokeWidth="1" opacity="0.8" />
            <circle cx="290" cy="230" r="3.5" fill="#1e293b" stroke="#ef4444" strokeWidth="1" opacity="0.8" />
            <circle cx="570" cy="230" r="3.5" fill="#1e293b" stroke="#ef4444" strokeWidth="1" opacity="0.8" />
          </svg>

          {/* TOP-LEFT circle */}
          <CircleIcon x={290} y={90} size={64} borderColor="#22d3ee" glowColor="rgba(34,211,238,0.12)" imageUrl={items[0].image} />

          {/* TOP-RIGHT circle */}
          <CircleIcon x={570} y={90} size={64} borderColor="#7c6fcd" glowColor="rgba(124,111,205,0.12)" imageUrl={items[1].image} />

          {/* BOTTOM-LEFT circle */}
          <CircleIcon x={290} y={230} size={64} borderColor="#22d3ee" glowColor="rgba(34,211,238,0.12)" imageUrl={items[2].image} />

          {/* BOTTOM-RIGHT circle — with outer ring per design */}
          <CircleIcon x={570} y={230} size={64} borderColor="#f97316" glowColor="rgba(249,115,22,0.12)" outerRing imageUrl={items[3].image} />

          {/* ── TEXT LABELS (Dynamic) ── */}

          {/* TOP-LEFT label */}
          <TextLabel x={222} y={60} width={185} align="right"
            title={items[0].title}
            desc={items[0].description}
          />

          {/* TOP-RIGHT label */}
          <TextLabel x={606} y={60} width={190} align="left"
            title={items[1].title}
            desc={items[1].description}
          />

          {/* BOTTOM-LEFT label */}
          <TextLabel x={222} y={193} width={185} align="right"
            title={items[2].title}
            desc={items[2].description}
          />

          {/* BOTTOM-RIGHT label */}
          <TextLabel x={606} y={193} width={200} align="left"
            title={items[3].title}
            desc={items[3].description}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────── */

function CircleIcon({
  x, y, size, borderColor, glowColor, outerRing = false, imageUrl,
}: {
  x: number; y: number; size: number; borderColor: string; glowColor: string;
  outerRing?: boolean; imageUrl: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `calc(${(x / 860) * 100}% - ${size / 2}px)`,
        top: `calc(${(y / 320) * 100}% - ${size / 2}px)`,
        width: size,
        height: size,
      }}
    >
      {outerRing && (
        <div style={{
          position: "absolute",
          inset: -10,
          borderRadius: "50%",
          border: `1.5px solid ${borderColor}`,
          opacity: 0.3,
        }} />
      )}
      <div style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1.5px solid ${borderColor}`,
        background: glowColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 20px ${glowColor}`,
        position: "relative",
        zIndex: 1,
        backdropFilter: "blur(2px)",
        padding: "12px", // Added padding to keep icons within the border but much larger
      }}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {imageUrl ? (
                <Image src={imageUrl} alt="model-icon" fill className="object-contain" />
            ) : (
                <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
            )}
        </div>
      </div>
    </div>
  );
}

function TextLabel({
  x, y, width, align, title, desc,
}: {
  x: number; y: number; width: number; align: "left" | "right";
  title: string; desc: string;
}) {
  return (
    <div style={{
      position: "absolute",
      left: `calc(${(x / 860) * 100}% ${align === "right" ? `- ${width}px` : ""})`,
      top: `${(y / 320) * 100}%`,
      width,
      textAlign: align,
    }}>
      <p style={{
        color: "#ffffff",
        fontSize: "11.5px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        lineHeight: 1.45,
        margin: 0,
        marginBottom: "6px",
        whiteSpace: "pre-line",
        textTransform: "uppercase"
      }}>
        {title.includes("  ") ? title.replace("  ", "\n") : title}
      </p>
      <div 
        style={{
            color: "#7a8596",
            fontSize: "11px",
            lineHeight: 1.6,
            margin: 0,
            fontWeight: 400,
        }}
        dangerouslySetInnerHTML={{ __html: desc }}
      />
    </div>
  );
}