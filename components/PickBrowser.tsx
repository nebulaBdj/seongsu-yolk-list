"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import styles from "./home.module.css";
import ui from "./ui.module.css";

const FIRST_PICKS = 6;

type Item = { slug: string; category: string; card: React.ReactNode };

type PickBrowserProps = {
  categories: { id: string; en: string }[];
  items: Item[];
  // 탭 위(머리줄·제목)와 아래(LIST/MAP), 목록 뒤(배너·하단 줄)
  head: React.ReactNode;
  toggle: React.ReactNode;
  after: React.ReactNode;
};

// 카테고리 탭 + SHOW MORE. 카드는 모두 HTML에 두고 CSS로만 숨긴다 (SPEC §3-1)
export function PickBrowser({ categories, items, head, toggle, after }: PickBrowserProps) {
  const [selected, setSelected] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const isVisible = (item: Item, index: number) =>
    selected === "all" ? expanded || index < FIRST_PICKS : item.category === selected;
  const canShowMore = selected === "all" && !expanded && items.length > FIRST_PICKS;

  const select = (id: string) => {
    setSelected(id);
    track("category_select", { category: id });
  };

  return (
    <>
      <div className={ui.top}>
        {head}
        <div className={styles.tabs} role="group" aria-label="Category">
          {[{ id: "all", en: "ALL" }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              className={styles.tab}
              aria-pressed={selected === c.id}
              onClick={() => select(c.id)}
            >
              {c.en}
            </button>
          ))}
        </div>
        {toggle}
      </div>
      <div className={styles.list}>
        {items.map((item, index) => (
          <div key={item.slug} className={isVisible(item, index) ? undefined : styles.hidden}>
            {item.card}
          </div>
        ))}
        {canShowMore && (
          <button
            type="button"
            className={styles.showMore}
            onClick={() => {
              setExpanded(true);
              track("show_more");
            }}
          >
            SHOW MORE PICKS
          </button>
        )}
        {after}
      </div>
    </>
  );
}
