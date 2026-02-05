# Technical Specification: My Money Log

## 복잡도 평가
**Medium-Hard**: 다중 페이지, 인증 플로우, 상태 관리, 캘린더 뷰, 복잡한 스타일링 요구사항을 포함하는 완전한 가계부 애플리케이션

---

## 기술 스택

### 핵심 기술
- **프레임워크**: Vue 3 (Composition API)
- **빌드 도구**: Vite
- **상태 관리**: Pinia
- **스타일링**: SCSS (라이브러리 없이 순수 SCSS만 사용)
- **라우팅**: Vue Router

### 색상 팔레트
```scss
$color-main: #E6E6FA;      // 라벤더
$color-sub: #AAF0D1;       // 민트
$color-income: #87CEEB;    // 스카이 블루
$color-expense: #FFB6C1;   // 핑크
$color-text: #2F4F4F;      // 다크 슬레이트 그레이
$color-card: #FFFFFF;      // 화이트
```

---

## 구현 접근 방식

### 1. 프로젝트 구조
```
moneylog/
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── variables.scss      # 색상, 폰트 등 전역 변수
│   │   │   ├── mixins.scss         # 재사용 가능한 SCSS 믹스인
│   │   │   └── global.scss         # 전역 스타일
│   │   └── images/
│   │       └── logo.svg            # 로고 파일
│   ├── components/
│   │   ├── common/
│   │   │   ├── FloatingInput.vue   # 플로팅 라벨 입력 컴포넌트
│   │   │   └── Button.vue          # 공통 버튼 컴포넌트
│   │   ├── layout/
│   │   │   ├── Sidebar.vue         # 사이드바 (메뉴)
│   │   │   └── Header.vue          # 헤더
│   │   └── dashboard/
│   │       ├── Calendar.vue        # 캘린더 컴포넌트
│   │       └── AccountPanel.vue    # 계정 패널 컴포넌트
│   ├── views/
│   │   ├── LoginView.vue           # 로그인 페이지
│   │   ├── SignupView.vue          # 회원가입 페이지
│   │   ├── DashboardView.vue       # 대시보드 (월별 뷰)
│   │   ├── YearView.vue            # 연간 뷰
│   │   ├── MonthView.vue           # 월간 뷰 (상세)
│   │   └── DayView.vue             # 일간 뷰
│   ├── stores/
│   │   ├── auth.js                 # 인증 스토어
│   │   ├── transaction.js          # 거래 내역 스토어
│   │   └── account.js              # 계정 스토어
│   ├── router/
│   │   └── index.js                # 라우터 설정
│   ├── utils/
│   │   ├── storage.js              # localStorage 유틸리티
│   │   └── validation.js           # 폼 검증 유틸리티
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js
```

### 2. 주요 기능

#### 인증 시스템
- **로그인 페이지**
  - 플로팅 라벨 입력란 (아이디, 비밀번호)
  - 아이디 저장 기능 (localStorage)
  - 비밀번호 찾기 버튼
  - 로그인/회원가입 버튼
  - 세션 관리

- **회원가입 페이지**
  - 플로팅 라벨 입력란 (아이디, 별명, 비밀번호, 비밀번호 확인)
  - 실시간 검증 (아이디 중복, 비밀번호 일치 등)
  - 회원가입/로그인 버튼

#### 대시보드
- **레이아웃**
  - 좌측 사이드바: 로고, 메뉴 (Dashboard, Year, Month, Day)
  - 메인 영역: 캘린더 뷰
  - 좌측 하단: 계정 패널 (농협, 신한, 농협 표시)

- **캘린더 뷰**
  - 월별 캘린더 그리드
  - 수입/지출 표시 (색상 구분)
  - 일별 합계 표시
  - 월 총합 표시

### 3. 상태 관리 (Pinia)

#### authStore
```javascript
{
  user: null,              // 현재 로그인한 사용자
  isAuthenticated: false,  // 인증 상태
  savedUsername: '',       // 저장된 아이디
  
  // Actions
  login(username, password, rememberMe)
  logout()
  signup(username, nickname, password)
  loadSavedUsername()
}
```

