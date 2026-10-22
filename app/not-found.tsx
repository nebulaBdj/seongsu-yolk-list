import Link from "next/link";
import { Header } from "@/components/Header";
import ui from "@/components/ui.module.css";

export default function NotFound() {
  return (
    <main className={ui.screen}>
      <div className={ui.top}>
        <Header />
        <h1 style={{ margin: 0, fontSize: 26 }}>No such pick</h1>
        <Link href="/" style={{ fontWeight: 700 }}>
          ← See all picks
        </Link>
      </div>
    </main>
  );
}
