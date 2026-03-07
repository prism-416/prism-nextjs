"use client";

import { useEffect, useState, RefObject } from "react";

type Amount = number | "some" | "all";

const supportsIO = typeof window !== "undefined" && "IntersectionObserver" in window;

export type UseInViewOptions = {
  once?: boolean; // true면 처음 보인 뒤 관찰 중단
  margin?: string; // '48px' 또는 '0px 0px -48px 0px'
  amount?: Amount; // 'all' | 'some' | number(0~1)
  root?: Element | null; // 옵저버 root
};

/**
 * API: useInView(ref, { once, margin, amount, root })
 * - margin: '48px' → '0px 0px -48px 0px' 변환(조기 트리거)
 * - amount: 'some'(0) | 'all'(1) | number(0~1)
 * - 반환: boolean. IO 미지원/SSR에서는 true로 폴백
 */
export function useInView(
  ref: RefObject<Element | null>,
  { once = false, margin, amount = "some", root = null }: UseInViewOptions = {},
) {
  const [inView, setInView] = useState(!supportsIO);

  useEffect(() => {
    if (!supportsIO) return;

    const el = ref.current;
    if (!el) return;

    const threshold = amount === "all" ? 1 : typeof amount === "number" ? amount : 0;
    // '48px' 같이 한 값만 주면 하단 여백(-)로 해석
    const rootMargin = !margin ? "0px" : /\s/.test(margin) ? margin : `0px 0px -${margin} 0px`;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const hit = entry.isIntersecting || entry.intersectionRatio > 0;
          if (hit) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { root, rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, margin, amount, root]);

  return inView;
}
