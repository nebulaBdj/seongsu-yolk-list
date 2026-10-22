import { Nanum_Gothic_Coding, Space_Mono } from "next/font/google";

// 제목·영문 이름·번호·칩·버튼 (SPEC §8-2). 모든 화면에서 쓰므로 preload 한다
export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

// 영수증 본문과 한글(고정폭이라 점선 리더가 맞는다). 한글 폰트라 preload를 끈다
export const nanumGothicCoding = Nanum_Gothic_Coding({
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  variable: "--font-receipt",
});
