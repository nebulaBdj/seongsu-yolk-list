# Seoul Yolk — The Yolk List (v1) 설계서

> 이 폴더(`seongsu-yolk-list/`)에서 Claude Code를 실행하고 "CLAUDE.md와 SPEC.md를 읽고 시작해줘"로 시작한다. Claude Code는 §14 질문을 한 번에 묻고, 답을 받으면 §13 0~8단계(저장소 만들기부터 배포까지)를 멈추지 않고 끝까지 진행한다.
> 사이트 안의 문구는 영어(외국인 대상), 이 문서와 코드 주석은 한국어.
> **화면 디자인의 기준은 `design/` 폴더(첫 시안)**, 가게 내용의 기준은 `data/places.json`이다. 시안 속 가게(Zesty Saloon, 간판없는 집 등)와 웨이팅·가격 문구는 예시라 쓰지 않는다.

## 0. 프로젝트 맥락

- **누가:** 숭실대 창업동아리 시너지의 기업 연계 프로그램 StartupXperience 26-2기에서 **써니사이드업 A팀**이 만든다. 팀은 **매출**로 평가받는다.
- **써니사이드업:** AI 신문 포토부스를 운영하는 회사다. 찍은 사진이 A3 신문 지면('신문네컷')으로 출력된다. 미국에서는 K PhotoLaVie라는 이름으로 매장을 운영한다. 사이트에서는 'AI newspaper photo booth'라고만 부른다.
- **팀이 하고 있는 것**
  - 10/23(금)~24(토) 성수 팝업(더가배성수, 12~19시)에서 포토부스를 운영한다.
  - 홍보용 인스타 @seoul.yolk('서울 노른자')에 '성수에서 뭐하지' 콘텐츠를 올린다.
  - 외국인 대상 '한국 이름 뽑기' 사이트(`korean-name-draw`)로 부스 할인 쿠폰을 주고 팝업 방문을 만든다.
  - 다음 단계로 **외국인 손님이 많고 웨이팅이 긴 식당에 포토부스를 두는 숍인숍 제휴**를 구상 중이다. 기다리는 손님이 사진을 찍으며 시간을 보내게 하는 방향이고, 아직 제휴 식당은 없다.
- **이 사이트의 역할**
  1. @seoul.yolk의 '성수에서 뭐하지' 콘텐츠: 외국인에게 성수 로컬 맛집을 알려준다.
  2. 팝업 기간에는 부스 위치(OUR POP-UP)와 이름 뽑기로 이어 부스 방문(매출)을 돕는다.
  3. 가게별 조회·지도 클릭 수를 쌓아 식당 제휴를 제안할 때 자료로 쓴다. 제휴가 생기면 PARTNER 표시를 더한다(v2).
- **우선순위:** 외국인이 쓰기 쉬움(인스타 앱 안 브라우저, 영어, 구글 지도) > 검색 노출 > 꾸밈.

## 1. 목표

- 성수에 온 외국인이 **'로컬 찐 맛집' 14곳**을 카테고리별로 고르고, **버튼 하나로 구글 지도**에 가게 한다.
- 인스타 @seoul.yolk 프로필, 포토부스 신문 사진 QR, 이름 뽑기 사이트에서 들어오는 목적지가 된다.
- 가게별 조회·지도 클릭 수를 남긴다. 나중에 식당 제휴(숍인숍)를 제안할 때 보여줄 자료가 된다.
- 팝업이 끝난 뒤에도 `where to eat in Seongsu` 같은 검색으로 들어오는 사이트로 남긴다(SEO, §12).

### 성공 지표

| 지표 | 계산 |
| --- | --- |
| 지도 클릭률 | `maps_click`을 한 사용자 ÷ 전체 사용자 (GA4) |
| 가게별 관심 | 가게 페이지(`/places/…`) 조회 수, 가게별 `maps_click` 수 |
| 유입 경로 | `utm_source`별 사용자 (인스타·신문 QR·이름 뽑기·현장 표지판) |
| 검색 유입 (팝업 후) | Search Console 노출·클릭, 가게 페이지별 유입 |

## 2. v1 범위

**포함**
- 홈(목록) → 상세(주문서 영수증) → 구글 지도, 지도 화면(번호 핀 14개)
- 가게 14곳·카테고리 5개를 `data/places.json` 하나로 관리 (실시간 연동 없음)
- 가게별 정적 상세 페이지 14개, sitemap·robots·구조화 데이터·OG 이미지 (§12)
- 팝업 기간 표시(지도의 OUR POP-UP, 신문 QR 환영 배너, 하단 팝업 안내)와 팝업 후 전환
- GA4 이벤트, UTM 유입 경로, Search Console 등록

**제외 (v2 이후)**
- 제휴 식당 표시(PARTNER 카드, 저장소 밖 `archive/Partner.dc.html`) — 제휴가 생기면 데이터에 `partner` 필드를 더한다
- 평점·리뷰 수·카카오맵 표시, 영업시간·웨이팅 같은 실시간 정보
- 가게 사진 (팀이 직접 찍은 사진이 생기면 추가)
- 검색, 카테고리별 페이지, 다른 언어 페이지, 서버·DB

