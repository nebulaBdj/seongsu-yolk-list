import { landmarks } from "@/lib/places";
import { MAP_SIZE, project, type Point } from "@/lib/geo";

const { width: W, height: H } = MAP_SIZE;
const PX = W / 390; // 화면 1px에 해당하는 지도 단위 (폭 390px 기준)

// 두 점을 지나는 직선을 지도 양 끝까지 늘린다 (2호선)
function extendLine(a: Point, b: Point): [Point, Point] {
  const slope = (b.y - a.y) / (b.x - a.x);
  return [
    { x: 0, y: a.y - slope * a.x },
    { x: W, y: a.y + slope * (W - a.x) },
  ];
}

const station = (id: string) => {
  const landmark = landmarks.find((l) => l.id === id);
  if (!landmark) throw new Error(`없는 랜드마크: ${id}`);
  return { ...landmark, ...project(landmark.lat, landmark.lng) };
};

type SeoulMapProps = {
  // 밀려난 핀은 실제 위치에 점을 찍고 핀까지 선을 긋는다
  leaders: { from: Point; to: Point }[];
};

// 그림 지도 바탕 (SPEC §6): 서울숲·한강은 대략적인 면, 2호선과 역 3곳은 실제 좌표
export function SeoulMap({ leaders }: SeoulMapProps) {
  const ttukseom = station("ttukseom-stn");
  const seongsu = station("seongsu-stn");
  const forestStn = station("seoul-forest-stn");
  const [lineStart, lineEnd] = extendLine(ttukseom, seongsu);
  const font = { fontSize: 10 * PX, fontWeight: 700 };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label="Illustrated map of Seongsu with Line 2, Ttukseom, Seongsu and Seoul Forest stations, and the numbered picks"
      style={{ display: "block", fontFamily: "var(--font-mono), monospace" }}
    >
      <rect width={W} height={H} fill="#F4F5FA" />
      <path d={`M0 ${H - 90}C${W * 0.35} ${H - 120} ${W * 0.7} ${H - 70} ${W} ${H - 20}V${H}H0Z`} fill="#CFDDFB" />
      <text x={22 * PX} y={H - 14 * PX} fill="#2F4A8A" {...font}>
        HAN RIVER
      </text>
      <path d={`M0 ${150 * PX}H${16 * PX}L${22 * PX} ${330 * PX}L0 ${345 * PX}Z`} fill="#D7ECD5" />
      <text
        x={12 * PX}
        y={300 * PX}
        fill="#2F5E2B"
        transform={`rotate(-90 ${12 * PX} ${300 * PX})`}
        {...font}
      >
        SEOUL FOREST
      </text>

      <line x1={lineStart.x} y1={lineStart.y} x2={lineEnd.x} y2={lineEnd.y} stroke="#DADFEB" strokeWidth={18 * PX} />
      <line x1={lineStart.x} y1={lineStart.y} x2={lineEnd.x} y2={lineEnd.y} stroke="#00A84D" strokeWidth={4 * PX} />
      <text x={8 * PX} y={lineStart.y + 22 * PX} fill="#00733A" {...font}>
        LINE 2
      </text>

      {leaders.map(({ from, to }, i) => (
        <g key={i}>
          <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#1A1A1A" strokeWidth={1.2 * PX} />
          <circle cx={from.x} cy={from.y} r={2.5 * PX} fill="#1A1A1A" />
        </g>
      ))}

      {/* 뚝섬역 주변은 핀이 몰려 있어 이름을 오른쪽 위 빈자리에 둔다 */}
      {[
        { s: ttukseom, dx: 9, dy: -8, anchor: "start" as const },
        { s: seongsu, dx: 0, dy: -16, anchor: "middle" as const },
      ].map(({ s, dx, dy, anchor }) => (
        <g key={s.id}>
          <circle cx={s.x} cy={s.y} r={8 * PX} fill="#00A84D" stroke="#FFFFFF" strokeWidth={3 * PX} />
          <text
            x={s.x + dx * PX}
            y={s.y + dy * PX}
            fill="#00733A"
            textAnchor={anchor}
            stroke="#F4F5FA"
            strokeWidth={3 * PX}
            paintOrder="stroke"
            {...font}
          >
            {s.en}
          </text>
        </g>
      ))}
      <circle cx={forestStn.x} cy={forestStn.y} r={7 * PX} fill="#E0A100" stroke="#FFFFFF" strokeWidth={3 * PX} />
      <text x={forestStn.x + 12 * PX} y={forestStn.y + 4 * PX} fill="#4A5068" {...font}>
        {forestStn.en}
      </text>
    </svg>
  );
}
