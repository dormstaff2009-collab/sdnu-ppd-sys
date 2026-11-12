export type ProjectStatus =
  | 'ศึกษาความเหมาะสม (Feasibility)'
  | 'ออกแบบและประเมิณราคา (Cost Estimation)'
  | 'เสนอขออนุมัติงบประมาณ (Proposed)'
  | 'จัดทำราคากลาง (Reference Price)'
  | 'เสนอราคาจากผู้รับจ้าง (Quotation)'
  | 'จัดซื้อจัดจ้าง (Procurement)'
  | 'กำลังก่อสร้าง/ปรับปรุง (In Progress)'
  | 'ตรวจรับ/ส่งมอบแล้ว (Completed)'
  | 'ชะลอการดำเนินการ (On Hold)'
  | 'ไม่ได้รับอนุมัติงบประมาณ (Budget was not approved)';

export type ProjectCategory =
  | 'ปรับปรุงและซ่อมบำรุง'
  | 'ภูมิทัศน์และสิ่งแวดล้อม'
  | 'ความปลอดภัยและสมาร์ทดอร์ม'
  | 'พัฒนาระบบจัดการหอพักบุคลากร';

export type FundingSource =
  | 'งปม.รายได้หอพักบุคลากร'
  | 'งปม.แผ่นดิน'
  | 'งปม.รายได้'
  | 'งปม.อื่นๆ'
  | 'ไม่ใช้งบประมาณ';

export interface Project {
  id: string;
  code: string;
  name: string;
  category: ProjectCategory;
  location: string;
  fiscalYear: number;
  budget: number;
  disbursedBudget: number;
  fundingSource: FundingSource;
  status: ProjectStatus;
  progressPercent: number;
  targetStartDate?: string;
  targetEndDate?: string;
  responsibleUnit: string;
  contractor?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'viewer';

export interface UserSession {
  username: string;
  role: UserRole;
  displayName: string;
  loginTime: string;
}

export interface PieChartSlice {
  label: string;
  value: number;
  count: number;
  color: string;
  percent: number;
}
