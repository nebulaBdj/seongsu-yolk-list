// 브라우저 저장소 접근은 여기 한 곳에서만 (인앱 브라우저·사생활 모드에서 막혀도 화면은 그대로)
const SOURCE_KEY = "yolklist:source";

// 첫 진입의 utm_source를 이 탭 동안 기억한다 (신문 QR 환영 배너용)
export function rememberSource(search: string): void {
  try {
    if (sessionStorage.getItem(SOURCE_KEY) !== null) return;
    const source = new URLSearchParams(search).get("utm_source");
    sessionStorage.setItem(SOURCE_KEY, source ?? "");
  } catch {
    // 저장 못 하면 배너를 안 보일 뿐이다
  }
}

export function readSource(): string | null {
  try {
    return sessionStorage.getItem(SOURCE_KEY) || null;
  } catch {
    return null;
  }
}
