# Responsive Website Starter

Next.js 16 App Router 기반의 반응형 웹사이트 스타터 템플릿입니다.

웹뷰 전용 브리지 없이 브라우저 환경을 기준으로 정리되어 있으며, 레이어 구조는 아래 원칙을 따릅니다.

- `src/domains`: 비즈니스 로직
- `src/atomics`: UI 전용 컴포넌트
- `src/shared`: 공통 유틸리티와 범용 코드

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm type-check
```

## Start Point

- 메인 페이지: `src/app/page.tsx`
- 루트 레이아웃: `src/app/layout.tsx`
- 글로벌 스타일: `src/app/globals.css`

## Environment

프로젝트 시작 전 `.env.example`을 기준으로 `.env.local`을 준비하세요.

- `NEXT_PUBLIC_API_HOST`: 백엔드 API 호스트
- `NEXT_PUBLIC_SITE_URL`: 프론트엔드 사이트 기준 URL
- `AUTH_REFRESH_PATH`: refresh token 재발급 엔드포인트
- `AUTH_LOGOUT_PATH`: 로그아웃 엔드포인트
- `PASSWORD_VERIFY_SECRET`: 서버 유틸 검증용 시크릿

## Auth Flow

- 클라이언트 로그인 성공 후 `useAuth().setSession()`으로 access/refresh token 저장
- access token은 짧은 수명 쿠키로 유지
- refresh token은 `HttpOnly` 쿠키로 유지
- 401 응답 시 `/api/auth/refresh`를 통해 access token 자동 재발급
- 로그아웃 시 `/api/auth/logout`으로 서버 쿠키 정리

```tsx
"use client";

import { useAuth } from "@/app/_providers/AuthProvider";

export function LoginExample() {
  const { setSession, clearSession } = useAuth();

  const handleLogin = async () => {
    await setSession({
      accessToken: "issued-access-token",
      refreshToken: "issued-refresh-token",
      accessTokenExpiresIn: 60 * 15,
      refreshTokenExpiresIn: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleLogin}
      >
        로그인 저장
      </button>
      <button
        type="button"
        onClick={clearSession}
      >
        로그아웃
      </button>
    </>
  );
}
```

## Query Example

`QUERY_KEYS`와 query wrapper는 `src/domains/template-status` 예시를 참고하면 됩니다.

```tsx
"use client";

import { useTemplateStatusQuery } from "@/domains/template-status";

export function TemplateStatusExample() {
  const { data, isLoading } = useTemplateStatusQuery();

  if (isLoading) return <p>Loading...</p>;

  return <p>{data?.version}</p>;
}
```

## Template Structure Example

- `src/domains/template-status/model`: 도메인 타입
- `src/domains/template-status/api`: API 호출 함수
- `src/domains/template-status/hooks`: query wrapper 사용 훅
- `src/atomics/organisms/TemplateStatusCard.tsx`: UI 소비 예시

## CI

- `.github/workflows/ci.yml`에서 `lint`, `type-check`, `build`를 검증합니다.

## Notes

- Next.js 16 App Router 기준
- TanStack Query는 직접 `useQuery` 계열 대신 프로젝트 래퍼 훅 사용
- 웹사이트 템플릿 기준으로 메타데이터와 기본 UI를 세팅
- `zod` 기반 env 검증 포함
- `robots`, `sitemap`, `manifest`, 기본 OG 이미지 포함
