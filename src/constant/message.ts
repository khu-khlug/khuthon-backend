export const Message = {
  // 400 Bad Request
  INVALID_VOTE_DEST_TEAM: '투표할 팀을 정확하게 선택해주세요.',

  // 401 Unauthorized
  TOKEN_REQUIRED: '토큰이 필요합니다.',

  // 403 Forbidden
  FORBIDDEN_RESOURCE: '접근 권한이 없습니다.',
  ONLY_MEMBERS_CAN_WITHDRAW: '팀원만 팀의 참가 신청을 철회할 수 있습니다.',
  ONLY_MEMBERS_CAN_UPDATE_TEAM_IDEA:
    '팀원만 팀의 아이디어를 수정할 수 있습니다.',
  ONLY_MEMBERS_CAN_DELETE_ATTACHMENT: '팀원만 파일을 삭제할 수 있습니다.',

  // 404 Not found
  NO_REGISTERING_EVENT: '접수 중인 행사가 없습니다.',
  TEAM_NOT_FOUND: '해당되는 팀이 없습니다.',
  FILE_NOT_FOUND: '해당되는 파일이 없습니다.',
  EVENT_NOT_FOUND_ON_THIS_YEAR: '올해에는 아직 행사가 없습니다.',

  // 422 Unprocessable Entity
  PARTICIPANT_LIMIT_EXCEEDED: '접수 인원이 초과되었습니다.',
  ALREADY_REGISTERED_MEMBER: '이미 등록된 참가자입니다.',
  ALREADY_EXIST_TEAM_NAME: '이미 존재하는 팀 이름입니다.',
  INVALID_MEMBER_COUNT: '참가자 수는 1명에서 4명까지입니다.',
  CANNOT_EDIT_NOW: '수정 가능한 시기가 아닙니다.',
  CANNOT_SUBMIT_ATTACHMENT_NOW: '제출 가능한 시기가 아닙니다.',
  CANNOT_VOTE_NOW: '투표 기간이 아닙니다.',
  ALREADY_VOTED: '이미 투표했습니다.',
} as const;
