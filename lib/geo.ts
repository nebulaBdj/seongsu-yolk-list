// 위경도 → 그림 지도 좌표 (SPEC §6). 좁은 범위라 평면으로 계산하고 단위는 m
export const MAP_SIZE = { width: 1545, height: 1609 };
const WEST = 127.0425;
const NORTH = 37.551;
const M_PER_LNG = 88260;
const M_PER_LAT = 110950;

export type Point = { x: number; y: number };

export function project(lat: number, lng: number): Point {
  return { x: (lng - WEST) * M_PER_LNG, y: (NORTH - lat) * M_PER_LAT };
}

// 폭 390px 기준 1px = 약 4m. 핀 간격·이동 한도를 지도 단위로 바꾼다
const M_PER_PX = MAP_SIZE.width / 390;
const MIN_GAP = 34 * M_PER_PX;
const MAX_SHIFT = 40 * M_PER_PX;
const EDGE = 20 * M_PER_PX; // 선택된 핀(36px)이 지도 밖으로 잘리지 않게

const clamp = (value: number, max: number) => Math.min(Math.max(value, EDGE), max - EDGE);

// 가까운 핀끼리 서로 밀어낸다(최대 40px). 빌드 때 한 번 계산하는 순수 함수
export function spreadPins(points: Point[]): Point[] {
  const pins = points.map((p) => ({ ...p }));
  for (let round = 0; round < 200; round++) {
    let moved = false;
    for (let i = 0; i < pins.length; i++) {
      for (let j = i + 1; j < pins.length; j++) {
        const dx = pins[j].x - pins[i].x;
        const dy = pins[j].y - pins[i].y;
        const dist = Math.hypot(dx, dy);
        if (dist >= MIN_GAP) continue;
        // 같은 자리면 각도를 정해서 민다
        const [ux, uy] = dist > 0.01 ? [dx / dist, dy / dist] : [Math.cos(i + j), Math.sin(i + j)];
        const push = (MIN_GAP - dist) / 2 + 0.5;
        pins[i].x -= ux * push;
        pins[i].y -= uy * push;
        pins[j].x += ux * push;
        pins[j].y += uy * push;
        moved = true;
      }
    }
    // 실제 위치에서 너무 멀어지지 않게 묶는다
    pins.forEach((pin, k) => {
      const ox = pin.x - points[k].x;
      const oy = pin.y - points[k].y;
      const shift = Math.hypot(ox, oy);
      if (shift > MAX_SHIFT) {
        pin.x = points[k].x + (ox / shift) * MAX_SHIFT;
        pin.y = points[k].y + (oy / shift) * MAX_SHIFT;
      }
      pin.x = clamp(pin.x, MAP_SIZE.width);
      pin.y = clamp(pin.y, MAP_SIZE.height);
    });
    if (!moved) break;
  }
  return pins;
}