#### transactionStore
```javascript
{
  transactions: [],        // 모든 거래 내역
  currentMonth: new Date(),
  
  // Actions
  addTransaction(transaction)
  deleteTransaction(id)
  getTransactionsByDate(date)
  getMonthlyTotal()
  getMonthlyIncome()
  getMonthlyExpense()
}
```

#### accountStore
```javascript
{
  accounts: [
    { id: 1, name: '농협', type: '입출 통장', balance: 1000000 },
    { id: 2, name: '신한', type: '입출 통장', balance: 4500000 },
    { id: 3, name: '농협', type: '적금', balance: 0 }
  ],
  
  // Actions
  updateBalance(accountId, amount)
  getTotalBalance()
}
```

### 4. 라우팅

```javascript
routes: [
  { path: '/login', component: LoginView, meta: { requiresGuest: true } },
  { path: '/signup', component: SignupView, meta: { requiresGuest: true } },
  { path: '/', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/year', component: YearView, meta: { requiresAuth: true } },
  { path: '/month', component: MonthView, meta: { requiresAuth: true } },
  { path: '/day', component: DayView, meta: { requiresAuth: true } }
]
```

### 5. 스타일링 전략

#### 플로팅 라벨 구현
```scss
.floating-input {
  position: relative;
  
  input {
    // 기본 스타일
  }
  
  label {
    position: absolute;
    transition: all 0.3s;
    
    &.active {
      transform: translateY(-150%);
      font-size: 0.85em;
    }
  }
}
```

#### 반응형 디자인
- 데스크톱 우선 (예시 시안 기준)
- 필요시 태블릿/모바일 브레이크포인트 추가

---

## 데이터 모델

### User
```typescript
interface User {
  id: string;
  username: string;
  nickname: string;
  password: string; // 실제로는 해시화 필요
  createdAt: Date;
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  accountId: string;
}
```

### Account
```typescript
interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}
```

---

## 검증 전략

### 개발 중 검증
1. **로컬 개발 서버**: `npm run dev`로 실시간 확인
2. **기능별 테스트**:
   - 로그인/회원가입 플로우
   - 아이디 저장 기능
   - 페이지 라우팅 및 네비게이션 가드
   - 캘린더 렌더링
   - 거래 내역 표시

### 최종 검증
1. **빌드 테스트**: `npm run build`로 프로덕션 빌드 확인
2. **수동 테스트**:
   - 모든 페이지 접근 가능 여부
   - 인증되지 않은 사용자의 보호된 페이지 접근 차단
   - 로그인 후 대시보드로 리다이렉트
   - 로그아웃 시 세션 삭제 확인
   - 디자인 시안과 일치 여부

---

## 구현 순서

1. **프로젝트 초기화 및 설정**
   - Vite + Vue 3 프로젝트 생성
   - Pinia, Vue Router, SCSS 설정
   - 기본 디렉토리 구조 생성

2. **공통 컴포넌트 및 유틸리티**
   - FloatingInput 컴포넌트
   - Button 컴포넌트
   - 전역 SCSS 변수 및 스타일

3. **Pinia 스토어**
   - authStore
   - transactionStore
   - accountStore

4. **인증 페이지**
   - 로그인 페이지
   - 회원가입 페이지
   - 라우터 가드 설정

5. **대시보드 구현**
   - 레이아웃 (사이드바, 헤더)
   - 캘린더 컴포넌트
   - 계정 패널

6. **최종 검증 및 복사**
   - 전체 기능 테스트
   - `/Users/superstart/Desktop/study/moneylog`로 복사

---

## 주의사항

1. **CSS 라이브러리 금지**: Tailwind, Bootstrap 등 사용 불가, 순수 SCSS만 사용
2. **메뉴 표시**: 로그인/회원가입 페이지에서는 메뉴(사이드바) 숨김
3. **세션 관리**: 로그인 페이지 접근 시 모든 세션 삭제
4. **실제 디렉토리 작업**: 최종적으로 `/Users/superstart/Desktop/study/moneylog`에 배포
5. **기능 동작**: 모든 기능은 실제로 동작해야 함 (목업 아님)
