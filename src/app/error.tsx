"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/atomics/atoms/Container";
import MainLayout from "@/atomics/templates/MainLayout";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <MainLayout>
      <Container className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
        <div className="w-full max-w-xl rounded-4xl border border-border bg-surface-strong p-10 text-center shadow-sm shadow-prism-teal-500/10">
          <p className="text-sm font-medium text-prism-accent">Unexpected Error</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-primary">문제가 발생했습니다</h1>
          <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
            요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 초기 화면으로 돌아가 주세요.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-prism-navy-deep"
            >
              다시 시도
            </button>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border-strong bg-surface px-6 text-sm font-medium text-secondary-foreground transition-colors hover:border-prism-teal-500 hover:text-primary"
            >
              홈으로 이동
            </Link>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
