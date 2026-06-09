# AI Daily English Coach

Vercel에 배포해서 쓰는 AI 영어 단어장 웹앱입니다.

## 주요 기능
- 매일 AI가 새 단어 3개 생성
- 1~2개 구동사 포함
- 최근 학습 단어 180개를 보내 중복 최소화
- IPA 발음기호, 뜻, 예문, 한국어 번역, 연상법, 실전 사용법
- 플래시카드 뒤집기
- 브라우저 음성 발음 듣기
- 학습 완료 저장
- 학습 기록
- 주간 복습 퀴즈
- 1/3/7/30일 망각곡선 복습
- 일요일 복습 배너

## 로컬 실행
```bash
npm install
cp .env.example .env.local
# .env.local에 OPENAI_API_KEY 입력
npm run dev
```

## Vercel 배포
1. 이 폴더를 GitHub 저장소에 업로드합니다.
2. Vercel에서 New Project로 가져옵니다.
3. Settings > Environment Variables에 아래 값을 추가합니다.
   - Name: `OPENAI_API_KEY`
   - Value: 본인의 OpenAI API Key
4. Deploy를 누릅니다.

## 주의
- API 키는 절대 `public/index.html`에 직접 넣지 마세요.
- 학습 기록은 현재 브라우저 localStorage에 저장됩니다.
- 여러 기기 동기화가 필요하면 다음 단계에서 Supabase/Firebase 로그인을 붙이면 됩니다.
