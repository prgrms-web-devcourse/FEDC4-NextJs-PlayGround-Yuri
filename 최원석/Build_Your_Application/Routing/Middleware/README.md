# 미들웨어

미들웨어를 사용하면 요청이 완료되기 전에 코드를 실행할 수 있습니다. 그런 다음 들어오는 요청에 따라 응답을 재작성하거나, 리다이렉트하거나, 요청 또는 응답 헤더를 수정하거나, 직접 응답함으로써 응답을 수정할 수 있습니다.

미들웨어는 캐시 된 컨텐츠와 경로가 일치되기 전에 실행됩니다. 자세한 내용은 [경로 일치](https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths)를 참조하세요.

---

## 규칙

프로젝트의 루트에서 `middleware.ts`(또는 `.js`) 파일을 사용하여 미들웨어를 정의합니다. 예를 들어, `pages` 또는 `app`과 같은 레벨에 있거나 해당하는 경우 `src` 내부에 정의합니다.

---

## 예시

```ts
// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 만약 내부에서 `await`을 사용한다면, 이 함수는 `async`로 표시될 수 있습니다.
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/home", request.url));
}

// 아래의 "경로 일치"를 참조하여 더 자세히 알아보세요.
export const config = {
  matcher: "/about/:path*",
};
```

---

## 경로 일치

프로젝트의 **모든 경로**에 대해 미들웨어가 호출됩니다. 실행 순서는 다음과 같습니다:

1. `next.config.js`의 `headers`
2. `next.config.js`의 `redirects`
3. 미들웨어 (`rewrites`, `redirects` 등)
4. `next.config.js`의 `beforeFiles` (`rewrites`)
5. 파일 시스템 경로 (`public/`, `_next/static/`, `pages/`, `app/` 등)
6. `next.config.js`의 `afterFiles` (`rewrites`)
7. 동적 경로 (`/blog/[slug]`)
8. `next.config.js`의 `fallback` (`rewrites`)

미들웨어가 실행될 경로를 정의하는 방법에는 두 가지가 있습니다:

