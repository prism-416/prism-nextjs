"use client";

import { useTemplateStatusQuery } from "@/domains/template-status";

export default function TemplateStatusCard() {
  const { data, isLoading, isError } = useTemplateStatusQuery();

  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-green-700">Live Template Example</p>
          <h2 className="mt-2 text-xl font-semibold text-zinc-950">Query Wrapper + Domain Sample</h2>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">Client Query</span>
      </div>

      {isLoading && <p className="mt-4 text-sm text-zinc-600">템플릿 상태를 불러오는 중입니다...</p>}
      {isError && <p className="mt-4 text-sm text-red-600">예시 상태 정보를 가져오지 못했습니다.</p>}

      {data && (
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-zinc-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">App Name</dt>
            <dd className="mt-2 text-sm font-medium text-zinc-950">{data.appName}</dd>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Version</dt>
            <dd className="mt-2 text-sm font-medium text-zinc-950">{data.version}</dd>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Environment</dt>
            <dd className="mt-2 text-sm font-medium text-zinc-950">{data.environment}</dd>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Auth Cookie</dt>
            <dd className="mt-2 text-sm font-medium text-zinc-950">{data.hasAccessToken ? "Present" : "Missing"}</dd>
          </div>
        </dl>
      )}
    </article>
  );
}
