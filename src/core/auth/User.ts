export const UserRole = {
  MEMBER: 'MEMBER',
  JUDGE: 'JUDGE',
  MANAGER: 'MANAGER',
  ANONYMOUS: 'ANONYMOUS',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type MemberUser = {
  role: 'MEMBER';
  memberId: string;
  teamId: string;
};

export type JudgeUser = {
  role: 'JUDGE';
  judgeId: string;
};

export type ManagerUser = {
  role: 'MANAGER';
  email: string;
};

export type AnonymousUser = {
  role: 'ANONYMOUS';
};

export type User = MemberUser | JudgeUser | ManagerUser | AnonymousUser;
