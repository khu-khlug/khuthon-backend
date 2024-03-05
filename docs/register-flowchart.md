## 참가자 등록 과정 플로우 차트

참가자들의 등록 과정에 대한 플로우 차트입니다.

```mermaid
flowchart TB
  create-member("참가자 등록 시작")

  subgraph "state = `NEED_VERIFICATION`"
	register["참가 등록 (이메일, 비밀번호 입력)"]
  email-verify["이메일에 온 OTP로 이메일 소유권 인증"]
  end

  subgraph "state = `NEED_STUDENT_INFO`"
	isKHU{"경희대학교 학생인가?"}
	stuauth["stuauth를 통한 학적 정보 자동 입력"]
  input-student-info["학적 정보 수동 입력"]
  end

  subgraph "state = `NEED_TEAM`"
  has-team{"초대 받은 팀이 있는가?"}
  is-max-participant-exceeded{"최대 팀 수/참가 인원을\n넘지 않았는가?"}
  create-team["팀 생성"]
  participate-team["팀 참가"]
  participant-failed["참가 실패"]
  end

  subgraph "state = `ACTIVE`"
  team-works["팀 관련 작업"]
  end

  create-member-->register
	register-->email-verify
  email-verify-->|"state를 `NEED_STUDENT_INFO`로 변경"|isKHU
	isKHU-->|"TRUE"|stuauth
	isKHU-->|"FALSE"|input-student-info
	stuauth-->|"state를 `NEED_TEAM`로 변경"|has-team
  input-student-info-->|"state를 `NEED_TEAM`로 변경"|has-team
  has-team-->|"TRUE"|participate-team
  has-team-->|"FALSE"|is-max-participant-exceeded
  is-max-participant-exceeded-->|"TRUE"|create-team
  is-max-participant-exceeded-->|"FALSE"|participant-failed
  create-team-->|"state를 `ACTIVE`로 변경"|team-works
  participate-team-->|"state를 `ACTIVE`로 변경"|team-works
```
