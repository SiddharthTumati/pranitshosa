import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";
export const alt = "HOSA Tracker";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0044ad",
          borderRadius: "22%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 800,
          fontSize: 260,
          letterSpacing: -8,
          fontFamily: "system-ui",
        }}
      >
        H
      </div>
    ),
    { ...size }
  );
}
