import Container from "@/atomics/atoms/Container";
import MainLayout from "@/atomics/templates/MainLayout";

export default function Loading() {
  return (
    <MainLayout>
      <Container className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
        <div className="w-full max-w-xl rounded-4xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-950">페이지를 불러오는 중입니다</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            초기 데이터와 레이아웃을 준비하고 있습니다. 잠시만 기다려 주세요.
          </p>
        </div>
      </Container>
    </MainLayout>
  );
}
