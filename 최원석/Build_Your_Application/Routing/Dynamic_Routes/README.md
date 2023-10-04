# 동적 경로

정확한 세그먼트 이름을 미리 모르고 동적 데이터에서 경로를 생성하려는 경우 요청 시 채워지거나 빌드 시 [prerendered](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params)되는 동적 세그먼트를 사용할 수 있습니다.

---

## 협약 (Conversation)

동적 세그먼트는 폴더 이름을 대괄호(`[folderName]`)로 묶어 생성할 수 있습니다. 예를 들어 `[id]` 또는 `[slug]`입니다.

동적 세그먼트는 [`layout`](https://nextjs.org/docs/app/api-reference/file-conventions/layout), [`page`](https://nextjs.org/docs/app/api-reference/file-conventions/page) , [`route`](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) 및 [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function) 함수에 `params` prop으로 전달됩니다.

---

## 예시

예를 들어 블로그에는 `app/blog/[slug]/page.js` 경로가 포함될 수 있습니다. 여기서 `[slug]`는 블로그 게시물의 동적 세그먼트입니다.

```tsx
// app/blog/[slug]/page.tsx

export default function Page({ params }: { params: { slug: string } }) {
  return <div>My Post: {params.slug}</div>;
}
```

| 경로                      | 예시      | URL 매개변수    |
| ------------------------- | --------- | --------------- |
| `app/blog/[slug]/page.js` | `/blog/a` | `{ slug: 'a' }` |
| `app/blog/[slug]/page.js` | `/blog/b` | `{ slug: 'b' }` |
| `app/blog/[slug]/page.js` | `/blog/c` | `{ slug: 'c' }` |

세그먼트에 대한 매개변수를 생성하는 방법을 알라보려면[`generateStaticParams()`](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params) 페이지를 참조하세요.

> 알아두면 좋은 점: 동적 세그먼트는 `page` 디렉토리의 [동적 경로](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)와 동일합니다.

---

### 정적 매개변수 생성

`generateStaticParams` 함수를 동적 경로 세그먼트와 함께 사용하면 요청 시 주문형이 아닌 빌드 시 경로를 정적으로 생성할 수 있습니다.

```tsx
// app/blog/[slug]/page.tsx

export async function generateStaticParams() {
  const posts = await fetch("https://.../posts").then((res) => res.json());

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

`generateStaticParams` 함수의 주요 이점은 스마트한 데이터 검색입니다. 가져오기 요청을 사용하여 `generateStaticParams` 함수 내에서 콘텐츠를 가져오는 경우 요청이 [자동으로 메모](https://nextjs.org/docs/app/building-your-application/caching#request-memoization)됩니다.
이는 여러 `generateStaticParams`, `Layouts` 및 `Pages`에 걸쳐 동일한 인수를 사용하는 가져오기 요청이 한 번만 수행되므로 빌드 시간이 단축된다는 의미입니다.

`pages` 디렉토리에서 마이그레이션하는 경우 [마이그레이션 가이드](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#dynamic-paths-getstaticpaths)를 사용하세요.

자세한 내용과 고급 사용 사례는 [`generateStaticParams` 서버 함수 설명서](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)를 참조하세요.

---

### Catch-all 세그먼트

대괄호 `[...folderName]` 안에 줄임표를 추가하면 동적 세그먼트를 모든 후속 세그먼트로 확장할 수 있습니다.

예를 들어 `app/shop/[...slug]/page.js`는 `/shop/clothes`와 일치하지만 `/shop/clothes/tops`, `/shop/clothes/tops/t-shirts` 등과도 일치합니다.

| 경로                         | 예시          | URL 매개변수                |
| ---------------------------- | ------------- | --------------------------- |
| `app/shop/[...slug]/page.js` | `/shop/a`     | `{ slug: 'a' }`             |
| `app/shop/[...slug]/page.js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `app/shop/[...slug]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

---

### 선택적 Catch-all 세그먼트

이중 대괄호 안에 매개변수(`[[...folderName]]`)를 포함하면 포괄 세그먼트를 선택적으로 만들 수 있습니다.

예를 들어 `app/shop/[[...slug]]/page.js`는 `/shop/clothes`, `/shop/clothes/tops`, `/shop/clothes/tops/t-shirts` 외에도 `/shop`과도 일치합니다.

catch-all 세그먼트와 선택적 catch-all 세그먼트의 차이점은 선택 사항을 사용하면 매개변수가 없는 경로도 일치한다는 것입니다(위 예에서는 `/shop`).

| 경로                           | 예시          | URL 매개변수                |
| ------------------------------ | ------------- | --------------------------- |
| `app/shop/[[...slug]]/page.js` | `/shop`       | `{}`                        |
| `app/shop/[[...slug]]/page.js` | `/shop/a`     | `{ slug: 'a' }`             |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

---

### TypeScript

TypeScript를 사용할 때 구성된 경로 세그먼트에 따라 `params` 유형을 추가할 수 있습니다.

```tsx
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>My Page</h1>;
}
```

| Route                               | `params` Type Definition                 |
| ----------------------------------- | ---------------------------------------- |
| `app/blog/[slug]/page.js`           | `{ slug: string }`                       |
| `app/shop/[...slug]/page.js`        | `{ slug: string[] }`                     |
| `app/[categoryId]/[itemId]/page.js` | `{ categoryId: string, itemId: string }` |

> 알아두면 좋은 점: 이 작업은 향후 TypeScript 플러그인에 의해 자동으로 수행될 수 있습니다.
