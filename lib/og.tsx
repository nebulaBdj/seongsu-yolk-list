import { ImageResponse } from "next/og";

// OG 이미지 1200×630 (SPEC §12-6). 빌드 때 생성된다
export const OG_SIZE = { width: 1200, height: 630 };

// 쓰는 글자만 담은 TTF를 구글 폰트에서 받는다 (satori는 woff2를 못 읽는다)
async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`폰트를 못 받음: ${family}`);
  return (await fetch(match[1])).arrayBuffer();
}

type OgPlace = { no: string; nameEn: string; nameKo: string; category: string };

// 코발트 배경 + 영수증 + 영문·한글 이름 + 로컬 찐 맛집 뱃지
export async function renderOgImage(place: OgPlace | null) {
  const headline = place ? "THE YOLK LIST" : "WHERE TO EAT IN SEONGSU";
  const nameEn = place?.nameEn ?? "Local favorites";
  const nameKo = place?.nameKo ?? "성수 맛집 가이드";
  const meta = place ? `${place.no} · ${place.category}` : "KOREAN BBQ · SOUP · NOODLES · BAR · BAKERY";
  const badge = "로컬 찐 맛집";
  const lead = place ? "Seongsu local favorite" : headline;
  const monoText = `${lead}${nameEn}${meta}THE YOLK LIST @seoul.yolk`;

  const [mono, ko] = await Promise.all([
    loadGoogleFont("Space+Mono", 700, monoText),
    loadGoogleFont("Nanum+Gothic+Coding", 700, `${nameKo}${badge}`),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 72px",
          background: "#2D46F5",
          color: "#FFFFFF",
          fontFamily: "Space Mono",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 20, height: 20, borderRadius: 10, background: "#FFC21A" }} />
            </div>
            THE YOLK LIST
          </div>
          <div style={{ fontSize: place ? 40 : 56, lineHeight: 1.1 }}>{lead}</div>
          <div style={{ fontSize: 24, color: "#DCE2FF" }}>@seoul.yolk</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 520, height: 22, borderRadius: 11, background: "#101C78" }} />
          <div
            style={{
              marginTop: -11,
              width: 480,
              padding: "36px 32px 40px",
              background: "#FFFFFF",
              color: "#1A1A1A",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ fontSize: 20, color: "#666666" }}>{meta}</div>
            <div style={{ fontSize: nameEn.length > 22 ? 40 : 52, lineHeight: 1.1 }}>{nameEn}</div>
            <div style={{ fontFamily: "Nanum Gothic Coding", fontSize: nameKo.length > 8 ? 32 : 40, color: "#666666" }}>{nameKo}</div>
            <div style={{ display: "flex", borderTop: "3px dashed #1A1A1A", marginTop: 8 }} />
            <div style={{ display: "flex" }}>
              <div
                style={{
                  fontFamily: "Nanum Gothic Coding",
                  fontSize: 30,
                  background: "#FFC21A",
                  borderRadius: 999,
                  padding: "4px 22px",
                }}
              >
                {badge}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Space Mono", data: mono, weight: 700 },
        { name: "Nanum Gothic Coding", data: ko, weight: 700 },
      ],
    },
  );
}
