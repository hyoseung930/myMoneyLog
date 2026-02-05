# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification

기술 명세 완료. spec.md에 다음 내용 포함:
- 복잡도: Medium-Hard
- 기술 스택: Vue 3, Vite, Pinia, SCSS, Vue Router
- 프로젝트 구조 설계
- 상태 관리 설계
- 데이터 모델 정의
- 구현 순서 정의

---

### [x] Step 1: 프로젝트 초기화 및 기본 설정

Vue 3 + Vite 프로젝트를 생성하고 필요한 의존성을 설치합니다.

**작업 내용:**
- Vite로 Vue 3 프로젝트 생성
- Pinia, Vue Router, SCSS 설치
- 기본 디렉토리 구조 생성 (components, views, stores, assets, utils, router)
- vite.config.js 설정
- 전역 SCSS 변수 파일 생성 (색상, 폰트 등)
- 로고 파일 추가

**검증:**
- `npm run dev`로 개발 서버 실행 확인

---

### [x] Step 2: 공통 컴포넌트 및 유틸리티 구현

재사용 가능한 공통 컴포넌트와 유틸리티 함수를 구현합니다.

**작업 내용:**
- FloatingInput.vue: 플로팅 라벨 입력 컴포넌트
- Button.vue: 공통 버튼 컴포넌트
- storage.js: localStorage 관리 유틸리티
- validation.js: 폼 검증 유틸리티
- SCSS 믹스인 및 전역 스타일

**검증:**
- 각 컴포넌트가 독립적으로 렌더링되는지 확인

---

### [x] Step 3: Pinia 스토어 구현

전역 상태 관리를 위한 Pinia 스토어를 구현합니다.

**작업 내용:**
- authStore: 인증 상태 관리 (login, logout, signup, 아이디 저장)
- transactionStore: 거래 내역 관리
- accountStore: 계정 정보 관리
- 초기 더미 데이터 설정

**검증:**
- 스토어 액션이 정상적으로 동작하는지 확인

---

### [x] Step 4: 라우터 설정 및 네비게이션 가드

Vue Router를 설정하고 인증 기반 라우팅을 구현합니다.

**작업 내용:**
- 라우터 설정 (login, signup, dashboard, year, month, day)
- 네비게이션 가드 구현 (requiresAuth, requiresGuest)
- 로그인 페이지에서 세션 삭제 로직

**검증:**
- 인증되지 않은 사용자가 보호된 페이지 접근 시 로그인 페이지로 리다이렉트
- 로그인한 사용자가 로그인 페이지 접근 시 대시보드로 리다이렉트

---

### [x] Step 5: 로그인 페이지 구현

로그인 페이지 UI 및 기능을 구현합니다.

**작업 내용:**
- LoginView.vue 구현
- 플로팅 라벨 입력란 (아이디, 비밀번호)
- 아이디 저장 체크박스 및 기능
- 비밀번호 찾기 버튼
- 로그인/회원가입 버튼
- SCSS 스타일링 (예시 시안 참고하여 중앙 배치, 로고 상단)

**검증:**
- 아이디 저장 기능이 localStorage에 정상 저장되는지 확인
- 로그인 성공 시 대시보드로 이동
- 메뉴(사이드바)가 보이지 않는지 확인

---

### [x] Step 6: 회원가입 페이지 구현

회원가입 페이지 UI 및 기능을 구현합니다.

**작업 내용:**
- SignupView.vue 구현
- 플로팅 라벨 입력란 (아이디, 별명, 비밀번호, 비밀번호 확인)
- 실시간 검증 (비밀번호 일치 여부 등)
- 회원가입/로그인 버튼
- SCSS 스타일링 (로그인 페이지와 동일한 스타일)

**검증:**
- 회원가입 성공 시 로그인 페이지로 이동
- 비밀번호 불일치 시 에러 메시지 표시
- 메뉴(사이드바)가 보이지 않는지 확인

---

### [x] Step 7: 대시보드 레이아웃 구현

대시보드의 기본 레이아웃과 사이드바를 구현합니다.

**작업 내용:**
- DashboardView.vue 기본 레이아웃
- Sidebar.vue: 로고, 메뉴 (Dashboard, Year, Month, Day)
- Header.vue (필요시)
- AccountPanel.vue: 계정 표시 패널 (농협, 신한, 농협)
- SCSS 레이아웃 스타일링

**검증:**
- 사이드바가 좌측에 고정되어 표시
- 메뉴 클릭 시 각 페이지로 이동
- 계정 패널이 좌측 하단에 표시

---

### [x] Step 8: 월별 캘린더 뷰 구현

대시보드의 메인 캘린더 뷰를 구현합니다.

**작업 내용:**
- Calendar.vue: 월별 캘린더 그리드
- 날짜별 수입/지출 데이터 표시 (색상 구분)
- 월 전환 기능
- 일별 합계, 월 총합 표시
- SCSS 스타일링 (예시 시안에 맞춰 그리드 레이아웃)

**검증:**
- 캘린더가 올바르게 렌더링되는지 확인
- 수입은 파란색, 지출은 분홍색으로 표시
- 더미 데이터로 테스트

---

### [x] Step 9: 추가 뷰 구현 (Year, Month, Day)

나머지 뷰 페이지를 구현합니다.

**작업 내용:**
- YearView.vue: 연간 뷰 (기본 구조)
- MonthView.vue: 월간 상세 뷰
- DayView.vue: 일간 뷰
- 각 뷰에 맞는 SCSS 스타일링

**검증:**
- 각 메뉴 클릭 시 해당 페이지로 정상 이동
- 레이아웃이 일관되게 유지

---

### [x] Step 10: 최종 테스트 및 복사

전체 기능을 테스트하고 지정된 디렉토리로 복사합니다.

**작업 내용:**
- 전체 기능 수동 테스트
- 빌드 테스트 (`npm run build`)
- `/Users/superstart/Desktop/study/moneylog`로 프로젝트 복사
- report.md 작성

**검증:**
- 모든 페이지가 정상 동작
- 인증 플로우가 올바르게 작동
- 디자인이 예시 시안과 유사하게 구현
- 목적지 디렉토리에서 `npm run dev` 실행 확인
