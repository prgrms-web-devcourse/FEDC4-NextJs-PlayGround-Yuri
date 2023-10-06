# 국제화

Next.js를 사용하면 여러 언어를 지원하도록 콘텐츠의 라우팅 및 렌더링을 구성할 수 있습니다. 사이트를 다양한 로케일에 맞게 조정하려면 번역된 콘텐츠(현지화) 및 국제화된 경로가 포함됩니다.

---

## 술어

- 로케일: 언어 및 형식 기본 설정 세트에 대한 식별자입니다. 여기에는 일반적으로 사용자가 선호하는 언어와 해당 지역이 포함됩니다.
  - `en-US`: 미국에서 사용되는 영어
  - `nl-NL`: 네덜란드에서 사용되는 네덜란드어
  - `nl`: 네덜란드어, 특정 지역 없음

---

## 라우팅 개요

사용할 로케일을 선택하려면 브라우저에서 사용자의 언어 기본 설정을 사용하는 것이 좋습니다. 기본 언어를 변경하면 애플리케이션에 대한 수신 `Accept-Language` 헤더가 수정됩니다.

```js
// middleware.js

import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let headers = { "accept-language": "en-US,en;q=0.5" };
let languages = new Negotiator({ headers }).languages();
let locales = ["en-US", "nl-NL", "nl"];
let defaultLocale = "en-US";

match(languages, locales, defaultLocale); // -> 'en-US'
```

라우팅은 하위 경로(`/fr/products`) 또는 도메인(`my-site.fr/products`)을 통해 국제화될 수 있습니다. 이제 이 정보를 사용하여 [미들웨어](https://nextjs.org/docs/app/building-your-application/routing/middleware) 내부의 로케일을 기반으로 사용자를 리디렉션할 수 있습니다.

```js
// middleware.js


let locales = ['en-US', 'nl-NL', 'nl']

// Get the preferred locale, similar to the above or using a library
function getLocale(request) { ... }

export function middleware(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return Response.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}
```

마지막으로 `app/` 내부의 모든 특수 파일이 `app/[lang]` 아래에 중첩되어 있는지 확인하세요. 이를 통해 Next.js 라우터는 경로의 다양한 로케일을 동적으로 처리하고 `lang` 매개변수를 모든 레이아웃과 페이지에 전달할 수 있습니다. 예를 들어:

```js
// app/[lang]/page.js

// You now have access to the current locale
// e.g. /en-US/products -> `lang` is "en-US"
export default async function Page({ params: { lang } }) {
  return ...
}
```

루트 레이아웃은 새 폴더(예: `app/[lang]/layout.js`)에 중첩될 수도 있습니다.

---

## 현지화

사용자가 선호하는 로케일 또는 현지화를 기반으로 표시되는 콘텐츠를 변경하는 것은 Next.js에만 국한된 것이 아닙니다. 아래 설명된 패턴은 모든 웹 애플리케이션에서 동일하게 작동합니다.

애플리케이션 내에서 영어와 네덜란드어 콘텐츠를 모두 지원한다고 가정해 보겠습니다. 우리는 일부 키에서 현지화된 문자열로의 매핑을 제공하는 객체인 두 개의 서로 다른 "사전"을 유지할 수 있습니다. 예를 들어:

```json
// dictionaries/en.json

{
  "products": {
    "cart": "Add to Cart"
  }
}
```

```json
// dictionaries/nl.json

{
  "products": {
    "cart": "Toevoegen aan Winkelwagen"
  }
}
```

그런 다음 요청된 로캐일에 대한 번역을 로드하는 `getDictionary` 함수를 만들 수 있습니다.

```js
// app/[lang]/dictionaries.js

import "server-only";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  nl: () => import("./dictionaries/nl.json").then((module) => module.default),
};

export const getDictionary = async (locale) => dictionaries[locale]();
```

현재 선택된 언어가 주어지면 레이아웃이나 페이지 내부에서 사전을 가져올 수 있습니다.

```js
// app/[lang]/page.js

import { getDictionary } from "./dictionaries";

export default async function Page({ params: { lang } }) {
  const dict = await getDictionary(lang); // en
  return <button>{dict.products.cart}</button>; // Add to Cart
}
```

`app/` 디렉터리의 모든 레이아웃과 페이지는 기본적으로 [서버 컴포넌트](https://nextjs.org/docs/app/building-your-application/rendering/server-components)로 설정되므로 클라이언트측 JavaScript 번들 크기에 영향을 미치는 번역 파일의 크기에 대해 걱정할 필요가 없습니다. 이 코드는 서버에서만 실행되며 결과 HTML만 브라우저로 전송됩니다.

---

## 정적 생성

특정 로케일 세트에 대한 정적 경로를 생성하려면 페이지나 레이아웃에 `generateStaticParams`를 사용할 수 있습니다. 예를 들어 루트 레이아웃에서는 전역적일 수 있습니다.

```js
// app/[lang]/layout.js

export async function generateStaticParams() {
  return [{ lang: "en-US" }, { lang: "de" }];
}

export default function Root({ children, params }) {
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 자원

- [최소한의 i18n 라우팅 및 변환](https://github.com/vercel/next.js/tree/canary/examples/app-dir-i18n-routing)
- [`next-intl`](https://next-intl-docs.vercel.app/docs/next-13)
- [`next-international`](https://github.com/QuiiBz/next-international)
- [`next-i18n-router`](https://github.com/i18nexus/next-i18n-router)

---
