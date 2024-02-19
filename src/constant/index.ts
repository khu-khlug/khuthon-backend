export const TeamState = {
  REGISTERED: 'REGISTERED',
} as const;
export type TeamState = (typeof TeamState)[keyof typeof TeamState];

export const MemberState = {
  VEILED: 'VEILED',
  ACTIVE: 'ACTIVE',
} as const;
export type MemberState = (typeof MemberState)[keyof typeof MemberState];
