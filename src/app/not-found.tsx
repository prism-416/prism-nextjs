import Link from "next/link";
import Container from "@/atomics/atoms/Container";
import MainLayout from "@/atomics/templates/MainLayout";

export default function NotFound() {
  return (
    <MainLayout>
      <Container className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
        <div className="w-full max-w-xl rounded-4xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-green-700">404 Error</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-600 sm:text-base">
            요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다. 홈으로 돌아가서 다시 탐색해 보세요.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </Container>
    </MainLayout>
  );
}
