export const TeamState = {
  REGISTERED: 'REGISTERED',
} as const;
export type TeamState = (typeof TeamState)[keyof typeof TeamState];

export const MemberState = {
  INVITING: 'INVITING',
  NEED_EMAIL_VERIFICATION: 'NEED_EMAIL_VERIFICATION',
  ACTIVE: 'ACTIVE',
} as const;
export type MemberState = (typeof MemberState)[keyof typeof MemberState];

export const University = {
  KYUNGHEE_UNIV: 'KYUNGHEE_UNIV',
  AJOU_UNIV: 'AJOU_UNIV',
} as const;
export type University = (typeof University)[keyof typeof University];
