import React, { useState } from 'react';
import {
  Database,
  Cpu,
  ShieldCheck,
  Server,
  Layers,
  Code2,
  GitBranch,
  KeyRound,
  FileCheck2,
  Table,
  CheckCircle2,
  ExternalLink,
  Lock,
  Smartphone,
  Globe
} from 'lucide-react';

export const ArchitectureDocView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'modules' | 'database' | 'techstack' | 'security'>('database');

  return (
    <div className="space-y-6">
      {/* Executive Blueprint Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                Software Architecture & System Analysis Blueprint
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                Firebase: sdnu-ppd-sys
              </span>
            </div>
            <h2 className="text-xl font-bold font-['Prompt'] text-white">
              รายงานการออกแบบสถาปัตยกรรมระบบวางแผนโครงการพัฒนาหอพักบุคลากร
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              จัดทำโดยบทบาท System Analyst (SA) และ Software Architect ครอบคลุมการจำแนกโมดูลการทำงาน, พจนานุกรมข้อมูล (Data Dictionary), แผนผังความสัมพันธ์ (ER Diagram), เทคโนโลยีสแตกที่แนะนำ (Tech Stack) และนโยบายการควบคุมสิทธิ์ (RBAC)
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveSection('database')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeSection === 'database'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            2. ตารางข้อมูล ฟิลด์หลัก & ความสัมพันธ์ (ERD)
          </button>
          <button
            onClick={() => setActiveSection('techstack')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeSection === 'techstack'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            3. เทคโนโลยีที่แนะนำ (Recommended Tech Stack)
          </button>
          <button
            onClick={() => setActiveSection('modules')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeSection === 'modules'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            1. สรุป 4 โมดูลหลัก & Functional Matrix
          </button>
          <button
            onClick={() => setActiveSection('security')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeSection === 'security'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            การจัดการสิทธิ์ผู้ใช้ (RBAC) & Security Rules
          </button>
        </div>
      </div>

      {/* SECTION 2: DATABASE & ENTITY RELATIONSHIPS */}
      {activeSection === 'database' && (
        <div className="space-y-6">
          {/* Section Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Prompt'] flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-500" />
                หัวข้อที่ 2: ตารางแสดงข้อมูลที่จำเป็น ฟิลด์ข้อมูลหลัก และความสัมพันธ์ระหว่างตาราง
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                การออกแบบโครงสร้างฐานข้อมูล NoSQL Document Model (Google Cloud Firestore / Firebase Project: <code className="font-mono text-slate-800 font-bold">sdnu-ppd-sys</code>) พร้อมรองรับการขยายเป็น Relational Database ในอนาคต
              </p>
            </div>

            {/* ER Diagram Conceptual Flow */}
            <div className="p-4 bg-slate-900 text-white rounded-xl font-mono text-xs overflow-x-auto">
              <div className="text-amber-400 font-bold mb-2">// แผนผังความสัมพันธ์ข้อมูล (Entity-Relationship & Collection Hierarchy)</div>
              <pre className="text-slate-300 leading-relaxed">
{`+----------------------------------------------------------------------------------------------------+
|  [PROJECTS COLLECTION] (/projects/{projectId}) - ตารางหลักบันทึกโครงการพัฒนาหอพัก                 |
+----------------------------------------------------------------------------------------------------+
| PK  id               : String (UUID/DocId)                                                          |
|     code             : String [Index] (รหัสโครงการ เช่น SDNU-67-01)                                 |
|     name             : String (ชื่อโครงการพัฒนาหอพักบุคลากร)                                         |
|     category         : String (หมวดหมู่งาน: ก่อสร้าง/ปรับปรุง/ระบบสาธารณูปโภค/โซลาร์เซลล์/สมาร์ทดอร์ม)|
|     location         : String (พื้นที่ดำเนินงาน เช่น หอพักบุคลากร โซน A, โซน B, แฟลตอาจารย์โสด)       |
|     fiscalYear       : Integer [Index] (ปีงบประมาณ พ.ศ. เช่น 2567, 2568, 2569, 2570)               |
|     budget           : Number (งบประมาณที่ได้รับอนุมัติ - บาท)                                        |
|     disbursedBudget  : Number (งบประมาณที่เบิกจ่ายแล้วจริง - บาท)                                    |
|     fundingSource    : String (แหล่งเงินทุน: งบแผ่นดิน/รายได้มหาวิทยาลัย/กองทุนหอพัก/PPP)            |
|     status           : String [Index] (สถานะ: ศึกษาความเหมาะสม/ขออนุมัติ/จัดซื้อ/ก่อสร้าง/ส่งมอบ)     |
|     progressPercent  : Number (ความคืบหน้ารวม 0-100%)                                               |
|     responsibleUnit  : String (หน่วยงานรับผิดชอบ เช่น กองอาคารสถานที่/คณะกรรมการสวัสดิการหอพัก)      |
|     contractor       : String (ผู้รับจ้าง/คู่สัญญา)                                                 |
|     targetStartDate  : String (วันที่เริ่มต้นตามแผน YYYY-MM-DD)                                      |
|     targetEndDate    : String (วันที่สิ้นสุดตามแผน YYYY-MM-DD)                                       |
|     description      : String (วัตถุประสงค์และขอบเขตงาน)                                            |
|     createdAt        : Timestamp                                                                    |
|     updatedAt        : Timestamp                                                                    |
+----------------------------------------------------------------------------------------------------+
       | 1                                                               | 1
       | มีการเปลี่ยนแปลงงบ/ความคืบหน้า                                  | ตรวจสอบการเข้าถึง
       v N                                                               v N
+----------------------------------------------+        +--------------------------------------------+
| [BUDGET_DISBURSEMENTS]                       |        | [SYSTEM_LOGS] (/systemLogs/{logId})        |
+----------------------------------------------+        +--------------------------------------------+
| PK  id             : String                  |        | PK  id          : String                   |
| FK  projectId      : String -> projects.id   |        | FK  projectId   : String -> projects.id    |
|     disbursedAmount: Number (ยอดเบิกงวด)     |        |     action      : String (CREATE/UPDATE/DEL)|
|     period         : String (งวดที่/เดือน)   |        |     performedBy : String (adminsdnu)       |
|     disbursedDate  : Timestamp               |        |     timestamp   : Timestamp                |
+----------------------------------------------+        +--------------------------------------------+`}
              </pre>
            </div>
          </div>

          {/* Detailed Data Dictionary Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm font-['Prompt']">
                พจนานุกรมข้อมูลหลัก (Data Dictionary & Field Specifications)
              </h4>
              <p className="text-xs text-slate-500">
                รายละเอียดฟิลด์, ชนิดข้อมูล (Data Type), ข้อจำกัด (Constraints) และคำอธิบายความหมาย
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">ชื่อฟิลด์ (Field Name)</th>
                    <th className="py-3 px-4">ประเภทข้อมูล (Type)</th>
                    <th className="py-3 px-4">ข้อจำกัด (Constraints)</th>
                    <th className="py-3 px-4">ความสัมพันธ์ (Relationship)</th>
                    <th className="py-3 px-4">คำอธิบายและตัวอย่าง (Description)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">id</td>
                    <td className="py-2.5 px-4 text-purple-700">String (UUID)</td>
                    <td className="py-2.5 px-4 text-rose-600 font-bold">Primary Key, Non-null</td>
                    <td className="py-2.5 px-4 text-slate-400">-</td>
                    <td className="py-2.5 px-4 font-sans text-slate-700">รหัสเอกสารเฉพาะใน Firestore</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">code</td>
                    <td className="py-2.5 px-4 text-purple-700">String(30)</td>
                    <td className="py-2.5 px-4 text-amber-700">Indexed, Unique</td>
                    <td className="py-2.5 px-4 text-slate-400">-</td>
                    <td className="py-2.5 px-4 font-sans text-slate-700">รหัสย่อโครงการ เช่น SDNU-67-01, SDNU-68-03</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">name</td>
                    <td className="py-2.5 px-4 text-purple-700">String(250)</td>
                    <td className="py-2.5 px-4 text-rose-600">Required</td>
                    <td className="py-2.5 px-4 text-slate-400">-</td>
                    <td className="py-2.5 px-4 font-sans text-slate-700">ชื่อเต็มของโครงการพัฒนาหอพักบุคลากร</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">category</td>
                    <td className="py-2.5 px-4 text-purple-700">Enum / String</td>
                    <td className="py-2.5 px-4 text-slate-700">6 หมวดหมู่มาตรฐาน</td>
                    <td className="py-2.5 px-4 text-slate-400">-</td>
                    <td className="py-2.5 px-4 font-sans text-slate-700">ก่อสร้างใหม่, ซ่อมบำรุง, สาธารณูปโภค, พลังงานแสงอาทิตย์, สมาร์ทดอร์ม</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">location</td>
                    <td className="py-2.5 px-4 text-purple-700">String(200)</td>
                    <td className="py-2.5 px-4 text-rose-600">Required</td>
                    <td className="py-2.5 px-4 text-slate-400">-</td>
                    <td className="py-2.5 px-4 font-sans text-slate-700">พื้นที่ดำเนินงาน เช่น หอพักบุคลากร โซน A, โซน B, แฟลตอาจารย์โสด</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">fiscalYear</td>
                    <td className="py-2.5 px-4 text-blue-700">Integer</td>
                    <td className="py-2.5 px-4 text-amber-700">Indexed (2550-2650)</td>
                    <td className="py-2.5 px-4 text-slate-400">-</td>
                    <td className="py-2.5 px-4 font-sans text-slate-700">ปีงบประมาณ พ.ศ. ที่จะดำเนินการ (เช่น 2567, 2568, 2569)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">budget</td>
                    <td className="py-2.5 px-4 text-blue-700">Double / Number</td>
                    <td className="py-2.5 px-4 text-slate-700">Min 0</td>
                    <td className="py-2.5 px-4 text-slate-400">-</td>
                    <td className="py-2.5 px-4 font-sans text-slate-700">งบประมาณจัดสรรรวมของโครงการ (บาท) สำหรับทำแผนภูมิวงกลม</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">disbursedBudget</td>
                    <td className="py-2.5 px-4 text-blue-700">Double / Number</td>
                    <td className="py-2.5 px-4 text-slate-700">&lt;= budget</td>
                    <td className="py-2.5 px-4 text-slate-400">-</td>
                    <td className="py-2.5 px-4 font-sans text-slate-700">จำนวนเงินที่เบิกจ่ายแล้วจริงตามงวดงาน</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">fundingSource</td>
                    <td className="py-2.5 px-4 text-purple-700">Enum / String</td>
                    <td className="py-2.5 px-4 text-slate-700">4 แหล่งทุน</td>
                    <td className="py-2.5 px-4 text-slate-400">-</td>
                    <td className="py-2.5 px-4 font-sans text-slate-700">งบประมาณแผ่นดิน / รายได้มหาวิทยาลัย / กองทุนหอพัก / PPP</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">status</td>
                    <td className="py-2.5 px-4 text-purple-700">Enum / String</td>
                    <td className="py-2.5 px-4 text-amber-700">Indexed (6 สถานะ)</td>
                    <td className="py-2.5 px-4 text-slate-400">-</td>
                    <td className="py-2.5 px-4 font-sans text-slate-700">ศึกษาความเหมาะสม &rarr; เสนอขอ &rarr; จัดซื้อจัดจ้าง &rarr; ก่อสร้าง &rarr; ตรวจรับ</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">progressPercent</td>
                    <td className="py-2.5 px-4 text-blue-700">Integer (0-100)</td>
                    <td className="py-2.5 px-4 text-slate-700">Default 0</td>
                    <td className="py-2.5 px-4 text-slate-400">-</td>
                    <td className="py-2.5 px-4 font-sans text-slate-700">เปอร์เซ็นต์ความก้าวหน้าทางกายภาพของงาน</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: RECOMMENDED TECH STACK */}
      {activeSection === 'techstack' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Prompt'] flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-500" />
                หัวข้อที่ 3: เทคโนโลยีที่แนะนำ (Recommended Tech Stack)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                วิเคราะห์และคัดเลือกสถาปัตยกรรมทางเทคนิคที่เน้นความเสถียร (High Availability), ความปลอดภัยระดับสถาบัน (Enterprise Security) และความสามารถในการขยายระบบ (Scalability) ในระยะยาว
              </p>
            </div>

            {/* Architecture Stack Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Frontend Layer */}
              <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/30 space-y-3">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm font-['Prompt']">
                  <Globe className="w-4 h-4" />
                  <span>1. Frontend Client Layer</span>
                </div>
                <div className="space-y-2 text-xs text-slate-700">
                  <div>
                    <strong className="block text-slate-900">React 19 + TypeScript:</strong>
                    โครงสร้าง Type-safe 100% ป้องกัน Runtime Bug พร้อม Component-based architecture ที่นำกลับมาใช้ซ้ำได้ง่าย
                  </div>
                  <div>
                    <strong className="block text-slate-900">Vite 8 Build Tool:</strong>
                    การคอมไพล์ความเร็วสูงแบบ Native ESM รองรับการโหลดหน้าเว็บที่รวดเร็ว (LCP &lt; 1.2s)
                  </div>
                  <div>
                    <strong className="block text-slate-900">Tailwind CSS + Vector SVG Engine:</strong>
                    เรนเดอร์แผนภูมิวงกลมแบบไดนามิก ปรับขนาดอัตโนมัติตามทุกหน้าจอ ทั้งมือถือ แท็บเล็ต และจอโปรเจกเตอร์ผู้บริหาร
                  </div>
                </div>
              </div>

              {/* Backend & Cloud Database */}
              <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm font-['Prompt']">
                  <Database className="w-4 h-4" />
                  <span>2. Database & Cloud Services</span>
                </div>
                <div className="space-y-2 text-xs text-slate-700">
                  <div>
                    <strong className="block text-slate-900">Google Cloud Firestore (NoSQL):</strong>
                    โครงการ <code className="bg-white px-1 rounded text-amber-800 font-mono">sdnu-ppd-sys</code> จัดเก็บข้อมูลแบบ Document Store มีระบบ Real-time Sync (WebSockets) ทำให้แผนภูมิวงกลมและแดชบอร์ดอัปเดตทันทีเมื่อแอดมินแก้ไข
                  </div>
                  <div>
                    <strong className="block text-slate-900">Cloud Multi-Region Replicas:</strong>
                    รองรับ SLA 99.999% พร้อมระบบสำรองข้อมูลอัตโนมัติ (Automated Backups) และการสเกลแบบ Serverless ไร้ขีดจำกัด
                  </div>
                </div>
              </div>

              {/* Security & Access Control */}
              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm font-['Prompt']">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3. Security & Governance</span>
                </div>
                <div className="space-y-2 text-xs text-slate-700">
                  <div>
                    <strong className="block text-slate-900">Zero-Trust Firestore Security Rules:</strong>
                    บังคับใช้ Schema Validation และ Attribute-Based Access Control (ABAC) ที่ระดับฐานข้อมูล ป้องกันการโจมตีแบบ Injection หรือ Bypass Client
                  </div>
                  <div>
                    <strong className="block text-slate-900">Role-Based Access Control (RBAC):</strong>
                    แบ่งชั้นความปลอดภัยชัดเจนระหว่างสิทธิ์ Admin (CRUD) และ Viewer (Read-only) ตามหลัก Least Privilege
                  </div>
                </div>
              </div>
            </div>

            {/* Why This Stack Table */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
                ตารางเปรียบเทียบข้อดีของสถาปัตยกรรมที่เลือก (Architecture Decision Record - ADR)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">มิติการประเมิน (Criteria)</th>
                      <th className="py-2.5 px-3">แนวทางที่เลือก (Selected Approach)</th>
                      <th className="py-2.5 px-3">ประโยชน์ต่อมหาวิทยาลัยนเรศวร (Business Value)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">ความเสถียร (Reliability)</td>
                      <td className="py-2.5 px-3">Serverless Firebase Infrastructure</td>
                      <td className="py-2.5 px-3">ไม่มีปัญหาเซิร์ฟเวอร์ล่ม ไม่ต้องดูแลรักษา Hardware หรือ OS Patches</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">การแสดงผลแผนภูมิวงกลม</td>
                      <td className="py-2.5 px-3">Native SVG Component (Custom Math)</td>
                      <td className="py-2.5 px-3">โหลดทันที น้ำหนักเบา ปรับแต่ง Tooltip และ Legend ภาษาไทยได้สมบูรณ์</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">ความปลอดภัยของข้อมูล</td>
                      <td className="py-2.5 px-3">ABAC + Granular Security Rules</td>
                      <td className="py-2.5 px-3">Viewer ไม่สามารถแก้ไขข้อมูลได้แม้จะแก้ไขคำสั่งผ่านเบราว์เซอร์</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">การขยายระบบในอนาคต (Scalability)</td>
                      <td className="py-2.5 px-3">Modular Clean Architecture</td>
                      <td className="py-2.5 px-3">สามารถเชื่อมต่อระบบ ERP พัสดุของมหาวิทยาลัย หรือระบบยืนยันตัวตน NU SSO ได้อย่างราบรื่น</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: CORE MODULES SUMMARY */}
      {activeSection === 'modules' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Prompt'] flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              หัวข้อที่ 1: สรุป 4 โมดูลหลักและเมทริกซ์การดำเนินงาน (Functional Matrix)
            </h3>
            <p className="text-xs text-slate-500">
              ตารางความสัมพันธ์ระหว่างโมดูล ฟังก์ชันย่อย และสิทธิ์การเข้าถึงของผู้ใช้งาน
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">โมดูลหลัก</th>
                    <th className="py-3 px-3">ฟังก์ชันการทำงานที่สำคัญ</th>
                    <th className="py-3 px-3">สิทธิ์ Admin</th>
                    <th className="py-3 px-3">สิทธิ์ Viewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 px-3 font-bold text-blue-900">
                      1. เสนอโครงการและศึกษาความเหมาะสม
                    </td>
                    <td className="py-3 px-3">
                      การยื่นคำขอ, ตรวจสอบผังโซนนิ่ง, ประเมินความคุ้มค่า (SROI), อนุมัติหลักการ
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">สร้าง/แก้ไข/อนุมัติ</td>
                    <td className="py-3 px-3 text-slate-500">ดูรายการที่ผ่านการอนุมัติแล้ว</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-emerald-900">
                      2. วางแผนงบประมาณและการเงิน
                    </td>
                    <td className="py-3 px-3">
                      จัดสรรกรอบวงเงินรายปี, จำแนกตาม 4 แหล่งเงินทุน, บันทึกการเบิกจ่ายจริง
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">จัดการงบ/แก้ไขตัวเลข</td>
                    <td className="py-3 px-3 text-slate-500">ดูยอดจัดสรรและยอดเบิกจ่าย</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-amber-900">
                      3. ติดตามสถานะการก่อสร้าง
                    </td>
                    <td className="py-3 px-3">
                      กำหนด Milestone, บันทึก % ความก้าวหน้าหน้างาน, จัดการ Defect และความเสี่ยง
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">อัปเดต % งาน/เปลี่ยนสถานะ</td>
                    <td className="py-3 px-3 text-slate-500">ดูความคืบหน้าแบบ Progress Bar</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-purple-900">
                      4. รายงานและแดชบอร์ดผู้บริหาร
                    </td>
                    <td className="py-3 px-3">
                      แผนภูมิวงกลมแยกโครงการ/หมวดหมู่/แหล่งทุน, KPI Cards, ส่งออก CSV
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">ดูและพิมพ์รายงานทุกระดับ</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">ดูแผนภูมิวงกลมและส่งออก CSV</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SECURITY & USER ROLES */}
      {activeSection === 'security' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Prompt'] flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" />
              การจัดการสิทธิ์ผู้ใช้งาน (User Roles) และนโยบายความปลอดภัย
            </h3>
            <p className="text-xs text-slate-500">
              ข้อกำหนดสิทธิ์การเข้าใช้งาน 2 ระดับตามความต้องการของระบบ
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Admin Role Card */}
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    ผู้ดูแลระบบ (Admin)
                  </span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                    Super User / Executive
                  </span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>ชื่อผู้ใช้งาน (User):</strong> <code className="bg-white px-1.5 py-0.5 rounded font-mono border text-amber-900 font-bold">adminsdnu</code></div>
                  <div><strong>รหัสผ่าน (Password):</strong> <code className="bg-white px-1.5 py-0.5 rounded font-mono border text-amber-900 font-bold">nustaff2009</code></div>
                  <div><strong>ขอบเขตสิทธิ์:</strong> เข้าถึงได้ทุกฟังก์ชัน ทั้งเพิ่มโครงการใหม่, แก้ไขข้อมูล, ลบโครงการ, อัปเดตสถานะการดำเนินงาน, จัดการงบประมาณ และตั้งค่าระบบ</div>
                </div>
              </div>

              {/* Viewer Role Card */}
              <div className="p-4 rounded-xl border border-sky-300 bg-sky-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-900 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    ผู้ใช้งานทั่วไป (Viewer)
                  </span>
                  <span className="text-[10px] bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full font-bold">
                    Read-Only Access
                  </span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>การเข้าถึง:</strong> ผู้ใช้งานทั่วไป/บุคลากรมหาวิทยาลัย (Guest / Viewer)</div>
                  <div><strong>ขอบเขตสิทธิ์:</strong> ดูได้เฉพาะข้อมูลแดชบอร์ด แผนภูมิวงกลม และตารางแสดงรายการโครงการ</div>
                  <div><strong>การควบคุมทางเทคนิค:</strong> ระบบซ่อนปุ่มเพิ่ม/แก้ไข/ลบโดยเด็ดขาด และแสดงป้ายกำกับสิทธิ์การเข้าถึงอย่างชัดเจน</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
