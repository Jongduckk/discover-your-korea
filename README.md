# Discover Your Seoul

IGB 팝업 부스를 위한 영어 기반 모바일 여행 취향 퀴즈. React + TypeScript + Vite로 구현한 정적 웹앱이며 서버, 회원가입, API 키가 필요하지 않습니다.

## 실행

```sh
npm install
npm run dev
```

개발 서버의 Local 주소를 브라우저에서 엽니다. 같은 네트워크의 휴대폰에서는 출력된 Network 주소를 사용합니다.

```sh
npm test
npm run build
npm run preview
```

`dist/`를 정적 호스팅에 배포하면 됩니다. 상대 경로 빌드로 하위 디렉터리 배포도 지원합니다. 실제 부스 사용을 위한 공개 HTTPS 배포와 확정 URL의 QR코드 제작은 별도로 진행해야 합니다.

## GitHub Pages 배포

`.github/workflows/deploy.yml`을 추가했습니다. `main`에 push하면 Node.js 22에서 의존성 설치 → 테스트 → 빌드 → `dist/` 배포가 자동 실행됩니다. 생성된 캐릭터·사진 파일은 `public/`에 함께 커밋하므로 배포 중 외부 사진 다운로드나 에셋 재생성이 필요하지 않습니다.

1. [저장소 Pages 설정](https://github.com/Jongduckk/discover-your-korea/settings/pages)을 열고 **Build and deployment → Source → GitHub Actions**를 선택합니다.
2. 프로젝트 폴더에서 변경 파일을 커밋하고 올립니다.

   ```powershell
   cd discover-your-korea
   git status --short
   git add .
   git commit -m "Build Discover Your Seoul and configure GitHub Pages"
   git push origin main
   ```

3. [Actions](https://github.com/Jongduckk/discover-your-korea/actions)에서 **Deploy to GitHub Pages** 실행을 열어 `build`, `deploy`가 모두 성공했는지 확인합니다. 첫 실행 전에 코드를 올렸다면 Pages 설정을 마친 뒤 해당 워크플로의 **Run workflow**를 누릅니다.
4. 성공한 배포의 URL을 열고, 스마트폰에서 퀴즈와 사진을 확인한 후 해당 URL로 부스 QR을 만듭니다.

예상 배포 URL: **https://jongduckk.github.io/discover-your-korea/**. 실제 배포 완료 여부와 최종 주소는 Actions의 배포 결과 또는 Settings → Pages에서 확인합니다. 이후 수정도 커밋하고 `main`에 push하면 같은 주소로 배포됩니다.

공식 문서: [Vite GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages), [GitHub Pages 워크플로](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

프로젝트 폴더 안에서 터미널을 열었다면 `cd`는 생략합니다. 커밋 전 `git status --short`로 파일 목록을 확인하세요. 내부 기획 문서(`prd.md`, `booth_proposal.md`, `purpose.md`), 환경 파일, 개인 키, 캐시와 로컬 편집기 설정은 `.gitignore`로 제외합니다. 내부 문서는 삭제하지 않고 로컬에 보관합니다. 사진별 `CREDITS.md`와 `sources.json`, `THIRD_PARTY_NOTICES.txt`는 공개 배포에 필요한 고지이므로 함께 포함합니다.

## 구현

- 환영 → 5개 질문 → 4.5초 배정식(첫 멘트 1.5초, 나머지 각 1초) → 5개 권역별 결과
- PRD의 20개 점수 매핑, Q5→Q1 우선 동점 처리
- 200ms 선택 피드백, 이전 답변 수정, 중복 터치 방지
- Session Storage 진행·결과 복원, 손상된 데이터의 재시작 안내
- 원본 캐릭터의 9가지 표정, 투명 배경과 원본 비율 유지
- 남색·금색, 한지 카드, 한국 전통 구름·지붕에서 영감을 받은 SVG
- 320px부터 반응형, 44px 이상 터치 영역, 키보드 포커스, 모션 감소 지원
- 외부 이미지·폰트·분석 도구·추천 API 요청 없이 작동

## 콘텐츠 수정

`src/content.ts`에서 질문, 점수 매핑, 여행지 콘텐츠, Visit Seoul 링크, 캐릭터 매핑과 기관 설정을 관리합니다.

### TODO — 운영 자료 확정 후

- **공식 IGB 로고:** `public/assets/branding/`에 제공받은 공식 파일을 두고 `siteConfig.logo`에 경로 입력. 현재는 기관명 텍스트만 표시하며 임의의 로고는 만들지 않습니다.
- **K-Culture Lecture:** 확정된 안내 URL을 `siteConfig.lectureUrl`에 입력. 현재 “Details Coming Soon”과 비활성 버튼을 표시합니다.
- **공개 HTTPS 배포 / QR:** 배포 URL 확정 후 실제 부스 QR 생성 및 현장 네트워크 확인.
- **실기기 QA:** iPhone Safari, Android Chrome, iPad에서 터치·회전·복원 동작 확인.

## 에셋과 사용 권한

캐릭터는 사용자가 제공한 `image.png`를 사용합니다. 재생성하거나 디자인을 수정하지 않았습니다. 원본을 `public/assets/characters/original-character-sheet.png`에도 보관합니다. 원본 파일은 브라우저가 다운로드하지 않습니다.

```sh
npm run prepare:assets
```

준비 스크립트는 3×3 셀을 기준으로 눈에 보이는 연결된 형태를 분리한 뒤 옅은 가장자리 픽셀을 가장 가까운 형태에 배분합니다. 캐릭터 사이의 반투명 픽셀 때문에 두 표정이 하나로 합쳐지는 것을 방지하면서 원본의 모든 비투명 픽셀과 소품을 유지합니다. 각각 무손실 WebP로 저장하며 경계 정보는 `manifest.json`에 남깁니다. 원본 `image.png`를 교체하면 `npm run prepare:assets`로 9종을 갱신한 뒤 `npm run build`로 배포용 파일을 다시 생성하세요.

결과의 **Your magical destinations** 카드 15개에는 Wikimedia Commons의 사진별 재사용 라이선스를 확인한 사진을 사용합니다. CC0, CC BY, CC BY-SA 조건을 따르며 저작자, 원본 페이지, 개별 라이선스, 리사이즈·WebP 변환·화면 크롭 사실을 각 결과 화면의 **Photo credits**에 표시합니다. 사진은 로컬 파일로 제공하고 480px/960px 반응형 이미지와 지연 로딩을 사용합니다. 사진 로딩 실패 시 기존 SVG가 대체 표시됩니다. 환영 화면과 결과 상단의 지역 일러스트는 유지합니다.

- `scripts/photo-sources.mjs`: 명소별 원본 파일 선정과 대체 텍스트, 크롭 위치, 주변 풍경 표시
- `src/photo-manifest.json`: UI가 사용하는 경로·저작자·라이선스 설정
- `public/assets/destinations/CREDITS.md`: 15장 전체의 출처와 변경 사항
- `public/assets/destinations/sources.json`: Commons에서 조회한 개별 라이선스 원본 메타데이터와 파일 해시
- `public/THIRD_PARTY_NOTICES.txt`: 배포 JS에 포함된 React, React DOM, Scheduler의 저작권과 MIT 라이선스 전문

사진의 CC BY-SA 조건은 해당 사진 및 사진의 가공본에 적용되며, 각 파일은 명시된 원본과 같은 라이선스로 배포합니다. 크레딧과 라이선스 고지는 사진과 함께 유지하세요. 성수연방은 사용자의 선택에 따라 성수동 주변 사진을 사용하고 **Seongsu neighborhood · area photo**라고 표시합니다. 홍대 프리마켓 사진은 홍익어린이공원 주변 시장 풍경임을 별도로 표시합니다. 사진은 촬영 당시 모습이며 현재 행사 운영이나 상점 입점을 보장하는 자료가 아닙니다.

명동과 홍대 버스킹 카드에는 특정 인물의 클로즈업 대신 거리·간판 중심 사진을 사용합니다. 홍대 버스킹 카드는 **Hongdae neighborhood · area photo**로 주변 풍경임을 표시합니다. 촬영자의 저작권 라이선스와 사진 속 인물의 초상 관련 권리는 별개이므로, 사진을 교체할 때도 인물의 얼굴이 크게 나온 홍보용 사진을 피합니다.

```sh
npm run prepare:notices
```

이 명령은 설치된 런타임 라이브러리의 LICENSE를 읽어 `public/THIRD_PARTY_NOTICES.txt`를 생성합니다. 일반 빌드에서도 자동 실행되므로 라이브러리 업데이트 후 고지를 함께 갱신할 수 있습니다. 이 고지는 외부 라이브러리에만 적용되며 프로젝트 자체나 사진·캐릭터에 새 라이선스를 부여하지 않습니다.

```sh
npm run prepare:photos
```

위 명령은 Commons에서 원본 라이선스와 저작자를 다시 검증하고 WebP 2종, UI 매니페스트, 크레딧 파일을 생성합니다. 다운로드 캐시는 `.qa/destination-originals/`에 두며 일반 빌드·실행은 외부 사진 서비스에 요청하지 않습니다.

공식 관광정보 링크 10개는 2026-10-16 Visit Seoul 실제 페이지 응답을 확인했습니다. 외부 링크는 새 탭으로 열며 `noopener noreferrer`를 적용합니다.

추천 결과와 응답은 현재 탭의 Session Storage에만 보관합니다. 재시작하면 초기화되며 서버로 전송하지 않습니다. 브라우저가 저장소 접근을 차단해도 퀴즈는 진행됩니다.

## 검증 범위

`npm test`는 PRD 점수표와 1,024개 전체 답변 조합의 추천·동점 처리, 답변 변경, 잘못된 응답, 새로고침 복원을 검증합니다. jsdom에서 React 전체 화면 흐름, 연속 터치 방지, 이전 답변 선택 표시, 배정식, 결과, 재시작, 저장소 차단 상황도 확인합니다. `npm run build`는 TypeScript 검증과 운영용 번들 생성을 수행합니다.

검증 결과: 테스트 10개 통과, 운영 빌드 성공, 로컬 서버 HTML·캐릭터 파일 HTTP 200, 캐릭터 9종 분리 이미지 육안 확인, 설치 시 보안 점검 0건. 연결 가능한 브라우저가 없는 환경이므로 실제 브라우저의 320–1024px 레이아웃·가로 넘침 및 iOS/Android 실기기 동작은 미검증입니다. jsdom 테스트는 화면 배치 검증을 대신하지 않습니다.
