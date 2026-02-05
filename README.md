# My Money Log 💰

Vue 3 + Vite + Pinia를 사용한 가계부 애플리케이션

## 🎨 디자인 색상

- **Main**: `#E6E6FA` (라벤더)
- **Sub**: `#AAF0D1` (민트)
- **Income**: `#87CEEB` (스카이 블루)
- **Expense**: `#FFB6C1` (핑크)
- **Text**: `#2F4F4F` (다크 슬레이트 그레이)
- **Card**: `#FFFFFF` (화이트)

## 🚀 시작하기

### 개발 서버 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

## ✨ 주요 기능

### 인증
- ✅ 회원가입 (아이디, 별명, 비밀번호)
- ✅ 로그인 (아이디 저장 기능)
- ✅ 플로팅 라벨 입력란
- ✅ 세션 관리

### 대시보드
- ✅ 월별 캘린더 뷰
- ✅ 수입/지출 표시 (색상 구분)
- ✅ 계정 관리 패널 (농협, 신한, 농협)
- ✅ 사이드바 메뉴

### 데이터 관리
- ✅ Pinia 스토어로 상태 관리
- ✅ localStorage로 데이터 지속성
- ✅ 더미 데이터 자동 생성

## 📁 프로젝트 구조

```
moneylog/
├── src/
│   ├── assets/
│   │   ├── styles/          # SCSS 변수, 믹스인, 전역 스타일
│   │   └── images/          # 로고 등 이미지 파일
│   ├── components/
│   │   ├── common/          # FloatingInput, Button
│   │   ├── layout/          # Sidebar
│   │   └── dashboard/       # Calendar, AccountPanel
│   ├── views/               # LoginView, SignupView, DashboardView 등
│   ├── stores/              # authStore, transactionStore, accountStore
│   ├── router/              # Vue Router 설정
│   ├── utils/               # storage, validation 유틸리티
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js
```

## 🔑 테스트 계정

자유롭게 회원가입하여 사용하실 수 있습니다.

**예시:**
- 아이디: `testuser`
- 별명: `테스터`
- 비밀번호: `1234`

## 🛠️ 기술 스택

- **프레임워크**: Vue 3 (Composition API)
- **빌드 도구**: Vite
- **상태 관리**: Pinia
- **라우팅**: Vue Router
- **스타일링**: SCSS (순수 SCSS만 사용)

## 📝 요구사항

- ✅ 플로팅 라벨 입력란
- ✅ 아이디 저장 기능
- ✅ 로그인/회원가입 페이지 (메뉴 숨김)
- ✅ 예시 시안에 맞춘 디자인
- ✅ Pinia를 사용한 상태 관리
- ✅ SCSS만 사용 (CSS 라이브러리 사용 안 함)
- ✅ 기능별 파일 및 폴더 설계
- ✅ 모든 기능 정상 동작

## 📌 향후 개선 사항

- [ ] Year/Month/Day 뷰 완전 구현
- [ ] 거래 내역 추가/수정/삭제 기능
- [ ] 계정 추가/삭제 기능
- [ ] 월 전환 기능 (이전/다음 월)
- [ ] 카테고리별 통계
- [ ] 모바일 반응형 디자인
- [ ] TypeScript 적용

## 📄 License

MIT