## 3. 화면과 흐름

컨셉은 첫 시안 그대로다. **성수의 '노른자'만 골라 담은 영수증**이고, 가게 한 곳이 영수증 한 장이다.

모바일 세로 화면 기준(375~430px). 데스크톱은 가운데 정렬된 모바일 폭으로 보여준다. **인스타그램 앱 안 브라우저가 주 진입 경로**이므로 그 환경을 기준으로 만든다.

### 3-0. 페이지 구성

| 주소 | 내용 | 렌더링 | 디자인 파일 |
| --- | --- | --- | --- |
| `/` | 홈: 카테고리 탭 + 가게 카드 14장 | 정적 HTML, 탭·SHOW MORE·환영 배너만 클라이언트 | `design/Main.dc.html` |
| `/places/[slug]` | 상세: 주문서 영수증 | 정적 HTML 14개, 발음 ▶만 클라이언트 | `design/Detail.dc.html` |
| `/map` | 지도: 그림 지도 + 번호 핀 14개 | 정적 HTML(핀 포함), 핀 선택만 클라이언트 | `design/Map.dc.html` |
| `/sitemap.xml`, `/robots.txt` | 검색엔진용 | 빌드 때 생성 | — |

흐름:
- 홈 카드의 `GOOGLE MAPS ↗` → 구글 지도
- 홈 카드의 나머지 → 상세 → `GOOGLE MAPS ↗` → 구글 지도
- `MAP` 토글 → 지도 → 핀 → 아래 카드 → `OPEN →`(상세) 또는 `MAPS ↗`(구글 지도)

> `design/*.dc.html`은 디자인 도구용 HTML이라 브라우저에서 그대로 열리지 않는다. 마크업·인라인 스타일·SVG를 참고해 React 컴포넌트로 옮긴다. 시안 안의 링크(`Detail.dc.html` 등)는 §3-0의 실제 주소로 바꾼다. `[Y/N]`, `[DATE]` 같은 대괄호는 데이터 자리다.

### 3-1. 홈 `/`

시안(Main)과 같고, 아래 표시한 것만 바꾼다.
- 머리줄: 노른자 로고 + `THE YOLK LIST`, 오른쪽 `@seoul.yolk`(인스타 링크)
- 노른자 환영 배너 `Got your newspaper photo? Here's where to eat next in Seongsu.` — **신문 사진 QR로 들어온 경우만** 보인다(첫 진입 `utm_source=newspaper`를 sessionStorage에 기억). 정적 HTML에는 넣지 않는다.
- 제목(h1) `Where to eat in Seongsu`
- 부제 **(바꿈)** `Only the yolk: local favorites Korean diners rate highly, and what to order at each.` — 시안의 'how long the line is…'는 웨이팅 데이터가 없어 뺀다.
- 말 풀이 상자: 시안의 `노른자 no-reun-ja = egg yolk, Korean slang for “the best part”.` 아래에 **한 줄 추가** `로컬 찐 맛집 lo-kal jjin mat-jip = a real-deal local favorite. Every pick here is one.`
- 카테고리 탭 **(바꿈)**: `ALL` `KOREAN BBQ` `SOUP` `NOODLES` `BAR` `BAKERY` (`categories` 순서). 누르면 그 카테고리 카드만 보인다. 로컬 상태라 주소는 바뀌지 않는다. 탭 높이 44px 이상.
- `LIST` / `MAP` 토글: `/` ↔ `/map` 링크
- 가게 카드 14장(§3-2). `ALL`에서는 처음 6장만 보이고 `SHOW MORE PICKS`로 나머지를 연다. 카테고리를 고르면 그 카테고리 전부를 보인다. **14장 모두 HTML에 들어 있어야 한다**(숨김은 CSS).
- 이름 뽑기 배너 `What's your Korean name?` / `Print one free in 10 seconds` → `SITE.nameDrawUrl` (외부 링크라 UTM을 붙인다: `?utm_source=yolklist&utm_medium=banner&utm_campaign=crosslink`)
- 하단 줄 **(새로)**: `LAST CHECKED {DATA.lastChecked}` · `Hours can change, so check Google Maps before you go.`
  - `EVENT.active`이면 한 줄 더: `Visit our AI newspaper photo booth · {EVENT.place} · {EVENT.dates} · {EVENT.hours}` (`EVENT.mapUrl` 링크)

### 3-2. 가게 카드 (홈)

