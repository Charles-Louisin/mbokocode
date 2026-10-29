"use client";

import { useEffect, useState } from "react";

// Sommaire épinglé de l'étude de cas : le chapitre en cours de lecture s'allume.
export function ChapterNav({ chapters }: { chapters: { id: string; title: string }[] }) {
  const [current, setCurrent] = useState(chapters[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    chapters.forEach((chapter) => {
      const el = document.getElementById(chapter.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [chapters]);

  return (
    <nav aria-label="Chapitres de l'étude de cas" className="hidden lg:block">
      <ol className="space-y-3">
        {chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              aria-current={current === chapter.id ? "true" : undefined}
              className="group flex items-center gap-3 text-fg-subtle transition-colors duration-300 hover:text-fg aria-[current=true]:text-fg"
            >
              <span className="h-px w-4 bg-current transition-[width] duration-500 ease-(--ease-expo) group-aria-[current=true]:w-10" />
              <span className="label">{String(index + 1).padStart(2, "0")}</span>
              <span>{chapter.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
