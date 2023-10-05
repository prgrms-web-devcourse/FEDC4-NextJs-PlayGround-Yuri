# 1. Routing(~Error Handling)

## 1-1. Defining Routes

### Creating Routes

- Next.js는 폴더를 사용하여 경로를 정의하는 파일 시스템 기반 라우터를 사용한다.
  - 경로 세그먼트를 공개적으로 엑세스 할 수 있도록 하려면 특수 `page.js` 파일이 사용된다.

### Creating UI

- 각 경로 세그먼트에 대한 UI를 생성하는 데 특수 파일 규칙이 사용된다. 가장 일반적인 것은 경로에 고유한 UI를 표시하는 페이지와 여러 경로에서 공유되는 UI를 표시하는 레이아웃 이다.
- 예를 들어 첫페이지를 만들려면 app디렉토리 안에 page.js를 만들어서 React component를 내보내기 한다.
  ```jsx
  //app/page.tsx
  export default function Page(){
      return <h1>Hello, Next.js!<h1>
  }
  ```

## 1-2. Page and Layouts

> Next.js 13에서는 App Router에는 pages, shared layouts, templates를 쉽게 생성할 수 있는 새로운 파일 규칙이 도입되었다.

### Pages (pages.js)

- 페이지는 경로에 대한 고유한 UI 이다.
- `.js` , `.jsx`, `.tsx` 파일 확장자를 사용할 수 있다.
- pages는 기본적은 Server Componet이지만 Client Componet로 설정할 수 있다.
- pages는 데이터를 fetch 할수 있다.

### Layouts

- 레이아웃은 멀티페이지 사이에서 공유되는 UI 이다. (공통컴포넌트?)
- index, footer 등 여러 페이지에서 동일하게 나타내는 화면 값

**Root Layout(Required)**

