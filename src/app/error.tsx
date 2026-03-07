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
        <div className="w-full max-w-xl rounded-4xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-red-600">Unexpected Error</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">문제가 발생했습니다</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-600 sm:text-base">
            요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 초기 화면으로 돌아가 주세요.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              다시 시도
            </button>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950"
            >
              홈으로 이동
            </Link>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
