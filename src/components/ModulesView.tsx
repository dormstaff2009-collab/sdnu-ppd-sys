import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  HardHat,
  PieChart as PieIcon,
  CheckCircle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface ModuleDetail {
  id: string;
  name: string;
  enName: string;
  icon: any;
  color: string;
  badge: string;
  summary: string;
  subFunctions: {
    title: string;
    description: string;
    inputs: string[];
    outputs: string[];
  }[];
  rolesInvolved: string[];
  benefits: string[];
}

export const ModulesView: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string>('m1');

  const modules: ModuleDetail[] = [
    {
      id: 'm1',
      name: 'โมดูลเสนอโครงการและศึกษาความเหมาะสม',
      enName: 'Project Proposal & Feasibility Study Module',
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
      badge: 'ระยะเริ่มต้น (Initiation & Planning)',
      summary:
        'ทำหน้าที่เป็นจุดเริ่มต้นของการเสนอแนวคิดการพัฒนาหอพักบุคลากร รวบรวมคำขอจากคณะ/หน่วยงาน และทำการประเมินความคุ้มค่าทางเศรษฐศาสตร์ กายภาพ และผลกระทบต่อสิ่งแวดล้อม',
      subFunctions: [
        {
          title: '1.1 ระบบยื่นข้อเสนอโครงการและแนวคิดตั้งต้น (Project Initiation & Concept Submission)',
          description:
            'เปิดให้หน่วยงานหรือคณะกรรมการสวัสดิการหอพักกรอกแบบฟอร์มเสนอโครงการ ระบุปัญหา ความจำเป็น ความเร่งด่วน และประมาณการจำนวนผู้พักอาศัยที่ได้รับประโยชน์',
          inputs: ['ชื่อโครงการ', 'วัตถุประสงค์', 'พื้นที่เป้าหมาย', 'กลุ่มผู้รับประโยชน์ (อาจารย์/เจ้าหน้าที่สายสนับสนุน/ครอบครัว)'],
          outputs: ['เอกสารข้อเสนอโครงการฉบับร่าง (Concept Paper)', 'รหัสคำขอโครงการ'],
        },
        {
          title: '1.2 การประเมินความเหมาะสมทางกายภาพและการสำรวจพื้นที่ (Site Survey & Zoning Feasibility)',
          description:
            'บันทึกข้อมูลการตรวจสอบสภาพที่ดิน ผังแม่บทมหาวิทยาลัย ระบบสาธารณูปโภคเดิม (ประปา ไฟฟ้า ท่อระบายน้ำ) และข้อจำกัดทางผังเมือง/กฎหมายอาคาร',
          inputs: ['พิกัด GIS/โซนที่ตั้ง', 'รายงานผลการสำรวจดิน/สิ่งปลูกสร้างเดิม', 'การประเมินการเชื่อมต่อระบบโครงข่าย'],
          outputs: ['รายงานผลการสำรวจทางเทคนิค (Technical Survey Report)', 'แผนที่โซนนิ่งและภาพถ่ายสภาพเดิม'],
        },
        {
          title: '1.3 การวิเคราะห์ความคุ้มค่าทางการเงินและผลกระทบ (Cost-Benefit & Feasibility Analysis)',
          description:
            'คำนวณความคุ้มค่า อัตราผลตอบแทนทางสังคม (SROI), ประมาณการรายรับจากค่าธรรมเนียมหอพัก และค่าใช้จ่ายซ่อมบำรุงในวงจรอายุอาคาร (Life-Cycle Cost)',
          inputs: ['ประมาณการเงินลงทุนเบื้องต้น', 'อัตราค่าธรรมเนียมหอพักเป้าหมาย', 'อัตราการเข้าพักที่คาดหวัง'],
          outputs: ['แบบจำลองทางการเงิน (Financial Feasibility Model)', 'คะแนนจัดลำดับความสำคัญของโครงการ (Scoring Matrix)'],
        },
        {
          title: '1.4 เวิร์กโฟลว์การกลั่นกรองและอนุมัติหลักการ (Preliminary Approval Workflow)',
          description:
            'ส่งต่อเอกสารข้อเสนอโครงการผ่านการลงนามดิจิทัลจากคณะกรรมการหอพัก สู่คณะกรรมการบริหารมหาวิทยาลัยเพื่อบรรจุลงในแผนพัฒนาฯ',
          inputs: ['ความเห็นของคณะกรรมการ', 'มติที่ประชุมสวัสดิการหอพัก'],
          outputs: ['ใบอนุมัติหลักการโครงการ (Project Charter)', 'สถานะปรับเป็น "เสนอขออนุมัติงบประมาณ"'],
        },
      ],
      rolesInvolved: ['คณะกรรมการสวัสดิการหอพัก', 'กองอาคารสถานที่และยานพาหนะ', 'ผู้บริหารมหาวิทยาลัย'],
      benefits: [
        'คัดกรองโครงการที่มีความคุ้มค่าและตอบสนองความต้องการของบุคลากรได้อย่างแท้จริง',
        'ลดความเสี่ยงโครงการล้นหรือซ้ำซ้อนในพื้นที่หอพัก',
        'มีหลักฐานทางวิชาการและผลสำรวจรองรับการขอจัดสรรงบประมาณ',
      ],
    },
    {
      id: 'm2',
      name: 'โมดูลวางแผนงบประมาณและการเงิน',
      enName: 'Budgeting & Financial Planning Module',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      badge: 'การจัดสรรและควบคุมต้นทุน (Financial Control)',
      summary:
        'บริหารจัดการกรอบวงเงินงบประมาณรายจ่ายล่วงหน้า จำแนกตามแหล่งเงินทุน วางแผนการเบิกจ่ายตามงวดงาน และควบคุมไม่ให้เกิดงบประมาณบานปลาย',
      subFunctions: [
        {
          title: '2.1 การจัดสรรกรอบวงเงินตามปีงบประมาณ (Fiscal Year Budget Allocation)',
          description:
            'กำหนดเพดานงบประมาณตามปี พ.ศ. (เช่น 2567-2571) สอดคล้องกับแผนยุทธศาสตร์มหาวิทยาลัย ทั้งงบผูกพันข้ามปีงบประมาณและงบประมาณปีเดียว',
          inputs: ['กรอบวงเงินรวมประจำปี', 'ระยะเวลาผูกพันงบประมาณ', 'รายการหมวดหมู่งาน'],
          outputs: ['แผนจัดสรรงบประมาณรายปี (Annual Capital Allocation)', 'ตารางงบผูกพันข้ามปี'],
        },
        {
          title: '2.2 การจำแนกตามโครงสร้างแหล่งเงินทุน (Multi-source Funding Distribution)',
          description:
            'จัดสรรสัดส่วนงบประมาณตามแหล่งเงินทุน 4 ประเภทหลัก: งบประมาณแผ่นดิน, เงินรายได้มหาวิทยาลัย, กองทุนสวัสดิการหอพัก, และเงินร่วมทุน PPP',
          inputs: ['สัดส่วนแหล่งเงิน', 'เงื่อนไขการใช้จ่ายของแต่ละกองทุน'],
          outputs: ['โครงสร้างเงินทุนของแต่ละโครงการ (Capital Structure Breakdown)', 'บัญชีคุมงบประมาณแยกกองทุน'],
        },
        {
          title: '2.3 การวางแผนงวดเงินและการเบิกจ่ายจริง (Cash Flow & Disbursement Tracking)',
          description:
            'บันทึกแผนการเบิกจ่ายเปรียบเทียบกับการเบิกจ่ายจริง (Planned vs Actual Cash Flow) และแจ้งเตือนเมื่ออัตราการเบิกจ่ายล่าช้ากว่าเป้าหมาย',
          inputs: ['งวดงานตามสัญญา', 'ใบแจ้งหนี้/ใบสำคัญจ่าย', 'รายงานตรวจรับพัสดุ'],
          outputs: ['สถิติอัตราการเบิกจ่ายเงินสะสม', 'กราฟ S-Curve ด้านการเงิน (Financial S-Curve)'],
        },
        {
          title: '2.4 การบริหารความผันผวนของต้นทุนและเงินสำรอง (Cost Variance & Contingency Fund)',
          description:
            'ระบบคำนวณส่วนต่างของต้นทุนจากการปรับปรุงแบบแปลน (Change Orders) และจัดสรรงบประมาณสำรองกรณีฉุกเฉิน (Contingency)',
          inputs: ['คำขอเปลี่ยนแปลงแบบ/ปริมาณงาน', 'ราคาวัสดุก่อสร้างกลาง'],
          outputs: ['บันทึกการเบิกเงินสำรองฉุกเฉิน', 'รายงาน Cost Variance Index (CVI)'],
        },
      ],
      rolesInvolved: ['กองคลังและพัสดุ', 'กองแผนงาน', 'หัวหน้าโครงการพัฒนาหอพัก'],
      benefits: [
        'ติดตามสถานะเงินทุนได้แบบเรียลไทม์ ป้องกันปัญหางบประมาณติดลบ',
        'วิเคราะห์ความคุ้มค่าของเงินรายได้หอพักเทียบกับการพึ่งพางบแผ่นดิน',
        'สร้างความโปร่งใสและตรวจสอบได้ตามระเบียบการเบิกจ่ายของรัฐ',
      ],
    },
    {
      id: 'm3',
      name: 'โมดูลติดตามสถานะการก่อสร้างและปรับปรุง',
      enName: 'Construction & Renovation Tracking Module',
      icon: HardHat,
      color: 'from-amber-500 to-orange-600',
      badge: 'การปฏิบัติงานหน้างาน (Field Execution & QA)',
      summary:
        'กำกับดูแลความก้าวหน้าของการก่อสร้างอาคารใหม่และงานปรับปรุงซ่อมแซมใหญ่ ควบคุมไทม์ไลน์ ตรวจรับงานงวด และจัดการข้อร้องเรียนหรืออุปสรรคหน้างาน',
      subFunctions: [
        {
          title: '3.1 แผนงานหลักและหมุดหมายสำคัญ (Master Schedule & Milestones)',
          description:
            'สร้างไทม์ไลน์งาน (Gantt Chart / Milestones) ตั้งแต่การเคลียร์พื้นที่, งานฐานราก, โครงสร้าง, สถาปัตยกรรม, ระบบ M&E และการตกแต่งภายใน',
          inputs: ['วันเริ่มต้น-สิ้นสุดสัญญา', 'รายการหมุดหมายสำคัญ (Milestones)', 'เส้นทางวิกฤต (Critical Path)'],
          outputs: ['ตารางแผนการทำงานหลัก', 'ปฏิทินตรวจรับงานงวด'],
        },
        {
          title: '3.2 การบันทึกความคืบหน้าหน้างานรายสัปดาห์ (Weekly Physical Progress Logging)',
          description:
            'ผู้ควบคุมงานบันทึกเปอร์เซ็นต์ความคืบหน้าตามปริมาณงานจริง (% Physical Complete) แนบรูปถ่ายหน้างาน และเปรียบเทียบกับแผนงานเดิม',
          inputs: ['% งานที่ทำได้จริง', 'ภาพถ่ายความก้าวหน้า', 'จำนวนคนงานและเครื่องจักร'],
          outputs: ['ดัชนีชี้วัดความคืบหน้า (Schedule Performance Index - SPI)', 'รายงานสรุปความคืบหน้ารายสัปดาห์'],
        },
        {
          title: '3.3 การตรวจรับงานงวดและการสั่งแก้ไขงาน (Inspection & Defect Snagging)',
          description:
            'คณะกรรมการตรวจรับพัสดุบันทึกผลการตรวจสอบรายการงานตามสัญญา บันทึกจุดบกพร่อง (Defect List) และติดตามการแก้ไขก่อนอนุมัติเบิกเงิน',
          inputs: ['ผลการทดสอบวัสดุ/ระบบไฟฟ้าประปา', 'รายการ Defect ที่ต้องแก้ไข'],
          outputs: ['รายงานผลการตรวจรับงานงวด', 'ใบรับรองความสมบูรณ์ของงาน (Completion Certificate)'],
        },
        {
          title: '3.4 ระบบแจ้งเตือนปัญหาอุปสรรคและการจัดการความเสี่ยง (Issue & Risk Management)',
          description:
            'บันทึกปัจจัยที่ทำให้โครงการล่าช้า เช่น สภาพอากาศ, ปัญหาขาดแคลนแรงงาน, การปรับแก้แบบ และแนวทางการบรรเทาผลกระทบ',
          inputs: ['รายงานเหตุสุดวิสัย', 'คำขอขยายระยะเวลาสัญญา'],
          outputs: ['ทะเบียนความเสี่ยงและมาตรการแก้ไข (Risk Register)', 'บันทึกการต่อสัญญาตามระเบียบ'],
        },
      ],
      rolesInvolved: ['คณะกรรมการตรวจการจ้าง', 'ผู้ควบคุมงานก่อสร้าง', 'ตัวแทนผู้รับจ้าง/ที่ปรึกษา'],
      benefits: [
        'ทราบความล่าช้าล่วงหน้าเพื่อเข้าแก้ไขได้ทันท่วงที (Early Warning)',
        'ลดข้อพิพาทระหว่างมหาวิทยาลัยกับผู้รับจ้างด้วยหลักฐานที่เป็นระบบ',
        'ส่งมอบห้องพักที่มีคุณภาพสูง ปลอดภัยต่อบุคลากรผู้เข้าพัก',
      ],
    },
    {
      id: 'm4',
      name: 'โมดูลรายงานและแดชบอร์ดผู้บริหาร',
      enName: 'Executive Reporting & Analytics Dashboard Module',
      icon: PieIcon,
      color: 'from-violet-500 to-purple-600',
      badge: 'การตัดสินใจระดับยุทธศาสตร์ (Executive Intelligence)',
      summary:
        'สังเคราะห์ข้อมูลขนาดใหญ่จากทุกโมดูล สรุปผลแยกโครงการและแสดงผลเป็นแผนภูมิวงกลมที่เข้าใจง่าย สนับสนุนการตัดสินใจของผู้บริหารมหาวิทยาลัย',
      subFunctions: [
        {
          title: '4.1 แผนภูมิวงกลมสรุปผลแยกรายโครงการ (Project-level Budget Share Pie Chart)',
          description:
            'แสดงสัดส่วนขนาดของแต่ละโครงการเทียบกับงบประมาณรวมทั้งระบบ พร้อมการแสดงผลแบบไดนามิกที่เน้นย้ำโครงการขนาดใหญ่ที่มีความสำคัญเชิงยุทธศาสตร์',
          inputs: ['ยอดงบประมาณทุกโครงการ', 'ตัวกรองปีงบประมาณและสถานะ'],
          outputs: ['แผนภูมิวงกลมแบบ Interactive Donut/Pie Chart', 'ตารางแจกแจงเปอร์เซ็นต์และยอดเงิน'],
        },
        {
          title: '4.2 แผนภูมิวิเคราะห์เชิงพหุมิติ (Multi-dimensional Categorical Charts)',
          description:
            'สลับมุมมองแผนภูมิวงกลมได้ทันทีระหว่าง: หมวดหมู่งาน, ขั้นตอนสถานะการดำเนินงาน, โซนพื้นที่ และสัดส่วนแหล่งเงินทุน',
          inputs: ['ตัวเลือกมิติข้อมูล (Dimensions)', 'กลุ่มข้อมูลย่อย'],
          outputs: ['แผนภูมิวงกลมจำแนกสถานะ', 'แผนภูมิสัดส่วนแหล่งเงินทุน', 'แผนภูมิแบ่งตามโซนหอพัก'],
        },
        {
          title: '4.3 แผงตัวชี้วัดสุขภาพโครงการ (Project Health KPI Cards)',
          description:
            'ประมวลผลดัชนีสำคัญ: งบประมาณรวม, อัตราเบิกจ่ายสะสม, จำนวนโครงการที่อยู่ในกำหนดการ, และค่าเฉลี่ยความก้าวหน้าทางกายภาพ',
          inputs: ['ข้อมูลสดจากฐานข้อมูล Firestore', 'ตัวกรองแบบเรียลไทม์'],
          outputs: ['บัตร KPI สรุปสถานะ', 'แถบแสดงระดับความคืบหน้าสะสม'],
        },
        {
          title: '4.4 ระบบส่งออกรายงานสำหรับสภามหาวิทยาลัย (Executive Report Exporter)',
          description:
            'สร้างรายงานสรุปผลพร้อมพิมพ์ (Print-Ready) และส่งออกไฟล์ข้อมูลมาตรฐาน (CSV/Excel) สำหรับใช้ประกอบการประชุมสภาและคณะกรรมการสวัสดิการ',
          inputs: ['ช่วงเวลาและหัวข้อที่ต้องการรายงาน', 'ตัวกรองที่เลือกบนหน้าจอ'],
          outputs: ['รายงานข้อมูลโครงการแบบ CSV', 'สรุปภาพรวมผู้บริหาร (One-Page Executive Summary)'],
        },
      ],
      rolesInvolved: ['อธิการบดี / รองอธิการบดีฝ่ายบริหารและโครงสร้างพื้นฐาน', 'สภามหาวิทยาลัย', 'คณะกรรมการสวัสดิการหอพัก'],
      benefits: [
        'เห็นภาพรวมความคืบหน้าและการจัดสรรงบประมาณได้ในหน้าจอเดียว',
        'ลดเวลาในการรวบรวมข้อมูลทำรายงานประจำเดือนและรายงานประจำปี',
        'เพิ่มประสิทธิภาพในการตัดสินใจเชิงนโยบายการจัดสวัสดิการหอพักบุคลากร',
      ],
    },
  ];

  const currentModule = modules.find((m) => m.id === activeModuleId) || modules[0];
  const IconComponent = currentModule.icon;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold border border-amber-300 mb-2">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>สถาปัตยกรรมโมดูลระบบ (System Functional Modules)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-['Prompt']">
              4 โมดูลหลักของระบบวางแผนโครงการพัฒนาหอพักบุคลากร (SDNU-PPD-SYS)
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              วิเคราะห์และออกแบบตามหลักการวิเคราะห์ระบบ (System Analysis) ครอบคลุมตั้งแต่วงจรการยื่นข้อเสนอโครงการ, การบริหารจัดการงบประมาณ, การติดตามการก่อสร้างหน้างาน ไปจนถึงการสรุปผลเชิงยุทธศาสตร์บนแดชบอร์ด
            </p>
          </div>
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {modules.map((mod) => {
          const MIcon = mod.icon;
          const isActive = mod.id === activeModuleId;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModuleId(mod.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-800 shadow-lg scale-[1.02]'
                  : 'bg-white text-slate-800 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-xl ${
                    isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <MIcon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {mod.badge.split(' ')[0]}
                </span>
              </div>
              <h3 className="font-bold text-sm mb-1 line-clamp-1">{mod.name}</h3>
              <p
                className={`text-[11px] line-clamp-2 ${
                  isActive ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {mod.enName}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Module In-Depth Specification */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        {/* Module Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-md">
              <IconComponent className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 font-['Prompt']">
                  {currentModule.name}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {currentModule.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">{currentModule.enName}</p>
            </div>
          </div>
        </div>

        {/* Summary Description */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 block mb-1">วัตถุประสงค์และภาพรวมการทำงาน:</strong>
          {currentModule.summary}
        </div>

        {/* Sub-functions Detailed Breakdown */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 mb-4 font-['Prompt']">
            <Layers className="w-4 h-4 text-amber-500" />
            ฟังก์ชันย่อยในโมดูล (Sub-functions & Workflows)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentModule.subFunctions.map((sub, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-amber-300 hover:shadow-xs transition space-y-3"
              >
                <div className="font-bold text-slate-900 text-xs flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{sub.title}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pl-7">
                  {sub.description}
                </p>

                <div className="pl-7 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="font-semibold text-blue-700 block mb-0.5">ข้อมูลนำเข้า (Inputs):</span>
                    <ul className="list-disc list-inside text-slate-500 space-y-0.5">
                      {sub.inputs.map((inp, i) => (
                        <li key={i} className="truncate" title={inp}>
                          {inp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-700 block mb-0.5">ผลลัพธ์ (Outputs):</span>
                    <ul className="list-disc list-inside text-slate-500 space-y-0.5">
                      {sub.outputs.map((out, o) => (
                        <li key={o} className="truncate" title={out}>
                          {out}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roles and Benefits Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          {/* Roles */}
          <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100">
            <h5 className="font-bold text-sky-900 flex items-center gap-1.5 mb-2 font-['Prompt']">
              <UserCheck className="w-4 h-4 text-sky-600" />
              หน่วยงานและผู้มีส่วนร่วมในโมดูลนี้:
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {currentModule.rolesInvolved.map((role, rIdx) => (
                <span
                  key={rIdx}
                  className="px-2.5 py-1 bg-white text-sky-800 rounded-lg border border-sky-200 font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Value / Benefits */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <h5 className="font-bold text-emerald-900 flex items-center gap-1.5 mb-2 font-['Prompt']">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              ผลลัพธ์และคุณประโยชน์ที่ได้รับ:
            </h5>
            <ul className="space-y-1 text-emerald-800">
              {currentModule.benefits.map((ben, bIdx) => (
                <li key={bIdx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{ben}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