시안 카드의 모양(번호·칩·이름·점선 리더·톱니 끝)은 그대로 쓰고 내용만 바꾼다.
1. 윗줄: `No.01` · 카테고리 칩 `KOREAN BBQ` · 노른자 뱃지 `로컬 찐 맛집` (시안의 `EXPECT A WAIT` 자리)
2. 영문 이름 `nameEn`(17px 굵게) / 한글 이름 `nameKo`(회색)
3. `ORDER ····· {order[0].en}` (점선 리더)
4. 한 줄 평 `oneLiner.en` — 시안의 두 번째 리더 줄(PRICE·SPICE·TIP·NOTE) 자리. 리더 없이 문장으로, 최대 2줄
5. `GOOGLE MAPS ↗` 버튼 (높이 44px 이상, 새 탭) — `maps_click` (`from: card`)

- 카드의 나머지 부분을 누르면 `/places/[slug]`로 간다. **링크 안에 링크를 넣지 않는다.** 카드 전체를 덮는 상세 링크(가상 요소) 위로 지도 버튼을 `position: relative`·`z-index`로 올린다.
- No.는 `places` 배열 순서(1부터, 두 자리 `No.01`).

### 3-3. 상세 `/places/[slug]`

시안(Detail)의 주문서 영수증을 그대로 쓴다. 위에서부터:
- 머리줄: `← ALL PICKS`(`/`) · 노른자 점 + `No.01`
- 프린터 슬롯에서 나오는 영수증
  1. `THE YOLK LIST · ORDER SLIP · 주문서`
  2. h1 `nameEn`(26px), 아래 `nameKo`(15px)
  3. 카테고리 `KOREAN BBQ` + 뱃지 `로컬 찐 맛집 · LOCALS' PICK` **(바꿈)** — 시안의 가격대·`EXPECT A WAIT` 자리
  4. `WHAT TO ORDER · 추천 메뉴` — `order`마다 `1 × {en} ····· {ko}` **(바꿈)**. 오른쪽 한글은 직원에게 보여주는 용도다(시안의 `TOP PICK` 자리).
  5. `WHY IT'S A PICK · 한 줄 평` — `oneLiner.en` **(새로)**. 시안의 `HOW TO GET IN · 줄 서는 법` 블록(설명·영업시간·위치)은 뺀다.
  6. `FOREIGNER CHECK · 외국인 체크` — `English menu` `Foreign cards` `Solo OK` `Waitlist app` 4칸, 값은 `YES`/`NO`. `checks` 값이 `null`인 칸은 숨기고, 4칸 모두 `null`이면 블록 전체를 숨긴다(지금은 모두 null이라 숨김 상태. 팀이 확인하면 데이터만 채운다).
  7. `SAY IT IN KOREAN · 한국어 한마디` — 카테고리별 두 문장(`PHRASES`, §7) + ▶ 발음. Web Speech API(`speechSynthesis`, `lang="ko-KR"`)로 읽고, 한국어 음성이 없는 기기에서는 ▶만 숨긴다.
  8. `SHOW YOUR TAXI DRIVER · 기사님께 보여주세요` — `nameKo`(18px 굵게) / `서울 성동구 {address} {floor}`(15px 굵게)
  9. `GOOGLE MAPS ↗` 버튼 1개, 전체 폭 **(바꿈)** — 시안의 네이버·카카오·구글 3개 버튼 자리. `maps_click` (`from: detail`)
  10. 장식 바코드, `LAST CHECKED {DATA.lastChecked}`, `감사합니다! Enjoy your meal!`
- 영수증 아래: `More {category.title} picks` — 같은 카테고리의 다른 가게 링크(1~2개), 그 아래 `← Back to all picks`
- 없는 slug는 404.

### 3-4. 지도 `/map`

시안(Map)의 그림체(옅은 바탕, 굵은 회색 길, 초록 2호선, 역 표시, 노른자 번호 핀, 흰 카드)를 따르되 **위치는 실제 위경도로** 그린다(§6).
- 머리줄 + `LIST`/`MAP` 토글(MAP 선택 상태). 그 아래 h1 `Seongsu food map`을 작게.
- 지도: 2호선(뚝섬역–성수역), 서울숲역, 핀 14개(No. 번호). `EVENT.active`일 때만 팝업 위치에 검은 사각 표시 `OUR POP-UP`.
- 핀을 누르면 지도 아래 카드가 바뀐다: `No.` · 카테고리 · 뱃지 / `nameEn` / `nameKo` / `OPEN →`(상세) · `MAPS ↗`(구글 지도, `from: map`). 처음에는 No.01이 선택돼 있다.
- 핀은 HTML에서 `/places/[slug]` 링크로 둔다(검색엔진이 따라갈 수 있게). 누르면 기본 이동을 막고 핀 선택만 한다.
- 지도 아래 작은 글씨: `Map not to scale. Use Google Maps for directions.`
- 확대·이동은 없다(그림 지도).

### 3-5. 팝업 종료 후 (`EVENT.endsAt` 이후)

- 지도의 OUR POP-UP, 신문 QR 환영 배너, 하단 팝업 안내 줄을 숨긴다. 하단에는 `Follow @seoul.yolk for our next pop-up`.
- 클라이언트에서 `endsAt`으로 한 번 더 막고, 팝업이 끝나면 `EVENT.active = false`로 바꿔 재배포한다(검색엔진이 보는 HTML도 정리).

