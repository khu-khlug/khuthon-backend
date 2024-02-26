export type UserRole = 'MEMBER' | 'JUDGE' | 'MANAGER' | 'ANONYMOUS';

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

export type User = MemberUser | JudgeUser | ManagerUser;
