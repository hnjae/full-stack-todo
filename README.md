## 개요

`full-stack-todo`는 NestJS와 React를 활용한 할 일 관리 웹 애플리케이션입니다.

<https://todo.hnjae.org> 에서 현재 서비스 중 입니다. 테스트를 원하시면 유저명 `demo@demo.com`, 패스워드 `demodemo`로 로그인해 보세요. 또는 가상의 이메일 주소로 새 계정을 생성하여 테스트하실 수도 있습니다.

※ 현재 개인 서버에서 호스팅 중입니다. 간헐적으로 다운타임이 종종 있을 수 있습니다.

로컬 머신에서 직접 실행을 원하실 경우, 아래 배포 방법을 참고하시면 됩니다.

### 데모 영상

[demo.webm](https://github.com/user-attachments/assets/c439af24-522b-415b-9a70-f3b852516cdc)

## 프로젝트 구조

이 프로젝트는 모노레포로 구성되어 있습니다. 주요 구조는 다음과 같습니다.

```text
./
├── packages/
│   ├── api/                 # 백엔드 (NestJS)
│   │   ├── prisma/          # Prisma 스키마 및 마이크레이션
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── prisma/
│   │   │   ├── todo-lists/
│   │   │   ├── todos/
│   │   │   ├── users/
│   │   │   └── ...
│   │   └── ...
│   └── ui/                  # 프론트엔드 (React)
│       ├── src/             # Feature-Sliced Design 을 따르는 폴더 구조
│       │   ├── app/
│       │   ├── entities/
│       │   ├── features/
│       │   ├── pages/
│       │   ├── shared/
│       │   └── widgets/
│       └── ...
├── Containerfile            # 컨테이너 빌드 설정
├── docker-compose.yaml
└── ...
```

## 기술 스택 및 구현 내용

### 백엔드

##### 기술 스택

- [NestJS](https://nestjs.com)
- [Prisma](https://www.prisma.io)

##### 구현 내용

- [OAuth 2.0 (RFC-6749)](https://datatracker.ietf.org/doc/html/rfc6749) 규격에 맞는 인증 시스템 구현
  - 로그인 시 Access Token / Refresh Token 발급
  - Refresh Token으로 Access Token 재발급 가능
  - [Refresh token rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation) 도입: 폐기된 Refresh Token으로 재발급 요청 시 모든 토큰 만료
- 할 일(todo), 할 일 리스트(todo list)를 RESTful API로 CRUD 구현
  - 타인의 Access Token 등으로 액세스하지 못하게 하는 가드 구현
- ORM으로 Prisma 사용 및 Prisma 에러 핸들링
- `hurl`을 이용해서 동작 테스트

### 프론트엔드

##### 기술 스택

- [React](https://react.dev)
- [TanStack Router](https://tanstack.com/router/latest)
- [Redux](https://redux.js.org)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Tailwind CSS](https://tailwindcss.com)
- [dnd kit](https://dndkit.com)
- [Ant Design](https://ant.design) (UI 킷)

##### 구현 내용

- [Feature-Sliced Design](https://feature-sliced.github.io/documentation/) 기반 폴더 구조
- TanStack Router로 로그인(`/login`), 회원가입(`/signup`), 투두앱(`/webapp`) 페이지 라우팅
- 브라우저 `localStorage`에 Refresh Token 저장 후 자동 로그인 구현
- RTK Query 이용 백엔드 통신
  - Access Token 만료 시 자동 재인증(Access Token 재발급) 수행, 유저가 눈치채지 못하게 처리
  - "optimistic update" 구현: 백엔드 통신 완료 전 UI에 즉시 반영
- dnd-kit 활용하여 Todo 순서 변경 및 리스트 변경을 drag-and-drop으로 구현

### CI 및 배포

- OCI-Compliant 컨테이너 이미지 작성(`Containerfile`)
- 위 이미지 활용한 GitHub Actions 기반 CI 구현
- [Podman Quadlet](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html) 이용 개인 서버 호스팅

### 개발 과정

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)를 따라 커밋 메시지 작성
- [`husky`](https://github.com/typicode/husky)와 [`lint-staged`](https://github.com/lint-staged/lint-staged)를 이용해 커밋 전 자동으로 린터·포맷터 실행
- GitHub PR Template을 활용해 `main`에 머지되는 내용을 명세화하고 리뷰 진행

## 배포 방법

`docker-compose.yaml`을 이용해 직접 호스팅할 수 있습니다.

### 환경 변수 설정

#### 프론트엔드

full-stack-todo는 Client-Side 렌더링 SPA(싱글 페이지 애플리케이션)입니다. 프론트엔드 패키지를 빌드하는 시점에서 백엔드 API 주소가 주입됩니다.

`/packages/ui/env.production` 파일에서 `VITE_API_URL`을 API 서버 주소로 수정하세요.

```sh
VITE_API_URL="http://127.0.0.1:5000"
```

#### 백엔드

`docker-compose.yaml`에서 다음 항목을 필요에 따라 수정하세요.

```yaml
environment:
  JWT_SECRET: secret
  APP_URL: http://127.0.0.1:5001
  DATABASE_URL: postgres://user:password@db:5432/dbname
```

### 도커 이미지 빌드 및 실행

프로젝트 루트 경로에서 다음 명령어를 실행하세요.

```sh
docker-compose build
docker-compose up
```

아무런 변경을 하지 않았을 시, 기본값으로 설정된 `http://127.0.0.1:5001`에 접속하여 사용해볼 수 있습니다.