1. [사용자 정의 matcher 구성](https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher)
2. [조건문](https://nextjs.org/docs/app/building-your-application/routing/middleware#conditional-statements)

### Matcher

`matcher`를 사용하면 특정 경로에서 실행할 미들웨어를 필터링할 수 있습니다.

```js
// middleware.js

export const config = {
  matcher: "/about/:path*",
};
```

배열 문법을 사용하여 단일 경로 또는 여러 경로를 일치시킬 수 있습니다.

```js
// middleware.js

export const config = {
  matcher: ["/about/:path*", "/dashboard/:path*"],
};
```

`matcher` 구성은 부정적 전방탐색(negative lookahead) 또는 문자 일치(character matching)와 같은 완전한 정규식을 지원합니다. 특정 경로를 제외한 모든 경로와 일치하는 부정적 전방탐색의 예는 다음과 같습니다.

```js
// middleware.js

export const config = {
  matcher: [
    /*
     * 다음과 같이 시작하는 경로를 제외한 모든 요청 경로와 일치시킵니다.
     * - api (API 경로)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

> **참고**: `matcher` 값은 상수이어야 하므로 빌드 시 정적으로 분석될 수 있습니다. 변수와 같은 동적 값은 무시됩니다.

matcher 구성:

1. 반드시 `/`로 시작해야 합니다.
2. 이름 있는 매개변수를 포함할 수 있습니다. `/about/:path`는 `/about/a`와 `/about/b`와 일치하지만 `/about/a/c`와는 일치하지 않습니다.
3. 이름 있는 매개변수에는 수정자(콜론으로 시작함)를 사용할 수 있습니다: `/about/:path*`는 `*`가 *0개 이상*을 의미하기 때문에 `/about/a/b/c`와 일치합니다. `?`는 _0개 또는 1개_, `+`는 *1개 이상*을 의미합니다.
4. 괄호로 둘러싸인 정규식을 사용할 수 있습니다. `/about/(.*)`는 `/about/:path*`와 동일한 의미를 가집니다.

자세한 내용은 [path-to-regexp](https://github.com/pillarjs/path-to-regexp#path-to-regexp-1) 문서를 참조하세요.

> **참고**: 이전 버전과의 호환성을 위해 Next.js는 항상 `/public`을 `/public/index`로 간주합니다. 따라서 `/public/:path`와 같은 matcher는 일치합니다.

### 조건문

```ts
// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/about")) {
    return NextResponse.rewrite(new URL("/about-2", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.rewrite(new URL("/dashboard/user", request.url));
  }
}
```

---

## NextResponse

`NextResponse` API를 사용하면 다음 작업을 수행할 수 있습니다.

- 들어오는 요청을 다른 URL로 `redirect`
- 주어진 URL을 표시하여 응답 `rewrite`
- API 경로, `getServerSideProps`, 및 `rewrite` 대상에 대한 요청 헤더 설정
- 응답 쿠키 설정
- 응답 헤더 설정

미들웨어에서 응답을 생성하려면 다음 중 하나를 수행할 수 있습니다.

1. 응답을 생성하는 경로([Page](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) 또는 [Edge API Route](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)로 `rewrite`합니다.
2. 직접 `NextResponse`를 반환합니다. [응답 생성하기](https://nextjs.org/docs/app/building-your-application/routing/middleware#producing-a-response)를 참조하세요.

---

## 쿠키 사용하기

쿠키는 일반적인 헤더입니다. `Request`에서는 `Cookie` 헤더에 저장되고, `Response`에서는 `Set-Cookie` 헤더에 저장됩니다. Next.js는 `NextRequest`와 `NextResponse`의 `cookies` 확장자를 통해 이러한 쿠키에 쉽게 접근하고 조작할 수 있는 편리한 방법을 제공합니다.

1. 들어오는 요청의 경우 `cookies`에는 `get`, `getAll`, `set`, `delete` 쿠키 메서드가 제공됩니다. `has`로 쿠키의 존재 여부를 확인하거나 `clear`로 모든 쿠키를 제거할 수 있습니다.
2. 나가는 응답의 경우 `cookies`에는 `get`, `getAll`, `set`, `delete` 메서드가 있습니다.

```ts
// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 들어오는 요청에 "Cookie: nextjs=fast" 헤더가 있는 것으로 가정
  // `RequestCookies` API를 사용하여 요청에서 쿠키 가져오기
  let cookie = request.cookies.get("nextjs");
  console.log(cookie); // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll();
  console.log(allCookies); // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has("nextjs"); // => true
  request.cookies.delete("nextjs");
  request.cookies.has("nextjs"); // => false

  // `ResponseCookies` API를 사용하여 응답에 쿠키 설정하기
  const response = NextResponse.next();
  response.cookies.set("vercel", "fast");
  response.cookies.set({
    name: "vercel",
    value: "fast",
    path: "/",
  });
  cookie = response.cookies.get("vercel");
  console.log(cookie); // => { name: 'vercel', value: 'fast', Path: '/' }
  // 나가는 응답에는 `Set-Cookie: vercel=fast; path=/test` 헤더가 포함됨

  return response;
}
```

---

## 헤더 설정하기

`NextResponse` API를 사용하여 요청과 응답 헤더를 설정할 수 있습니다 (요청 헤더 설정은 Next.js v13.0.0 이상에서 사용 가능합니다).

```ts
// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 요청 헤더를 복제하고 새로운 헤더 `x-hello-from-middleware1`를 설정
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-hello-from-middleware1", "hello");

  // NextResponse.rewrite에서도 요청 헤더를 설정할 수 있음
  const response = NextResponse.next({
    request: {
      // 새 요청 헤더
      headers: requestHeaders,
    },
  });

  // 새 응답 헤더 `x-hello-from-middleware2` 설정
  response.headers.set("x-hello-from-middleware2", "hello");
  return response;
}
```

> **참고**: 백엔드 웹 서버 구성에 따라 [431 Request Header Fields Too Large](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431) 오류가 발생할 수 있으므로 큰 헤더를 설정하는 것을 피하십시오.

---

## 응답 생성하기

미들웨어에서는 `Response` 또는 `NextResponse` 인스턴스를 직접 반환하여 응답할 수 있습니다. (이 기능은 [Next.js v13.1.0](https://nextjs.org/blog/next-13-1#nextjs-advanced-middleware)부터 사용 가능합니다)

```ts
// middleware.ts