- Root Layout은 app 디렉토리의 최상위에서 정의되고 모든 라우트에 제공된다.
- Root Layout은 초기HTML을 수정하게 하고 서버로부터 받는다.
  - app 디렉토리는 root layout을 반드시 가지고 있어야한다.
  - root layout은 `<html/>`, `<body/>` 태그를 꼭 작성해야한다.
  - 내장된 SEO support를 사용하여 head 태그를 다룰 수 있다.
  - route 그룹을 사용하여 멀티 루트레이아웃을 생성할 수 있다.
  - 루트레이아웃은 기본값으로 Server Component 이고, Client Component로 설정할 수 없다.
  - [ ] 루트레이아웃은 `_app.js` 와 `_document.js` 를 대체한다. → [View the migration guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

**Nesting Layouts**

- 레이아웃은 특정 경로 세그먼트를 제공하기 위해서는 폴더 내에 정의한다.
- 레이아웃은 특정 경로 세그먼트가 활성화 될 때 렌더링 된다.
- 기본적으로 파일 계층 구조의 레이아웃은 중첩되어 있다. 즉 children prop을 통해 하위 레이아웃을 래핑한다.
- 루트 레이아웃에만 <html>, <body> 태그가 포함된다.

### Templates

- 템플릿은 각 하위 레이아웃이나 페이지를 래핑한다는 점에서 레이아웃과 유사하다. 경로 전반에 걸쳐 지속되고 상태를 유지하는 레이아웃과 달리 템플릿은 탐색 시 각 하위 항목에 대해 새 인스턴스를 만든다. 이는 사용자가 템플릿을 공유하는 경로 사이를 탐색할 때 구성요소의 새 인스턴스가 마운트되고 DOM요소가 다시 생성되며 상태가 유지되지 않고 효과가 다시 동기화된다는 것을 의미한다.
  - `useEffect` 및 `useState` 에 의존하는 기능이다.

## 1-3. Linking and Navigating

> Next.js에서 라우트 사이의 네비게이트가 2가지 방법이 있다.
>
> 1. <Link> 컴포넌트
> 2. useRouter 훅

### Link Component

- Link 컴포넌트는 HTML 태그 중 a 태그를 확장한 내장된 컴포넌트이다.
- `next/link` 로부터 import 해서 사용할 수 있고, `href` prop에 컴포넌트를 전달한다.

  ```jsx
  import Link from 'next/link'

  export default function Page(){
  	return <Link href="/dashboard">Dashboard</Link>
  ```

**Linking to Dynamic Segments**

dynamic segments에 연결하고 싶으면, 템플릿리털럴과 interpolation을 사용한다.

```jsx
import Link from "next/link";

export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

**Checking Active Links**

usePathname() 을 사용하여 link 가 활성상태인지 확인하는데 사용할 수 있다.

예를 들어, active link에 클래스명을 추가하고, 현재 pathname 과 link의 href 와 매치하여 체크할 수 있다.

```jsx
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Links() {
  const pathname = usePathname();

  return (
    <nav>
      <ul>
        <li>
          <Link className={`link ${pathname === "/" ? "active" : ""}`} href="/">
            Home
          </Link>
        </li>
        <li>
          <Link
            className={`link ${pathname === "/about" ? "active" : ""}`}
            href="/about"
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
```

**Scrolling to an `id`**

**Disabling scroll restoration**

### useRouter() Hook

- useRouter 훅은 클라이언트 컴포넌트 안에서만 사용될 수 있고, `next/navigation` 에서 import 한다.

  ```jsx
  import {useRouter} from 'next/navigation'

  export default function Page() {
  	const router = useRouter()

  	return (
  		<button onClick={()=> router.push('/dashboard')}>
  			Dashboard
  		</button>
  ```

### How Routing and Navigation Works

앱 라우터는 라우팅 및 탐색을 위해 하이브리드 접근 방식을 사용한다. 서버에서 애플리케이션 코드는 경로 세그먼트별로 자동으로 코드를 분할한다. 클라이언트에서 Next.js는 route segments를 미리가져오고 캐시한다.

사용자가 새로운 경로로 이동할때, 브라우저는 페이지를 재로드하지 않는다.

**1. Prefetching**

prefetching는 사용자가 경로를 방문하기 전에 백그라운드에서 경로를 미리 로드하는 방법이다.

Next.js에서 경로를 미리 가져오는 방법에는 두 가지가 있다.

- <Link> component : 경로가 사용자의 뷰포트에 표시되면 자동으로 미리 가져온다. 프리패치는 페이지가 처음으로 로드될 때 또는 스크롤을 통해 표시될때 발생한다.
    - 정적경로: prefetching 의 기본값이다. 전체경로가 prefetching 되고 캐시된다
    - 동적경로:
- router.prefetch(): useRouter 훅을 사용하여 경로를 미리 가져올 수 있다.

**2. Caching**

Next.js에는 라우터 캐시라는 메모리 내 클라이언트 측 캐시가 있다. 사용자가 앱을 탐색할 때 미리 가져온 route segements와 방문한 route의 React Server 구성 요소 페이로드가 캐시에 저장된다.

**3. Partial Rendering**

**4. Soft Navigation**

**5. Back and Forward Navigation**

## 1-4. Route Groups

> 앱 폴더안에서 중첩된 폴더들은 보통 URL path에 매핑된다. 폴더가 URL path에 포함되지 않도록 폴더를 Route Groups으로 표시할 수 있다

**Route Groups are useful for:**

- 경로를 그룹으로 구성한다. site section, intent, or team 으로..
- 같은 경로 구간 수준에서 중첩 레이아웃을 활성화한다.
  - 여러 루트 레이아웃을 포함하여 동일한 세그먼트에 여러 중첩 레이아웃 만들기
  - 공통 구간의 경로 하위 집합에 레이아웃 추가

### Convention

- 경로그룹은 폴더이름을 괄호로 묶어 생성할 수 있다. ⇒ (folderName)

### Examples

**Organize routes without affecting the URL path**

url에 영향을 주지 않는 routes을 구성하기 위해서 연관된 route을 함께 그룹으로 만든다. 괄호로 감싸진 폴더는 url에 생략된다.

**Opting specific segments into a layout**

**Creating multiple root layouts**

## 1-5. Dynamic Routes

> 정확한 segments 이름을 모르고 동적 데이터에서 경로를 생성하려는 경우 미리 렌더링 되는 동적 세그머트를 사용 할 수 있다.

### Convention

- Dynamic segments 는 폴더이름을 `대괄호`로 묶어 생성할 수 있다.
- Dynamic segments는 `layout`, `page`, `route`, `generateMetadata` 함수에 param으로 전달될 수 있다.

### Generating Static Params

### Catch-all Segments

대괄호 안에 줄임표를 추가하면 동적 세그먼트를 모든 후속 세그먼트로 확장할 수 있다. ⇒ […folderName]

### Optional Catch-all Segments

이중 대괄호 안에 매개변수를 포함하여 포괄 세그먼트를 선택사항으로 만들 수 있다. ⇒ [[…folderName]]

- Catch-all Segements와 Optional Catch-all Segments의 차이점은 Optional Catch-all Segements를 사용하면 매개변수가 없는 경로도 일치한다는 것이다.

## 1-6. Loading UI and Streaming

> `loading.js` 파일은 `React Suspense` 를 사용하여 의미있느 로딩UI를 만든다.
> route segments의 콘텐츠가 로드되는 동안 서버에서 즉시 로드 상태를 표시할 수 있다.
> 렌더링이 완료되면 새 콘텐츠가 자동으로 교체된다.

### Instant Loading States

- 즉시로딩상태는 탐색시 즉시 표시되는 대체UI이다. (skeletons, spinners, …)
- 폴더안에 `loading.js` 파일을 추가하면 로딩상태를 만들 수 있다.

  ```tsx
  /app/aabddhors / loading.tsx;

  export default function Loading() {
    return <LoadingSkeleton />;
  }
  ```

## 1-7. Error Handling

> `error.js` 파일은 중첩된 경로내에서 예상치못한 런타임 에러를 적절하게 처리할 수 있다.

### How `error.js` Works

- `error.js` 는 자동적으로 중첩된 하위 세그먼트 또는 `page.js`컴포넌트를 래핑하는`React Error Boundary` 을 생성한다.
