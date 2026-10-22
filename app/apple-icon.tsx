import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// 홈 화면 아이콘: 코발트 바탕에 노른자 로고
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#2D46F5" }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: "#FFC21A" }} />
        </div>
      </div>
    ),
    size,
  );
}
