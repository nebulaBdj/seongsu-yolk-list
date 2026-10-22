// 한국어 발음 (Web Speech API). 한국어 음성이 없는 기기에서는 쓰지 않는다
export function hasKoreanVoice(): boolean {
  if (!("speechSynthesis" in window)) return false;
  return window.speechSynthesis.getVoices().some((voice) => voice.lang.toLowerCase().startsWith("ko"));
}

export function speakKorean(text: string): void {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
