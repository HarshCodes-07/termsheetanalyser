import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — understand before you sign`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGS = ["Red flags", "Safety score", "Negotiation notes"];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          background:
            "linear-gradient(145deg, #fbf7f2 0%, #f7efe4 55%, #f2e6d4 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "#ea5b0c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
              marginRight: 16,
            }}
          >
            T
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#1a1715",
            }}
          >
            {SITE_NAME}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#1a1715",
            letterSpacing: "-0.02em",
            maxWidth: 900,
          }}
        >
          <span>Understand your termsheet </span>
          <span style={{ color: "#d44d00" }}>before you sign it.</span>
        </div>
        <p
          style={{
            marginTop: 28,
            fontSize: 26,
            lineHeight: 1.45,
            color: "#6b625a",
            maxWidth: 820,
          }}
        >
          {SITE_DESCRIPTION}
        </p>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "row",
          }}
        >
          {TAGS.map((label, i) => (
            <span
              key={label}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                background: "#fff3e8",
                border: "1px solid #f7c39a",
                color: "#d44d00",
                fontSize: 18,
                fontWeight: 600,
                marginRight: i < TAGS.length - 1 ? 12 : 0,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
