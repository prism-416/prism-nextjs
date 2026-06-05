"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import { Input } from "@/atomics/atoms/Input";
import { Textarea } from "@/atomics/atoms/Textarea";
import { DatePicker } from "@/atomics/molecules/DatePicker";
import type { ProjectWorkItem } from "@/domains/projects/types";

type InlineWorkItemEditorProps = {
  item: ProjectWorkItem;
  onTitleUpdate: (item: ProjectWorkItem, title: string, options?: { keepEditing?: boolean }) => void | Promise<void>;
  onDescriptionUpdate: (
    item: ProjectWorkItem,
    description: string,
    options?: { keepEditing?: boolean },
  ) => void | Promise<void>;
  onScheduleUpdate: (
    item: ProjectWorkItem,
    patch: { startDate?: string | null; dueDate?: string | null },
  ) => void | Promise<void>;
  onEditCancel: () => void;
};

export function InlineWorkItemEditor({
  item,
  onTitleUpdate,
  onDescriptionUpdate,
  onScheduleUpdate,
  onEditCancel,
}: InlineWorkItemEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const didFinishRef = useRef(false);
  const [draftTitle, setDraftTitle] = useState(item.title);
  const [draftDescription, setDraftDescription] = useState(item.description);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const finishTitleEditing = useCallback(
    (title: string, options?: { keepEditing?: boolean }) => {
      if (didFinishRef.current) {
        return;
      }

      didFinishRef.current = !options?.keepEditing;
      void onTitleUpdate(item, title.trim() || item.title, options);
    },
    [item, onTitleUpdate],
  );

  const finishDescriptionEditing = useCallback(
    (description: string, options?: { keepEditing?: boolean }) => {
      if (didFinishRef.current) {
        return;
      }

      didFinishRef.current = !options?.keepEditing;
      void onDescriptionUpdate(item, description.trim(), options);
    },
    [item, onDescriptionUpdate],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        finishTitleEditing(draftTitle);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        didFinishRef.current = true;
        setDraftTitle(item.title);
        setDraftDescription(item.description);
        onEditCancel();
      }
    },
    [draftTitle, finishTitleEditing, item.description, item.title, onEditCancel],
  );

  const handleTitleBlur = useCallback(() => {
    finishTitleEditing(draftTitle, { keepEditing: true });
  }, [draftTitle, finishTitleEditing]);

  const handleDescriptionBlur = useCallback(() => {
    finishDescriptionEditing(draftDescription, { keepEditing: true });
  }, [draftDescription, finishDescriptionEditing]);

  const handleDescriptionKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        finishDescriptionEditing(draftDescription);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        didFinishRef.current = true;
        setDraftTitle(item.title);
        setDraftDescription(item.description);
        onEditCancel();
      }
    },
    [draftDescription, finishDescriptionEditing, item.description, item.title, onEditCancel],
  );

  const finishAllEditing = useCallback(() => {
    finishTitleEditing(draftTitle, { keepEditing: true });
    finishDescriptionEditing(draftDescription);
  }, [draftDescription, draftTitle, finishDescriptionEditing, finishTitleEditing]);

  useEffect(() => {
    function isPointInsideRect(rect: DOMRect, x: number, y: number) {
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    function isPointInsideRoundedCard(card: Element, x: number, y: number) {
      const rect = card.getBoundingClientRect();
      if (!isPointInsideRect(rect, x, y)) return false;

      const style = window.getComputedStyle(card);
      const tl = parseFloat(style.borderTopLeftRadius) || 0;
      const tr = parseFloat(style.borderTopRightRadius) || 0;
      const br = parseFloat(style.borderBottomRightRadius) || 0;
      const bl = parseFloat(style.borderBottomLeftRadius) || 0;

      if (x < rect.left + tl && y < rect.top + tl) {
        const dx = x - (rect.left + tl);
        const dy = y - (rect.top + tl);
        if (dx * dx + dy * dy > tl * tl) return false;
      }
      if (x > rect.right - tr && y < rect.top + tr) {
        const dx = x - (rect.right - tr);
        const dy = y - (rect.top + tr);
        if (dx * dx + dy * dy > tr * tr) return false;
      }
      if (x > rect.right - br && y > rect.bottom - br) {
        const dx = x - (rect.right - br);
        const dy = y - (rect.bottom - br);
        if (dx * dx + dy * dy > br * br) return false;
      }
      if (x < rect.left + bl && y > rect.bottom - bl) {
        const dx = x - (rect.left + bl);
        const dy = y - (rect.bottom - bl);
        if (dx * dx + dy * dy > bl * bl) return false;
      }
      return true;
    }

    function isPointInsideEditingCard(event: PointerEvent) {
      return Array.from(document.querySelectorAll("[data-dashboard-work-item-card]")).some(
        card =>
          card.getAttribute("data-dashboard-work-item-card") === item.itemId &&
          isPointInsideRoundedCard(card, event.clientX, event.clientY),
      );
    }

    function isPointInsideOpenDropdown(event: PointerEvent) {
      return Array.from(document.querySelectorAll("[data-radix-popper-content-wrapper], [role='menu']")).some(element =>
        isPointInsideRect(element.getBoundingClientRect(), event.clientX, event.clientY),
      );
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (editorRef.current?.contains(target)) {
        return;
      }

      if (
        target instanceof Element &&
        target.closest("[data-dashboard-work-item-card]")?.getAttribute("data-dashboard-work-item-card") === item.itemId
      ) {
        return;
      }

      if (isPointInsideEditingCard(event)) {
        return;
      }

      if (target instanceof Element && target.closest("[data-radix-popper-content-wrapper]")) {
        return;
      }

      if (target instanceof Element && target.closest("[role='menu']")) {
        return;
      }

      if (isPointInsideOpenDropdown(event)) {
        return;
      }

      finishAllEditing();
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [finishAllEditing, item.itemId]);

  return (
    <div
      ref={editorRef}
      className="w-full"
    >
      <Input
        ref={inputRef}
        value={draftTitle}
        onChange={event => setDraftTitle(event.target.value)}
        onBlur={handleTitleBlur}
        onKeyDown={handleKeyDown}
        onClick={event => event.stopPropagation()}
        onPointerDown={event => event.stopPropagation()}
        maxLength={100}
        className="h-8 rounded-md border-border bg-surface-field px-2 text-sm font-semibold text-prism-ink focus-visible:ring-2 focus-visible:ring-ring"
      />

      <Textarea
        value={draftDescription}
        onChange={event => setDraftDescription(event.target.value)}
        onBlur={handleDescriptionBlur}
        onKeyDown={handleDescriptionKeyDown}
        onClick={event => event.stopPropagation()}
        onPointerDown={event => event.stopPropagation()}
        maxLength={800}
        placeholder="No description."
        className="mt-2 min-h-16 resize-none rounded-md border-border bg-surface-field px-2 py-1.5 text-sm text-prism-body focus-visible:ring-2 focus-visible:ring-ring"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <DatePicker
          variant="pill"
          label="Start"
          value={item.startDate ?? ""}
          onChange={value => void onScheduleUpdate(item, { startDate: value || null })}
        />
        <DatePicker
          variant="pill"
          label="Due"
          value={item.dueDate ?? ""}
          min={item.startDate ?? undefined}
          onChange={value => void onScheduleUpdate(item, { dueDate: value || null })}
        />
      </div>
    </div>
  );
}
