export const UserRole = {
  MEMBER: 'MEMBER',
  EXAMINER: 'EXAMINER',
  MANAGER: 'MANAGER',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type MemberUser = {
  role: 'MEMBER';
  memberId: string;
};

export type ExaminerUser = {
  role: 'EXAMINER';
  examinerId: string;
};

export type ManagerUser = {
  role: 'MANAGER';
  email: string;
};

export type User = MemberUser | ExaminerUser | ManagerUser;
