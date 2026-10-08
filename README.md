# JeongKeepsCalm

Astro 정적 블로그. 공개 주소는 `https://ojggg.github.io` 이다.

## 로컬

```bash
npm install
npm run dev
npm run build
```

## 검색 등록

사이트가 배포된 뒤 사이트맵 `https://ojggg.github.io/sitemap-index.xml` 을 제출한다.

1. Google Search Console에서 속성을 추가하고 HTML 태그 인증 값을 `src/layouts/Base.astro` 의 `google-site-verification` 자리에 넣는다.
2. 네이버 서치어드바이저에서 사이트를 등록하고 인증 값을 `naver-site-verification` 자리에 넣는다.
3. 두 도구 모두 사이트맵 URL을 제출한 뒤 수집을 요청한다.

인증 토큰은 저장소에 빈 자리만 두었다. 받은 값만 채운다.
