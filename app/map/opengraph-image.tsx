import { OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Where to eat in Seongsu — The Yolk List";

export default function Image() {
  return renderOgImage(null);
}
