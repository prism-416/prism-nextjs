import Container from "@/atomics/atoms/Container";
import TemplateStatusCard from "@/atomics/organisms/TemplateStatusCard";
import MainLayout from "@/atomics/templates/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <main className="bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_45%),linear-gradient(to_bottom,#f8fafc,#ffffff)] py-16 text-zinc-950">
        <Container className="flex flex-col gap-16">
          <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-zinc-200 bg-white px-4 py-1 text-sm font-medium text-zinc-600 shadow-sm">
                Next.js 16 Responsive Website Starter
              </span>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  웹뷰 전제 없이 바로 확장할 수 있는 반응형 웹사이트 템플릿
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                  App Router, Tailwind CSS, TanStack Query 기반으로 구성된 스타터입니다. 랜딩 페이지, 기업 사이트,
                  서비스 소개 페이지처럼 브라우저 중심의 웹 프로젝트에 맞게 가볍고 견고한 시작점을 제공합니다.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#features"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  템플릿 특징 보기
                </a>
                <a
                  href="https://nextjs.org/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950"
                >
                  Next.js 문서 보기
                </a>
              </div>
            </div>

            <section className="grid gap-4 rounded-4xl border border-zinc-200 bg-white p-6 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.35)] sm:grid-cols-2">
              <div className="rounded-2xl bg-zinc-50 p-5">
                <p className="text-sm font-medium text-zinc-500">Responsive First</p>
                <p className="mt-2 text-2xl font-semibold">모바일부터 데스크톱까지</p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  한 화면 안에서 자연스럽게 재배치되는 섹션 구조를 기본값으로 제공합니다.
                </p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-5">
                <p className="text-sm font-medium text-zinc-500">Clear Layers</p>
                <p className="mt-2 text-2xl font-semibold">도메인 분리된 구조</p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  `domains`, `atomics`, `shared` 레이어를 기준으로 확장하기 좋게 구성했습니다.
                </p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-5 sm:col-span-2">
                <p className="text-sm font-medium text-zinc-500">Ops Ready</p>
                <p className="mt-2 text-2xl font-semibold">템플릿 기본 운영값 포함</p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  env 검증, 기본 메타데이터, robots/sitemap/manifest, auth route handler까지 바로 확장할 수 있는 공통
                  기반을 제공합니다.
                </p>
              </div>
            </section>
          </section>

          <section
            id="features"
            className="grid gap-4 lg:grid-cols-3"
          >
            <article className="rounded-3xl border border-zinc-200 bg-white p-6">
              <p className="text-sm font-medium text-green-700">Design System Start</p>
              <h2 className="mt-3 text-xl font-semibold">공통 레이아웃 포함</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                헤더, 푸터, 컨테이너와 같은 웹사이트 기본 뼈대를 포함해 바로 페이지를 추가할 수 있습니다.
              </p>
            </article>
            <article className="rounded-3xl border border-zinc-200 bg-white p-6">
              <p className="text-sm font-medium text-green-700">Metadata Defaults</p>
              <h2 className="mt-3 text-xl font-semibold">검색/공유 기본 세팅</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Open Graph 이미지, 앱 매니페스트, sitemap, robots 기본값을 템플릿에 함께 제공합니다.
              </p>
            </article>
            <article className="rounded-3xl border border-zinc-200 bg-white p-6">
              <p className="text-sm font-medium text-green-700">Typed Runtime Config</p>
              <h2 className="mt-3 text-xl font-semibold">환경변수 검증</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                잘못된 env 값은 실행 초기에 바로 드러나도록 구성해 배포 시점을 더 안전하게 만듭니다.
              </p>
            </article>
          </section>

          <section
            id="structure"
            className="grid gap-4 md:grid-cols-3"
          >
            <article className="rounded-3xl border border-zinc-200 bg-white p-6">
              <p className="text-sm font-medium text-green-700">`src/domains`</p>
              <h2 className="mt-3 text-xl font-semibold">비즈니스 로직</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                API 모델, 서비스별 흐름, 도메인 규칙처럼 제품의 핵심 로직을 관리합니다.
              </p>
            </article>
            <article className="rounded-3xl border border-zinc-200 bg-white p-6">
              <p className="text-sm font-medium text-green-700">`src/atomics`</p>
              <h2 className="mt-3 text-xl font-semibold">UI 전용 컴포넌트</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                버튼, 카드, 레이아웃 템플릿처럼 재사용 가능한 표현 계층을 구성합니다.
              </p>
            </article>
            <article className="rounded-3xl border border-zinc-200 bg-white p-6">
              <p className="text-sm font-medium text-green-700">`src/shared`</p>
              <h2 className="mt-3 text-xl font-semibold">공통 유틸리티</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                환경 상수, 공통 훅, HTTP 유틸리티처럼 도메인 중립적인 코드를 둡니다.
              </p>
            </article>
          </section>

          <section
            id="getting-started"
            className="rounded-4xl border border-zinc-200 bg-white p-8"
          >
            <h2 className="text-2xl font-semibold tracking-tight">바로 시작할 때 추천하는 순서</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-zinc-50 p-5">
                <p className="text-sm font-medium text-zinc-500">1. Brand</p>
                <p className="mt-2 font-semibold text-zinc-950">메타데이터와 컬러 수정</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  사이트 이름, OG 이미지, 홈 텍스트를 브랜드 기준으로 바꿉니다.
                </p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-5">
                <p className="text-sm font-medium text-zinc-500">2. Structure</p>
                <p className="mt-2 font-semibold text-zinc-950">도메인별 화면 추가</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  페이지를 늘리면서 `domains`와 `atomics`를 기준으로 기능을 분리합니다.
                </p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-5">
                <p className="text-sm font-medium text-zinc-500">3. Data</p>
                <p className="mt-2 font-semibold text-zinc-950">API와 Query key 연결</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  실제 API 호출을 추가하고 query wrapper와 key factory를 프로젝트 규칙에 맞게 채웁니다.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="rounded-4xl border border-zinc-200 bg-white p-8">
              <p className="text-sm font-medium text-green-700">Template Usage Example</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">실제 도메인 예시가 포함되어 있습니다</h2>
              <p className="mt-4 text-sm leading-6 text-zinc-600 sm:text-base">
                `src/domains/template-status`는 이 템플릿에서 권장하는 최소 구조 예시입니다. 타입, API 함수, query
                hook을 분리하고 UI는 `src/atomics`에서 소비하도록 구성했습니다.
              </p>
              <div className="mt-6 rounded-2xl bg-zinc-50 p-5 font-mono text-xs leading-6 text-zinc-700">
                <p>`src/domains/template-status/model/types.ts`</p>
                <p>`src/domains/template-status/api/getTemplateStatus.ts`</p>
                <p>`src/domains/template-status/hooks/useTemplateStatusQuery.ts`</p>
                <p>`src/atomics/organisms/TemplateStatusCard.tsx`</p>
              </div>
            </div>
            <TemplateStatusCard />
          </section>
        </Container>
      </main>
    </MainLayout>
  );
}