## 4. 가게 데이터 `data/places.json`

```json
{
  "categories": [{ "id": "soup", "en": "SOUP", "title": "Soup", "ko": "국물" }],
  "places": [{
    "slug": "kamoto",
    "category": "soup",
    "nameEn": "Kamoto",
    "nameKo": "카모토",
    "order": [{ "en": "Duck gomtang, clear duck soup with rice", "ko": "오리곰탕" }],
    "oneLiner": { "en": "Clear duck soup over rice, no gamey taste, generous portions", "ko": "잡내 없이 맑고 깔끔한 국물의 오리곰탕, 양도 넉넉" },
    "address": "상원6길 6",
    "floor": "1층",
    "lat": 37.54850147,
    "lng": 127.04882185,
    "checks": { "englishMenu": null, "foreignCards": null, "soloOk": null, "waitlistApp": null }
  }],
  "landmarks": [{ "id": "seongsu-stn", "en": "SEONGSU STN", "kind": "station", "line": "2", "lat": 37.54458882, "lng": 127.056067 }]
}
```

- 14곳, 카테고리 5개(고기 3 · 국물 3 · 면 2 · 술집 3 · 빵 3). **배열 순서가 No.**이고 카테고리 순서와 같다.
- `slug`가 주소가 된다(`/places/kamoto`). 배포와 Search Console 등록 뒤에는 바꾸지 않는다(바꾸면 리다이렉트가 필요하다).
- `categories[].en`은 칩·탭용 대문자, `title`은 문장·title 태그용이다.
- `order[0]`이 카드의 ORDER 줄이고, 상세에는 전부 나온다.
- `oneLiner.en`이 화면용, `oneLiner.ko`는 팀 확인용이라 화면에 쓰지 않는다. 공개 후기에서 공통으로 나온 내용을 요약해 직접 쓴 문장이다. 후기 원문은 옮기지 않는다.
- `address`는 '서울 성동구' 뒤의 도로명 주소, `floor`는 층·호수다. 택시용 전체 주소는 코드에서 `서울 성동구 {address} {floor}`로 만든다.
- `checks`: `true`/`false`/`null`(모름 → 숨김). 팀이 전화·방문으로 확인해 채운다.
- `lat`·`lng`: 카카오맵 장소 좌표(2026-10-21 수집). 지도 핀에만 쓴다.
- `landmarks`: 지도에 그릴 역 3곳(뚝섬역·성수역·서울숲역)과 팝업 위치.
- 선택 필드 `mapsQuery`: 구글 지도에서 기본 검색어로 가게가 바로 안 잡힐 때만 그 가게에 더한다(§5).
- **넣지 않는 것:** 카카오 평점·리뷰 수·선정 근거. 저장소 밖 `archive/research.csv`(내부용)에만 둔다.
- 선정 기준(내부용, 화면에 쓰지 않음): 카카오맵 평점 4.5 이상·리뷰 20개 이상인 곳 중 카테고리별 리뷰 많은 순, 다른 사이트 공개 후기와 교차 확인(점수가 크게 엇갈린 곳은 제외).

## 5. 구글 지도 연결

- 주소는 `lib/maps.ts`의 함수 하나로 만든다.
  ```ts
  const query = place.mapsQuery ?? `${place.nameKo} 서울 성동구 ${place.address}`;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  ```
- 새 탭으로 연다(`target="_blank" rel="noopener"`). 폰에서는 구글 지도 앱이 있으면 앱으로 열린다.
- 팝업 위치 링크는 `EVENT.mapUrl`(주소 검색).
- 한국에서는 구글 지도의 길찾기 기능이 제한될 수 있다. 대중교통·도보 길찾기가 실제로 되는지 폰에서 확인한다(§11).

## 6. 지도 그리기 `/map`

- 그림 지도는 SVG로 직접 그린다. **위경도 → 지도 좌표 변환 함수 하나(`project`)**로 역·노선·팝업·핀을 모두 같은 좌표계에 놓는다.
- 범위: 경도 127.0425~127.0600, 위도 37.5365~37.5510 (14곳·역 3곳·팝업이 다 들어가는 약 1.5km × 1.6km)
- 변환 (좁은 범위라 평면으로 계산, 단위 m):
  - `x = (lng − 127.0425) × 88,260`
  - `y = (37.5510 − lat) × 110,950`
  - SVG `viewBox="0 0 1545 1609"`를 화면 폭에 맞춘다. 폭 390px이면 약 0.25px/m, 높이 약 406px.
