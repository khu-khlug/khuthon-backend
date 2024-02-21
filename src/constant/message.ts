export const Message = {
  // 403 Forbidden
  ONLY_MEMBERS_CAN_WITHDRAW: '팀원만 팀의 참가 신청을 철회할 수 있습니다.',

  // 404 Not found
  NO_REGISTERING_EVENT: '접수 중인 행사가 없습니다.',
  TEAM_NOT_FOUND: '해당되는 팀이 없습니다.',

  // 422 Unprocessable Entity
  PARTICIPANT_LIMIT_EXCEEDED: '접수 인원이 초과되었습니다.',
  ALREADY_REGISTERED_MEMBER: '이미 등록된 참가자입니다.',
  ALREADY_EXIST_TEAM_NAME: '이미 존재하는 팀 이름입니다.',
  INVALID_MEMBER_COUNT: '참가자 수는 1명에서 4명까지입니다.',
} as const;
