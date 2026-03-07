"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LayoutState {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
}

/**
 * @description 레이아웃 상태 관리 스토어
 * 헤더/푸터 높이 등을 관리하여 깜빡임 없는 렌더링을 보장합니다.
 */
const ESTIMATED_HEADER_HEIGHT = 57; // 예상 헤더 높이 (px)

export const useLayoutStore = create<LayoutState>()(
  persist(
    set => ({
      headerHeight: ESTIMATED_HEADER_HEIGHT, // 초기값을 예상 높이로 설정하여 레이아웃 시프트 방지
      setHeaderHeight: (height: number) => set({ headerHeight: height }),
    }),
    {
      name: "layout-storage",
      partialize: state => ({
        headerHeight: state.headerHeight,
      }),
    },
  ),
);