- 그릴 것: 옅은 바탕, 2호선(뚝섬역–성수역을 잇고 양쪽 끝까지 연장), 역 3곳과 이름, 핀 14개, 팝업 표시. 서울숲(왼쪽 가장자리, 서울숲역 서쪽)과 한강(아래 가장자리)은 대략적인 면으로만 그린다. 정확한 경계는 필요 없다.
- **핀 겹침:** 뚝섬역 남쪽~서울숲 카페거리(No.01·03·04·07·08·10·12)는 핀끼리 7~33px 간격이라 겹친다. 핀(지름 30px) 사이가 34px보다 가까우면 서로 밀어내고(최대 40px 이동), 실제 위치에 작은 점과 핀까지 가는 선을 그린다. 계산은 빌드 때 한 번 하는 순수 함수(`spreadPins`)로 만든다.
- 핀 모양은 시안 그대로다: 노른자 원 + No. 숫자, 선택된 핀은 36px + 코발트 테두리, 터치 영역 44px.
- 핀 카드는 지도 아래에 둔다(지도를 가리지 않게).

## 7. 설정 `config/site.ts`

```ts
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://seongsu-yolk-list.vercel.app", // canonical·sitemap 기준 주소
  name: "The Yolk List",
  brand: "Seoul Yolk",
  instagram: "https://instagram.com/seoul.yolk",
  nameDrawUrl: "https://korean-name-draw.vercel.app", // TODO: 이름 뽑기 사이트 최종 주소
};
export const EVENT = {
  active: true, // 팝업이 끝나면 false로 바꿔 재배포 (§3-5)
  dates: "Oct 23–24",
  hours: "12:00–19:00",
  place: "The Gabae Seongsu (더가배성수)",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=%EC%84%9C%EC%9A%B8%20%EC%84%B1%EB%8F%99%EA%B5%AC%20%EC%97%B0%EB%AC%B4%EC%9E%A513%EA%B8%B8%2011", // 서울 성동구 연무장13길 11
  endsAt: "2026-10-24T19:00:00+09:00",
};
export const DATA = {
  lastChecked: "2026-10-21", // 팀이 가게 정보를 다시 확인하면 바꾼다
};
export const PHRASES = {
  default: [
    { ko: "두 명이요", roman: "du myeong-i-yo", en: "Table for two" },
    { ko: "이거 주세요", roman: "i-geo ju-se-yo", en: "This one, please" },
  ],
  bakery: [
    { ko: "이거 주세요", roman: "i-geo ju-se-yo", en: "This one, please" },
    { ko: "포장해 주세요", roman: "po-jang-hae ju-se-yo", en: "To go, please" },
  ],
};
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;                       // 없으면 분석 코드는 조용히 꺼진다
export const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION; // Search Console HTML 태그 토큰
```

## 8. 디자인

### 8-1. 색

| 용도 | 값 |
| --- | --- |
| 머리줄·강조 (코발트) | `#2D46F5` |
| 프린터 슬롯 | `#101C78` |
| 영수증 종이 | `#FFFFFF` |
| 영수증 글자 / 보조 글자 | `#1A1A1A` / `#666666` |
| 목록·상세 바탕 | `#E9ECF6` |
| 코발트 위 보조 글자 | `#DCE2FF` |
| 노른자 (로고·뱃지·핀·환영 배너) | `#FFC21A` |
| 검정 (팝업 표시) | `#0E0E12` |
| 지도 바탕 / 길 / 서울숲 / 한강 | `#F4F5FA` / `#DADFEB` / `#D7ECD5` / `#CFDDFB` |
| 2호선 / 서울숲역(수인분당선) 표시 | `#00A84D` / `#E0A100` |

### 8-2. 폰트
- `Space Mono` 400·700 — 제목, 영문 이름, 번호, 칩, 버튼
- `Nanum Gothic Coding` 400·700 — 영수증 본문과 한글 (고정폭이라 점선 리더 줄이 맞는다)
- 모두 `next/font`로 자가 호스팅. 한글 폰트는 preload를 끈다.

### 8-3. 영수증 부품
- 프린터 슬롯(상세): 높이 16px 둥근 막대 + 안쪽 그림자, 종이가 슬롯 아래로 8px 들어가 보이게 겹친다.
- 종이 그림자: 카드 `drop-shadow(0 6px 10px rgba(20, 30, 90, 0.16))`, 상세 `drop-shadow(0 10px 14px rgba(20, 30, 90, 0.18))`
- 구분선 1.5px 점선(dashed), 항목과 값 사이 점 리더 1.5px dotted, 아래 톱니 끝(삼각형 반복 SVG, 높이 9px), 장식용 바코드 SVG
- 뱃지 `로컬 찐 맛집`: 노른자 바탕, 검정 글자, 둥근 알약 모양, 10.5px 굵게 — 시안의 `EXPECT A WAIT` 칩과 같은 모양

### 8-4. 공통
- 누르는 곳은 44px 이상, 글자 대비 4.5:1 이상
- 간격·크기는 `design/` 파일을 따른다.

## 9. 분석 (GA4)

### 유입 경로 (주소에 UTM — 외부 링크에만)

