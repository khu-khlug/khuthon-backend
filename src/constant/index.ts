export const MAX_TEAM_MEMBER_COUNT = 4;

export const MemberState = {
  NEED_VERIFICATION: 'NEED_VERIFICATION',
  NEED_STUDENT_INFO: 'NEED_STUDENT_INFO',
  NEED_TEAM: 'NEED_TEAM',
  ACTIVE: 'ACTIVE',
} as const;
export type MemberState = (typeof MemberState)[keyof typeof MemberState];

export const University = {
  KYUNGHEE_UNIV: 'KYUNGHEE_UNIV',
  AJOU_UNIV: 'AJOU_UNIV',
} as const;
export type University = (typeof University)[keyof typeof University];

export const EmailDomain: Record<University, string> = {
  [University.KYUNGHEE_UNIV]: 'khu.ac.kr',
  [University.AJOU_UNIV]: 'ajou.ac.kr',
};

export const ClsStoreKey = {
  IP: 'khuthon/req-ip',
  USER_AGENT: 'khuthon/req-ua',
} as const;
