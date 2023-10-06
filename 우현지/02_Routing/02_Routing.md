## 1-8. Parallel Routes 병렬 라우팅

> 동일한 레이아웃에서 하나 이상의 페이지를 동시에 또는 조건부로 렌더링 할 수 있다.

- 병렬 라우팅을 사용하면 경로가 독립적으로 스트리밍 될 때 각 경로에 대해 독립적인 오류 및 로드 상태를 정의 할 수 있다.
- 동일한 url에서 완전히 분리된 코드를 사용할 수 있다.

### convention

- 슬롯은 @folder 컨벤션으로 정의된다.
- 같은 레벨의 레이아웃에 props로 전달된다.
- 슬롯은 라우트 세그먼트가 아니며, URL 구조에 영향을 주지 않는다.

기본적으로 슬롯 내에서 렌더링되는 콘테츠는 현재 URL과 일치한다.

일치하지 않는 슬롯의 경우, 콘텐츠는 Next.js 가 렌더링하는 라우팅 기술 및 폴더 구조에 따라 다르다.

### default.js

- 현재 URL을 기반으로 슬롯의 활성 상태를 복구할 수 없을 때 Next.js가 대체로 렌더링할 default.js 파일을 정의할 수 있다

### **useSelectedLayoutSegment(s)**

- useSelectedLayoutSegment과 useSelectedLayoutSegments 모두 parallelRoutesKey를 받아들여 해당 슬롯 내에서 활성 라우트 세그먼트를 읽을 수 있도록 한다.

## 1-9. Intercepting Routes 라우트 가로채기

> 라우트 가로채기는 현재 레이아웃 안에서 라우를 로드하면서 현재 페이지의 컨텍스트를 유지할 수 있게 해준다. 이러한 라우팅 패러다임은 특정 경로를 ‘가로채서’ 다른 경로를 표시하고 싶을 때 유용하다.

### Convention

- 라우트 가로채기는 (…) 구문을 사용한다.
  - `(.)` : 동일한 수준의 세그먼트와 일치
  - `(..)`: 한 수준 위의 세그먼트와 일치
  - `(..)(..)` : 두 수준 위의 세그먼트와 일치
  - `(...)` : 루트 앱 디렉토리부터의 세그먼트와 일치

## 1-10. Route Handlers

> 라우트 핸들러를 사용하면 웹 요청 및 응답 API를 사용하여 지정된 경로에 대한 custom request handler를 만들 수 있다.

- 라우터 핸들러는 app 디렉토리 내에서만 사용할 수 있다.
  pages 디렉토리 내의 API 라우터와 동일한 역할을 담당하기 때문에 API 라우트와 라우트 핸들러를 함꼐 사용할 필요가 없다는 것을 의미한다.

### Convention

- 라우트 핸들러는 앱 디렉토리 내의 routes.js(ts) 파일에 정의된다
  ```tsx
  // app/api/route.ts
  export async function GET(request: Request) {}
  ```
- 라우트 핸들러는 page.js 및 layout.js와 유사하게 앱 디렉터리 내에서 중첩될 수 있다. 그러나 page.js와 동일한 라우트 세그먼트 수준에 route.js 파일이 존재할 수는 없다.

### **Supported HTTP Methods**

- GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS 지원된다.
  지원되지 않는 메서드를 호출하면 Next.js 는 405 Method Not Allowed 응답을 반환한다.

**Static Route Handlers**

GET 메서드와 Response 객체를 사용할 때, 라우트 핸들러는 기본적으로 정적으로 평가된다.

\***\*Dynamic Route Handlers\*\***

라우트 핸들러는 다음과 같은 경우에 동적으로 평가된다.

- GET 메서드를 사용하여 Request 객체를 사용할 때.
- 다른 HTTP 메서드를 사용할 때.
- 쿠키와 헤더와 같은 동적 함수를 사용할 때.
- Segment Config 옵션에서 동적 모드를 수동으로 지정할 때.
