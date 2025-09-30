# Gym membership app

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/gangd132-5204s-projects/v0-gym-membership-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/Dw1nCX389CG)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/gangd132-5204s-projects/v0-gym-membership-app](https://vercel.com/gangd132-5204s-projects/v0-gym-membership-app)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/Dw1nCX389CG](https://v0.app/chat/projects/Dw1nCX389CG)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## 프로젝트 파일/폴더 역할 안내

아래는 현재 저장소의 주요 파일과 폴더가 수행하는 역할입니다. (경로는 `app/`, `components/` 기준)

### 앱 라우팅(app)
- `app/layout.tsx`: 전역 레이아웃(테마, 폰트, 메타 등) 구성
- `app/page.tsx`: 랜딩 페이지(첫 화면)
- `app/gyms/page.tsx`: 헬스장 목록 페이지. `components/gym-search.tsx`를 렌더링하여 DB의 `Gyms` 데이터를 검색/표시
- `app/profile/page.tsx`: 내 프로필 페이지. 로그인 유저 정보를 표시/편집 UI 제공
- `app/admin/page.tsx`: 관리자 대시보드 진입 페이지. 상단에 `AdminHeader` 포함
- `app/admin/register-gym/page.tsx`: 헬스장 등록 페이지. `GymRegistration` 폼 UI 렌더
- `app/admin/register-brand/page.tsx`: 브랜드 등록 페이지. `Brands` 테이블에 `name`, `is_sale` 등록
- `app/payment/[gymId]/page.tsx`: 결제 플로우 진입 라우트(헬스장별 결제 화면)
- `app/qr-entry/page.tsx`: QR 입장 기능 화면

### API 라우트(app/api)
- `app/api/register/route.ts`
  - GET: `?email=`로 `Users` 존재 여부 조회
  - POST: 신규 사용자 등록(`Users` 테이블)
- `app/api/brands/route.ts`
  - POST: `Brands` 테이블에 `user_id`, `name`, `is_sale` 저장
  - GET: (선택) `?user_id=`로 로그인 사용자 소유 브랜드 목록 조회
- `app/api/gyms/route.ts`
  - GET: `Gyms` 목록 조회 + `Brands` 조인(`Brands:brand_id (brand_id, name, is_sale)`)
  - POST: `Gyms` 테이블에 헬스장 정보 저장(`brand_id`, `name`, `address`, `business_number`, 가격 필드 등)

### 컴포넌트(components)
- `components/header.tsx`: 공용 상단 헤더(로그인/로그아웃, 내비게이션)
- `components/admin-header.tsx`: 관리자 상단 헤더(알림/설정/브랜드 등록 버튼 등)
- `components/admin-dashboard.tsx`: 관리자 대시보드 UI 구성 요소
- `components/auth-section.tsx`: 인증 섹션. Google OAuth, 전화번호 입력/검증, 미등록 안내 처리
- `components/gym-registration.tsx`: 헬스장 등록 폼. 브랜드 선택 드롭다운 + 헬스장 기본/가격 정보 입력 후 `/api/gyms` 저장
- `components/gym-search.tsx`: 헬스장 검색 UI 및 등록된 헬스장 목록 UI `/api/gyms`에서 데이터를 받아 카드로 표시(브랜드명 포함)
- `components/payment-flow.tsx`: 결제 관련 UI 구성 요소
- `components/qr-entry.tsx`: QR 입장 관련 UI 구성 요소
- `components/theme-provider.tsx`: 테마(다크/라이트) 컨텍스트 제공자
- `components/ui/*`: 버튼, 카드, 인풋 등 재사용 가능한 UI 프리미티브

### 라이브러리(lib)
- `lib/supabase.ts`
  - `supabase`: 클라이언트에서 사용하는 Supabase 인스턴스
  - `getSupabaseAdmin()`: 서버 사이드에서만 사용하는 Admin 클라이언트 팩토리
  - `UserData`, `BrandData`, `GymData` 등 앱에서 사용하는 타입 정의
- `lib/utils.ts`: 공용 유틸 함수 모음(필요 시 확장)

### 스타일/정적 파일
- `app/globals.css`, `styles/globals.css`: 전역 스타일
- `public/*`: 이미지/아이콘 등 정적 자원

### 설정/환경
- `next.config.mjs`: Next.js 설정
- `tsconfig.json`: TypeScript 설정
- `components.json`: UI 컴포넌트 관련 설정
- `package.json`: 의존성/스크립트 정의

### 데이터 모델 참고(요약)
- `Users`: 사용자 기본 정보(name, phone, email, wallet_address 등)
- `Brands`: 브랜드 정보(소유자 `user_id` FK, `name`, `is_sale`)
- `Gyms`: 헬스장 정보(`brand_id` FK, `name`, `address`, `business_number`, `description`, 가격 필드 등)

필요 시 더 자세한 설계/플로우(예: 회원가입-등록-이동 경로, 결제 처리 흐름)를 본 문서에 추가할 수 있습니다.