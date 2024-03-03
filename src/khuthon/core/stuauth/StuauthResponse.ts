export interface StuauthResponse {
  code: number;
  message: string;
  data: {
    id: number; // 학번
    name: string; // 이름
    grade: number; // 학년
    major: {
      college: string;
      department: string;
      major?: string;
    }[]; // 전공
    phone: string; // 전화번호
  };
}