import { NextRequest } from "next/server";
import { isAuthenticated } from "@lib/auth";

// 미들웨어를 `/api/`로 시작하는 경로로 제한
export const config = {
  matcher: "/api/:function*",
};

export function middleware(request: NextRequest) {
  // 요청을 확인하기 위해 인증 함수를 호출
  if (!isAuthenticated(request)) {
    // 오류 메시지를 나타내는 JSON으로 응답
    return Response.json(
      { success: false, message: "authentication failed" },
      { status: 401 }
    );
  }
}
```

---

## 고급 미들웨어 플래그

Next.js `v13.1`에서는 고급 사용 사례를 처리하기 위해 미들웨어용으로 두 개의 추가 플래그인 `skipMiddlewareUrlNormalize` 및 `skipTrailingSlashRedirect`가 도입되었습니다.

`skipTrailingSlashRedirect`는 Next.js의 기본 리디렉션을 비활성화하는 것을 허용합니다. 이는 뒤에 슬래시를 추가하거나 제거하는 작업에 대한 것으로, 미들웨어 내에서 커스텀 처리를 허용하여 일부 경로에 대해 뒤에 슬래시를 유지하고 다른 경로에는 뒤에 슬래시를 유지하지 않도록 할 수 있으며, 이를 통해 점진적인 마이그레이션을 더 쉽게 수행할 수 있게 합니다.

```js
// next.config.js

module.exports = {
  skipTrailingSlashRedirect: true,
};
```

```js
// middleware.js

const legacyPrefixes = ["/docs", "/blog"];

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // trailing slash 처리 적용
  if (
    !pathname.endsWith("/") &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
  ) {
    req.nextUrl.pathname += "/";
    return NextResponse.redirect(req.nextUrl);
  }
}
```

`skipMiddlewareUrlNormalize`은 Next.js에서 직접 방문과 클라이언트 전환을 처리하기 위해 수행하는 URL 정규화를 비활성화하는 기능입니다. 이를 통해 원래의 URL을 사용하여 완전한 제어가 필요한 고급 상황이 있는 경우 이를 가능하게 합니다.

```js
// next.config.js

module.exports = {
  skipMiddlewareUrlNormalize: true,
};
```

```js
// middleware.js

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  // GET /_next/data/build-id/hello.json

  console.log(pathname);
  // 플래그가 있으면 /_next/data/build-id/hello.json
  // 플래그가 없으면 /hello로 정규화됨
}
```

---

## 버전 기록

| 버전      | 변경 내용                                                                                           |
| --------- | --------------------------------------------------------------------------------------------------- |
| `v13.1.0` | 고급 미들웨어 플래그 추가                                                                           |
| `v13.0.0` | 미들웨어에서 요청 헤더, 응답 헤더를 수정하고 응답을 전송할 수 있도록 함                             |
| `v12.2.0` | 미들웨어가 안정화되었으며 [업그레이드 가이드](/docs/messages/middleware-upgrade-guide)를 참조하세요 |
| `v12.0.9` | Edge Runtime에서 절대 URL 강제 적용 ([PR](https://github.com/vercel/next.js/pull/33410))            |
| `v12.0.0` | 미들웨어 (Beta) 추가                                                                                |
