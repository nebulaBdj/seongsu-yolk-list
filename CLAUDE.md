# seongsu-yolk-list

Seoul Yolk의 성수 맛집 가이드 'The Yolk List'. 성수에 온 외국인이 '로컬 찐 맛집' 14곳을 카테고리별로 고르고 구글 지도로 찾아가게 하는 사이트다. 무엇을 만드는지는 `SPEC.md`, 화면은 `design/` 폴더(첫 시안), 가게 내용은 `data/places.json`이 기준이다.

맥락: StartupXperience 26-2기 써니사이드업(AI 신문 포토부스) A팀 프로젝트다. 팀은 매출로 평가받는다. 이 사이트는 인스타 @seoul.yolk의 콘텐츠이자, 팝업 부스와 이름 뽑기 사이트로 잇는 입구이고, 식당 제휴(숍인숍) 제안 자료를 쌓는 도구다. 자세한 건 `SPEC.md` §0.

## 기본 규칙
- 사이트 문구는 영어, 코드 주석과 커밋 메시지는 한국어. 가게 한글 이름·뱃지·한국어 한마디·택시용 주소는 한글로 쓴다.
- **시작하면 먼저** GitHub·Vercel 로그인(`gh auth status`, `vercel whoami`)을 확인하고, `SPEC.md` §14의 질문을 한 메시지에 번호 목록으로 한 번에 묻는다. 로그인이 안 돼 있으면 같은 메시지에서 부탁한다(`gh`·`vercel`이 없으면 설치부터). 답이 없는 항목은 §14의 기본값을 쓴다.
- 답을 받으면 **§13 0~8단계를 멈추지 않고 끝까지 진행한다.** 진행 중에는 질문하지 않는다. 막히는 것은 기본값이나 TODO로 두고 넘어간다.
- **저장소와 배포도 직접 한다.** GitHub 비공개 저장소(`gh`), Vercel 프로젝트 연결·환경변수·production 배포(`vercel` CLI)까지 SPEC §13 순서대로 한다.
- 단계마다 `npm run build`가 통과하는지 확인하고 커밋·push한다.
- 다 끝나면 한 번에 보고한다: 배포 주소, 한 일, TODO로 남긴 것, 내가 직접 할 것. 보고 끝에 **GA4 측정 ID를 요청**한다(배포 주소로 웹 스트림을 만들어 달라고). 받으면 `NEXT_PUBLIC_GA_ID`를 production 환경변수로 넣고 재배포한 뒤, 페이지 head에 gtag가 들어갔는지 확인한다.
- `design/` 파일은 참고용이다. 수정하지 않는다. 시안 속 가게(Zesty Saloon 등)와 웨이팅·가격 문구는 예시이고, 실제 내용은 `data/places.json`에서 가져온다.
- **카카오맵 이름·평점·리뷰 수는 사이트 어디에도 넣지 않는다.** 모든 가게는 '로컬 찐 맛집'으로만 소개한다.

## 스택
- Next.js(App Router) + TypeScript, 정적 생성. Vercel 배포.
- 상태관리 라이브러리 없음, 지도는 직접 그린 SVG(지도 라이브러리·API 키 없음), 의존성은 최소로.
- 이 폴더에는 이미 파일이 있어 `create-next-app`을 바로 실행할 수 없다. 임시 폴더에 만든 뒤 옮기거나 직접 구성한다.

## 폴더 구조 (목표)
```
app/
  page.tsx                 홈: 목록 (design/Main)
  places/[slug]/page.tsx   상세: 주문서 영수증 14개 (design/Detail)
  map/page.tsx             지도 (design/Map)
  sitemap.ts  robots.ts  opengraph-image.tsx
components/receipt/        Slot, Paper, Leader, Dash, Barcode, Zigzag, Badge …
components/                PlaceCard, CategoryTabs, SeoulMap, PinSheet, SayIt
lib/                       places.ts(데이터 읽기), maps.ts(구글 지도 주소), geo.ts(위경도→지도 좌표, 핀 밀어내기), speech.ts, storage.ts, analytics.ts
config/site.ts             SITE·EVENT·DATA·PHRASES (SPEC §7)
data/places.json
design/                    디자인 참고 파일 (첫 시안)
```

## 코드 규칙
- UI는 props와 로컬 상태로만 그린다. 공유할 수 있는 화면 상태의 원천은 URL이다(가게 = `/places/[slug]`). 카테고리 탭·지도 핀 선택은 로컬 상태.
- 원본 데이터를 내려보내고, 파생 값(No. 번호, 구글 지도 주소, 택시용 전체 주소, 지도 좌표)은 쓰는 곳 옆에서 계산한다.
- 가공은 이름 있는 순수 함수의 합성으로 만든다(예: `project` → `spreadPins`).
- 행사처럼 바뀌는 값은 config로 주입한다. 공용화는 중복이 두 번째 확인된 뒤에 한다.
- localStorage·sessionStorage 접근은 `lib/storage.ts` 한 곳에서 try/catch로 감싼다.

## SEO 규칙 (SPEC §12)
- 검색엔진이 보는 HTML에 14곳의 본문이 모두 들어가야 한다. 클라이언트 컴포넌트는 카테고리 탭·SHOW MORE·지도 핀 선택·발음·환영 배너만.
- 크롤링되는 `<a href>`에 쿼리 파라미터 금지. UTM은 외부 링크에만.
- 페이지마다 metadata(title·description·canonical·OG), h1은 하나.
- 한글 폰트는 `next/font`로 불러오고 preload를 끈다.
