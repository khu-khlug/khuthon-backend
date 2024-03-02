export const UserRole = {
  MEMBER: 'MEMBER',
  EXAMINER: 'EXAMINER',
  MANAGER: 'MANAGER',
  ANONYMOUS: 'ANONYMOUS',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type MemberUser = {
  role: 'MEMBER';
  memberId: string;
  teamId: string;
};

export type ExaminerUser = {
  role: 'EXAMINER';
  examinerId: string;
};

export type ManagerUser = {
  role: 'MANAGER';
  email: string;
};

export type AnonymousUser = {
  role: 'ANONYMOUS';
};

export type User = MemberUser | ExaminerUser | ManagerUser | AnonymousUser;
