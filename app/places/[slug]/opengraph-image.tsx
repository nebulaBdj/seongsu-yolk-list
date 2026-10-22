import { OG_SIZE, renderOgImage } from "@/lib/og";
import { getCategory, getPlace, placeNo, places } from "@/lib/places";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "A Seongsu local favorite on The Yolk List";

export function generateStaticParams() {
  return places.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const place = getPlace((await params).slug);
  if (!place) return renderOgImage(null);
  return renderOgImage({
    no: placeNo(place),
    nameEn: place.nameEn,
    nameKo: place.nameKo,
    category: getCategory(place.category).en,
  });
}