| 경로 | 주소 뒤에 붙일 것 |
| --- | --- |
| 인스타 프로필 링크 | `?utm_source=instagram&utm_medium=bio&utm_campaign=yolklist` |
| 포토부스 신문 사진 QR | `?utm_source=newspaper&utm_medium=qr&utm_campaign=yolklist` |
| 이름 뽑기 사이트 | `?utm_source=namedraw&utm_medium=banner&utm_campaign=yolklist` |
| 팝업 현장 표지판 QR | `?utm_source=popup&utm_medium=qr&utm_campaign=yolklist` |

### 이벤트

| 이벤트 | 언제 | 파라미터 |
| --- | --- | --- |
| `maps_click` | GOOGLE MAPS·MAPS 버튼 | `place_slug`, `from` (`card` / `detail` / `map`) |
| `category_select` | 카테고리 탭 | `category` |
| `show_more` | SHOW MORE PICKS | — |
| `pin_select` | 지도 핀 | `place_slug` |
| `pronounce_click` | 한국어 한마디 ▶ | `place_slug`, `phrase` |
| `namedraw_click` | 이름 뽑기 배너 | — |
| `instagram_click` | @seoul.yolk 링크 | — |
| `popup_map_click` | 팝업 위치 링크 | — |

- gtag는 Google이 주는 스니펫을 **수정 없이 root layout의 `<head>`에** 넣는다. 페이지 소스의 head에 그대로 있어야 Search Console을 'Google 애널리틱스' 방식으로 확인할 수 있다(`next/script`의 afterInteractive는 head에 들어가지 않는다). `NEXT_PUBLIC_GA_ID`가 없으면 넣지 않는다.
- GA4 관리에서 `place_slug`, `from`, `category`, `phrase`를 **맞춤 측정기준(이벤트 범위)**으로 등록해야 보고서에 보인다.
- 가게별 조회 수는 페이지 경로(`/places/…`)별 조회로 본다.
- GA4는 이름 뽑기 사이트와 **같은 속성에 웹 데이터 스트림을 하나 더** 만들어 측정 ID를 받는다. 두 사이트를 한 보고서에서 비교할 수 있다.

## 10. 기술 스택과 배포

- **Next.js (App Router) + TypeScript**, 정적 생성(`generateStaticParams`로 가게 페이지 14개). 검색엔진이 보는 HTML에 본문이 다 들어가게 하려고 SPA 대신 정적 생성을 쓴다.
- 클라이언트 컴포넌트는 카테고리 탭·SHOW MORE·환영 배너·지도 핀 선택·발음만. 상태관리 라이브러리 없음.
- **Vercel** 배포: Claude Code가 Vercel CLI로 프로젝트 `seongsu-yolk-list`를 만들고 GitHub 저장소와 연결해 배포한다(§13 2단계).
- 환경변수: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`(Search Console을 HTML 태그로 확인할 때만)
- 서버·DB·지도 API 키 없음. 이미지 파일 없이 CSS·SVG로 그린다.

## 11. QA 체크리스트

- [ ] **인스타그램 앱 내 브라우저**(iOS·안드로이드), iPhone Safari, Android Chrome에서 홈·상세·지도
- [ ] **구글 지도 버튼 14개**를 폰에서 하나씩 눌러 그 가게가 바로 잡히는지(안 잡히면 `mapsQuery`), 앱으로 열리는지, 대중교통·도보 길찾기가 되는지
- [ ] 카드의 지도 버튼을 눌렀을 때 상세로 같이 넘어가지 않는지(링크 겹침)
- [ ] 카테고리 탭·SHOW MORE가 동작하고, 페이지 소스에 14곳이 다 들어 있는지
- [ ] 지도 핀 14개가 겹치지 않고 다 눌리는지, 역 기준으로 위치가 맞는지
- [ ] 한글 고정폭 폰트가 제대로 불러와지는지(대체 폰트면 점선 리더 줄이 깨짐)
- [ ] 한국어 음성이 없는 기기에서 ▶가 숨겨지는지
- [ ] 외국인 체크가 모두 `null`이면 블록이 숨겨지는지
- [ ] 신문 QR 주소(UTM)로 들어왔을 때만 환영 배너가 뜨는지
- [ ] `endsAt` 이후 팝업 표시가 사라지는지 (시계를 바꿔서 확인)
- [ ] 화면 어디에도 카카오·평점·리뷰 수가 없는지
- [ ] GA4 실시간 화면에 이벤트와 UTM 유입 경로가 찍히는지
- [ ] **SEO:** 페이지 소스에 본문·title·description·canonical이 있는지, `/sitemap.xml`에 16개 주소가 있는지, 크롤링되는 링크에 쿼리 파라미터가 없는지
- [ ] **SEO:** Lighthouse(모바일) SEO 100·성능 90 이상, 카카오톡·인스타 DM에 링크를 보냈을 때 OG 미리보기가 나오는지
- [ ] QR 이미지를 인쇄해서 1~2m 거리에서 실제로 찍히는지

## 12. SEO

### 12-1. 검색어 목표
- 주: `where to eat in Seongsu`, `Seongsu restaurants`, `Seongsu food guide`
- 보조: `Korean BBQ Seongsu`, `Seongsu bakery`, `Seoul Forest restaurants`, 가게 이름 검색(`Menya Pomo Seoul Forest` 등)

### 12-2. 메타데이터 (Next.js `metadata` / `generateMetadata`)

| 페이지 | title | description |
| --- | --- | --- |
| `/` | Where to Eat in Seongsu: 14 Local Favorites \| The Yolk List | 14 Seongsu restaurants, bars and bakeries Korean diners rate highly, with what to order at each and one-tap Google Maps directions. |
| `/places/[slug]` | {nameEn} ({nameKo}) — {category.title} in Seongsu \| The Yolk List | {oneLiner.en}. What to order, how to say it in Korean and the address to show your taxi driver. |
| `/map` | Seongsu Food Map: 14 Local Picks \| The Yolk List | All 14 local picks on one map of Seongsu, from Seoul Forest to Seongsu Station. |

- 모든 페이지: canonical(쿼리 없는 주소), `<html lang="en">`, Open Graph·Twitter(`summary_large_image`), theme-color `#2D46F5`, 파비콘·apple-touch-icon(노른자 로고)
- 페이지마다 h1은 하나. 가게 한글 이름은 이미지가 아닌 텍스트로.

