import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory, ProjectStatus, FundingSource } from '../types/project';
import { Sparkles, Building, Coins, Calendar, MapPin, CheckCircle, X } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Omit<Project, 'id'>, id?: string) => Promise<void>;
  editProject: Project | null;
}

const CATEGORIES: ProjectCategory[] = [
  'ปรับปรุงและซ่อมบำรุง',
  'ภูมิทัศน์และสิ่งแวดล้อม',
  'ความปลอดภัยและสมาร์ทดอร์ม',
];

const STATUSES: ProjectStatus[] = [
  'ศึกษาความเหมาะสม (Feasibility)',
  'ออกแบบและประเมิณราคา (Cost Estimation)',
  'เสนอขออนุมัติงบประมาณ (Proposed)',
  'จัดทำราคากลาง (Reference Price)',
  'เสนอราคาจากผู้รับจ้าง (Quotation)',
  'จัดซื้อจัดจ้าง (Procurement)',
  'กำลังก่อสร้าง/ปรับปรุง (In Progress)',
  'ตรวจรับ/ส่งมอบแล้ว (Completed)',
  'ชะลอการดำเนินการ (On Hold)',
  'ไม่ได้รับอนุมัติงบประมาณ (Budget was not approved)',
];

const FUNDING_SOURCES: FundingSource[] = [
  'งปม.รายได้หอพักบุคลากร',
  'งปม.แผ่นดิน',
  'งปม.รายได้',
  'งปม.อื่นๆ',
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editProject,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('ปรับปรุงและซ่อมบำรุง');
  const [location, setLocation] = useState('อาคาร มน.นิเวศ');
  const [fiscalYear, setFiscalYear] = useState<number>(2568);
  const [budget, setBudget] = useState<number>(10000000);
  const [disbursedBudget, setDisbursedBudget] = useState<number>(0);
  const [fundingSource, setFundingSource] = useState<FundingSource>('งปม.รายได้หอพักบุคลากร');
  const [status, setStatus] = useState<ProjectStatus>('ศึกษาความเหมาะสม (Feasibility)');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [targetStartDate, setTargetStartDate] = useState('');
  const [targetEndDate, setTargetEndDate] = useState('');
  const [responsibleUnit, setResponsibleUnit] = useState('งานจัดการหอพักบุคกลากร กองอาคารสถานที่');
  const [contractor, setContractor] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editProject) {
      setCode(editProject.code);
      setName(editProject.name);
      setCategory(editProject.category);
      setLocation(editProject.location || 'อาคาร มน.นิเวศ');
      setFiscalYear(editProject.fiscalYear);
      setBudget(editProject.budget);
      setDisbursedBudget(editProject.disbursedBudget || 0);
      setFundingSource(editProject.fundingSource || 'งปม.รายได้หอพักบุคลากร');
      setStatus(editProject.status);
      setProgressPercent(editProject.progressPercent || 0);
      setTargetStartDate(editProject.targetStartDate || '');
      setTargetEndDate(editProject.targetEndDate || '');
      setResponsibleUnit(editProject.responsibleUnit || 'งานจัดการหอพักบุคกลากร กองอาคารสถานที่');
      setContractor(editProject.contractor || '');
      setDescription(editProject.description || '');
    } else {
      // Default reset
      setCode(`SDNU-${new Date().getFullYear() + 543 - 2500}-${Math.floor(10 + Math.random() * 90)}`);
      setName('');
      setCategory('ปรับปรุงและซ่อมบำรุง');
      setLocation('อาคาร มน.นิเวศ');
      setFiscalYear(2568);
      setBudget(15000000);
      setDisbursedBudget(0);
      setFundingSource('งปม.รายได้หอพักบุคลากร');
      setStatus('ศึกษาความเหมาะสม (Feasibility)');
      setProgressPercent(0);
      setTargetStartDate('');
      setTargetEndDate('');
      setResponsibleUnit('งานจัดการหอพักบุคกลากร กองอาคารสถานที่');
      setContractor('');
      setDescription('');
    }
    setError('');
  }, [editProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('กรุณาระบุชื่อโครงการ');
      return;
    }
    if (budget < 0) {
      setError('งบประมาณต้องไม่ต่ำกว่า 0');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave(
        {
          code: code.trim(),
          name: name.trim(),
          category,
          location: location.trim() || 'อาคาร มน.นิเวศ',
          fiscalYear: Number(fiscalYear),
          budget: Number(budget),
          disbursedBudget: Number(disbursedBudget),
          fundingSource,
          status,
          progressPercent: Number(progressPercent),
          targetStartDate,
          targetEndDate,
          responsibleUnit: (responsibleUnit.trim() || 'งานจัดการหอพักบุคกลากร กองอาคารสถานที่'),
          contractor: contractor.trim(),
          description: description.trim(),
        },
        editProject ? editProject.id : undefined
      );
      onClose();
    } catch (err: any) {
      setError(err?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Prompt']">
                {editProject ? 'แก้ไขข้อมูลโครงการ' : 'เพิ่มโครงการพัฒนาหอพักบุคลากรใหม่'}
              </h3>
              <p className="text-xs text-slate-500">
                ระบบวางแผนโครงการพัฒนาหอพักบุคลากร (SDNU-PPD-SYS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Row 1: Code and Fiscal Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                รหัสโครงการ (Project Code) *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ปีงบประมาณ พ.ศ. (กรอกข้อมูลเอง) *
              </label>
              <input
                type="number"
                min="2500"
                max="2650"
                value={fiscalYear || ''}
                onChange={(e) => setFiscalYear(Number(e.target.value))}
                placeholder="เช่น 2568"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                หมวดหมู่งาน *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ชื่อโครงการพัฒนาหอพักบุคลากร *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ระบุชื่อโครงการอย่างชัดเจน เช่น โครงการก่อสร้าง..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              required
            />
          </div>

          {/* Row 3: Location & Funding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">
                  พื้นที่ดำเนินงาน (Location / Zone) *
                </label>
                <span className="text-[10px] text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded font-medium">
                  ใส่ข้อมูลเพิ่มเติมได้
                </span>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="เช่น อาคาร มน.นิเวศ ชั้น 2, ห้องพักอาจารย์"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                แหล่งที่มาของเงินทุน *
              </label>
              <select
                value={fundingSource}
                onChange={(e) => setFundingSource(e.target.value as FundingSource)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {FUNDING_SOURCES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Budget & Disbursed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                งบประมาณที่ได้รับอนุมัติ (บาท) *
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                งบประมาณที่เบิกจ่ายแล้ว (บาท)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={disbursedBudget}
                onChange={(e) => setDisbursedBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-emerald-700 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Row 5: Status & Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                สถานะการดำเนินงานโครงการ *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">
                  ความคืบหน้ารวม ({progressPercent}%)
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercent}
                onChange={(e) => setProgressPercent(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Row 6: Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                วันที่เริ่มต้นตามแผน
              </label>
              <input
                type="date"
                value={targetStartDate}
                onChange={(e) => setTargetStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                วันที่สิ้นสุดตามแผน
              </label>
              <input
                type="date"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Row 7: Unit & Contractor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                หน่วยงานรับผิดชอบ
              </label>
              <input
                type="text"
                value={responsibleUnit}
                onChange={(e) => setResponsibleUnit(e.target.value)}
                placeholder="งานจัดการหอพักบุคกลากร กองอาคารสถานที่"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ผู้รับจ้าง/คู่สัญญา (ถ้ามี)
              </label>
              <input
                type="text"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                placeholder="เช่น บริษัท นเรศวรคอนสตรัคชั่น จำกัด"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Row 8: Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              วัตถุประสงค์และขอบเขตงาน
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุรายละเอียดโครงการ วัตถุประสงค์ ผลลัพธ์ที่คาดหวัง..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4 text-slate-950" />
              <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูลโครงการ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