### 12-3. 주소 규칙
- 크롤링되는 `<a href>`에는 쿼리 파라미터를 넣지 않는다. UTM은 외부 링크(QR·인스타·이름 뽑기 배너)에만.
- 카테고리 탭은 주소를 바꾸지 않는다.
- 끝 슬래시 규칙을 하나로 통일하고, 없는 slug는 404를 돌려준다.

### 12-4. 구조화 데이터 (JSON-LD)
- `/`: `WebSite`(name `The Yolk List`, url) + `ItemList`(14개, 각 항목 url = 가게 페이지, position = No.)
- `/places/[slug]`: `BreadcrumbList` (Home › {nameEn})
- 평점·리뷰 구조화 데이터(`AggregateRating`, `Review`)는 넣지 않는다(화면에 없는 정보).

### 12-5. sitemap·robots
- `app/sitemap.ts`: `/`, `/map`, `/places/[slug]` 14개 = 16개 (`lastModified` = 빌드 시각)
- `app/robots.ts`: 전체 허용 + sitemap 주소

### 12-6. OG 이미지
- `opengraph-image.tsx`(`next/og`)로 빌드 때 생성: 홈 1장 + 가게별 14장 (코발트 배경 + 영수증 + 영문·한글 이름 + `로컬 찐 맛집` 뱃지, 1200×630). 한글은 폰트 파일(TTF)을 넣어서 그린다.

### 12-7. 성능 (Core Web Vitals)
- 첫 화면은 정적 HTML. 카드·영수증 높이를 미리 잡아 레이아웃이 밀리지 않게 한다.
- 목표(모바일): LCP 2.5초 이하, CLS 0.1 이하.

### 12-8. Search Console·GA4 등록 (동준 — 구글 계정 로그인이 필요해 직접)
1. Claude Code가 배포 주소를 보고하면, 그 주소로 GA4 웹 스트림을 만들어(이름 뽑기와 같은 속성이면 스트림만 추가) 측정 ID를 Claude Code에 준다. Claude Code가 환경변수에 넣고 재배포한다.
2. 그다음 Search Console에 'URL 접두어' 속성(배포 주소)을 추가하고, 확인 방법은 'Google 애널리틱스'를 고른다(GA 편집 권한, Search Console과 같은 구글 계정 필요). 안 되면 'HTML 태그'의 토큰을 Claude Code에 주고 `NEXT_PUBLIC_GSC_VERIFICATION`에 넣어 재배포한 뒤 확인한다. 커스텀 도메인이면 '도메인' 속성 + DNS TXT.
3. Sitemaps에 `sitemap.xml` 제출, URL 검사로 `/` 색인 요청
4. GA4 관리 → 제품 링크 → Search Console 연결

## 13. Claude Code 진행 순서

§14 질문의 답을 받은 뒤 0~8단계를 멈추지 않고 이어서 진행한다. 단계마다 `npm run build`가 통과하면 커밋·push하고 다음 단계로 넘어간다.

0. **저장소:** `git init`, `.gitignore`(`node_modules`, `.next`, `.env*`, `.vercel`), 첫 커밋 → `gh repo create seongsu-yolk-list --private --source=. --remote=origin --push` (§14의 GitHub 계정·조직 답을 따른다)
1. **뼈대:** Next.js 생성, `config/site.ts`·`data/places.json` 연결, 영수증 부품, 홈(Main) 정적 화면 — 카드 14장과 구글 지도 버튼까지 + 기본 metadata
2. **첫 배포:** `vercel link --yes`로 Vercel 프로젝트 `seongsu-yolk-list`를 만들고(§14 7번 계정·팀), `vercel git connect`로 GitHub 저장소를 연결한다. 이후 main에 push하면 자동으로 production 배포된다(연결이 안 되면 단계마다 `vercel --prod --yes`). production 주소를 확인해 `NEXT_PUBLIC_SITE_URL`(§14 1번 답이 있으면 그 주소)을 production 환경변수로 넣고(`vercel env add`) 다시 배포한다. GA4 측정 ID는 마지막 보고 때 받는다.
3. **상세:** `/places/[slug]` 14개(Detail), 한국어 한마디 발음, 같은 카테고리 링크, 404
4. **홈 마무리:** 카테고리 탭, SHOW MORE PICKS, 신문 QR 환영 배너, 하단 줄, 이름 뽑기 배너, 팝업 종료 전환
5. **지도:** `/map` — 좌표 변환과 핀 밀어내기(§6), 그림 지도, 핀 선택 카드
6. **SEO:** 페이지별 metadata·canonical, sitemap·robots, 구조화 데이터, OG 이미지, Search Console 확인 태그(`NEXT_PUBLIC_GSC_VERIFICATION`이 있을 때만)
7. **분석:** gtag 스니펫을 `<head>`에(§9), 이벤트 8종, 첫 진입 UTM 기억
8. **마무리:** 최종 배포 후 배포 주소에서 확인할 수 있는 것(페이지 소스의 본문과 head의 gtag, `sitemap.xml` 16개, `robots.txt`, OG 이미지, Lighthouse), UTM을 붙인 주소와 QR 이미지 생성(최종 주소로, 신문 사진·현장 표지판·인스타 프로필용)

다 끝나면 한 번에 보고한다: 배포 주소, 한 일, TODO로 남긴 것, 동준이 할 일(GA4 스트림, Search Console 등록, 폰 QA, 인스타 링크). 보고 끝에 GA4 측정 ID를 요청하고, 받으면 `NEXT_PUBLIC_GA_ID`를 넣어 재배포한 뒤 head의 gtag를 확인한다.

## 14. 시작 전에 한 번에 물을 것

Claude Code는 시작하자마자 GitHub·Vercel 로그인(`gh auth status`, `vercel whoami`)을 확인한 뒤, 아래 일곱 가지를 한 메시지로 묻는다. 로그인이 안 돼 있으면 같은 메시지에서 로그인을 부탁한다(`gh`·`vercel`이 없으면 설치부터). 답이 없는 항목은 기본값으로 진행한다.

| # | 질문 | 기본값 |
| --- | --- | --- |
| 1 | 사이트 주소는? (도메인을 살 거면 Search Console 등록 전에 정한다. 이름 뽑기 사이트와 한 도메인 아래 `/eat`으로 합치는 방법도 있다) | Vercel 기본 주소(`https://seongsu-yolk-list.vercel.app`, 이미 쓰이고 있으면 Vercel이 정한 주소) |
| 2 | 이름 뽑기 사이트 주소는? | `https://korean-name-draw.vercel.app` |
| 3 | 영문 이름 `Food Gallery Bean`(푸드갤러리빈)·`Pain de Eco`(뺑드에코)를 이대로 쓸까? | 이대로. 나중에 바뀌어도 slug는 그대로 두고 표시 이름만 바꾼다 |
| 4 | 뺑드에코를 넣을까? ('영업 일시 중단' 공지를 낸 적이 있음, 날짜 불명) | 넣는다 |
| 5 | 팝업 표시(OUR POP-UP·환영 배너·하단 안내)를 켤까? | 켠다. 10/24 19시 이후 자동으로 숨는다 |
| 6 | GitHub 저장소를 어느 계정·조직에 만들까? | 로그인된 개인 계정, 비공개 `seongsu-yolk-list` |
| 7 | Vercel 프로젝트를 어느 계정·팀에 만들까? | 로그인된 개인 계정 |

### 오픈 전 팀이 할 것 (코드와 무관)
- 다시 확인할 가게
  - 뺑드에코: 영업 여부
  - 감요: 공개 후기가 3건뿐
  - 장수오리생삼겹: 2026년 6월에 지금 주소로 이전, 맛 평은 엇갈림
  - 무색: 회 신선도가 아쉬웠다는 후기 2건
  - 한입베이글: 크기에 비해 비싸다는 평
- 외국인 체크 4칸을 확인한다면 전화·방문 후 `checks`에 채운다.
- 확인을 마치면 `DATA.lastChecked`를 그 날짜로 바꿔 재배포한다.
- 면 카테고리 3번째 가게를 넣을지 (지금 2곳)
- 이름 뽑기 사이트 결과 화면에 이 사이트 링크를 넣을지 (서로 유입)
- 포토부스 신문 사진에 QR을 넣을 수 있는지 (써니사이드업 확인)
