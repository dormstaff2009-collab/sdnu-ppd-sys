import React, { useState, useMemo } from 'react';
import { Project, PieChartSlice, UserRole } from '../types/project';
import { PieChart } from './PieChart';
import {
  Coins,
  TrendingUp,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface DashboardViewProps {
  projects: Project[];
  role: UserRole;
  onNavigateToTable: () => void;
  onOpenAddModal?: () => void;
}

// Visual color palettes for the pie charts
const PROJECT_COLORS = [
  '#0284c7', // Sky Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#84cc16', // Lime
];

const CATEGORY_COLORS: Record<string, string> = {
  'ปรับปรุงและซ่อมบำรุง': '#0284c7',
  'ภูมิทัศน์และสิ่งแวดล้อม': '#10b981',
  'ความปลอดภัยและสมาร์ทดอร์ม': '#8b5cf6',
  'พัฒนาระบบจัดการหอพักบุคลากร': '#f59e0b',
};

const STATUS_COLORS: Record<string, string> = {
  'ศึกษาความเหมาะสม (Feasibility)': '#0ea5e9',
  'ออกแบบและประเมิณราคา (Cost Estimation)': '#0d9488',
  'เสนอขออนุมัติงบประมาณ (Proposed)': '#6366f1',
  'จัดทำราคากลาง (Reference Price)': '#d97706',
  'เสนอราคาจากผู้รับจ้าง (Quotation)': '#ea580c',
  'จัดซื้อจัดจ้าง (Procurement)': '#f59e0b',
  'กำลังก่อสร้าง/ปรับปรุง (In Progress)': '#2563eb',
  'ตรวจรับ/ส่งมอบแล้ว (Completed)': '#10b981',
  'ชะลอการดำเนินการ (On Hold)': '#ef4444',
  'ไม่ได้รับอนุมัติงบประมาณ (Budget was not approved)': '#64748b',
};

const FUNDING_COLORS: Record<string, string> = {
  'งปม.รายได้หอพักบุคลากร': '#0d9488',
  'งปม.แผ่นดิน': '#1e3a8a',
  'งปม.รายได้': '#b45309',
  'งปม.อื่นๆ': '#6d28d9',
  'ไม่ใช้งบประมาณ': '#64748b',
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  role,
  onNavigateToTable,
  onOpenAddModal,
}) => {
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<string>('all');
  const [chartDimension, setChartDimension] = useState<'project' | 'category' | 'status' | 'funding'>('project');

  // Filter projects by fiscal year
  const filteredProjects = useMemo(() => {
    if (selectedFiscalYear === 'all') return projects;
    return projects.filter((p) => p.fiscalYear.toString() === selectedFiscalYear);
  }, [projects, selectedFiscalYear]);

  // Available fiscal years
  const fiscalYears = useMemo(() => {
    const years = Array.from(new Set(projects.map((p) => p.fiscalYear))).sort((a, b) => a - b);
    return years;
  }, [projects]);

  // KPI Calculations
  const totalBudget = useMemo(
    () => filteredProjects.reduce((acc, p) => acc + (p.budget || 0), 0),
    [filteredProjects]
  );

  const totalDisbursed = useMemo(
    () => filteredProjects.reduce((acc, p) => acc + (p.disbursedBudget || 0), 0),
    [filteredProjects]
  );

  const disbursementRate = totalBudget > 0 ? (totalDisbursed / totalBudget) * 100 : 0;

  const averageProgress = useMemo(() => {
    if (filteredProjects.length === 0) return 0;
    const sum = filteredProjects.reduce((acc, p) => acc + (p.progressPercent || 0), 0);
    return Math.round(sum / filteredProjects.length);
  }, [filteredProjects]);

  const activeProjectsCount = filteredProjects.filter(
    (p) => p.status === 'กำลังก่อสร้าง/ปรับปรุง (In Progress)' || p.status === 'จัดซื้อจัดจ้าง (Procurement)'
  ).length;

  const completedProjectsCount = filteredProjects.filter(
    (p) => p.status === 'ตรวจรับ/ส่งมอบแล้ว (Completed)'
  ).length;

  // Chart Slices Data: 1. By Project (Budget share)
  const projectSlices: PieChartSlice[] = useMemo(() => {
    return filteredProjects.map((p, idx) => ({
      label: p.code ? `${p.code} - ${p.name.slice(0, 32)}...` : p.name,
      value: p.budget || 0,
      count: 1,
      color: PROJECT_COLORS[idx % PROJECT_COLORS.length],
      percent: totalBudget > 0 ? ((p.budget || 0) / totalBudget) * 100 : 0,
    }));
  }, [filteredProjects, totalBudget]);

  // Chart Slices Data: 2. By Category (Budget share)
  const categorySlices: PieChartSlice[] = useMemo(() => {
    const groups: Record<string, { budget: number; count: number }> = {};
    filteredProjects.forEach((p) => {
      const cat = p.category || 'อื่นๆ';
      if (!groups[cat]) groups[cat] = { budget: 0, count: 0 };
      groups[cat].budget += p.budget || 0;
      groups[cat].count += 1;
    });

    return Object.entries(groups).map(([cat, val], idx) => ({
      label: cat,
      value: val.budget,
      count: val.count,
      color: CATEGORY_COLORS[cat] || PROJECT_COLORS[idx % PROJECT_COLORS.length],
      percent: totalBudget > 0 ? (val.budget / totalBudget) * 100 : 0,
    }));
  }, [filteredProjects, totalBudget]);

  // Chart Slices Data: 3. By Status (Project count)
  const statusSlices: PieChartSlice[] = useMemo(() => {
    const groups: Record<string, number> = {};
    filteredProjects.forEach((p) => {
      const st = p.status || 'อื่นๆ';
      groups[st] = (groups[st] || 0) + 1;
    });

    return Object.entries(groups).map(([st, count], idx) => ({
      label: st,
      value: count,
      count: count,
      color: STATUS_COLORS[st] || PROJECT_COLORS[idx % PROJECT_COLORS.length],
      percent: filteredProjects.length > 0 ? (count / filteredProjects.length) * 100 : 0,
    }));
  }, [filteredProjects]);

  // Chart Slices Data: 4. By Funding Source (Budget share)
  const fundingSlices: PieChartSlice[] = useMemo(() => {
    const groups: Record<string, { budget: number; count: number }> = {};
    filteredProjects.forEach((p) => {
      const fund = p.fundingSource || 'อื่นๆ';
      if (!groups[fund]) groups[fund] = { budget: 0, count: 0 };
      groups[fund].budget += p.budget || 0;
      groups[fund].count += 1;
    });

    return Object.entries(groups).map(([fund, val], idx) => ({
      label: fund,
      value: val.budget,
      count: val.count,
      color: FUNDING_COLORS[fund] || PROJECT_COLORS[idx % PROJECT_COLORS.length],
      percent: totalBudget > 0 ? (val.budget / totalBudget) * 100 : 0,
    }));
  }, [filteredProjects, totalBudget]);

  const formatBaht = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toLocaleString('th-TH', { maximumFractionDigits: 2 })} ล้านบาท`;
    }
    return `${num.toLocaleString('th-TH')} บาท`;
  };

  return (
    <div className="space-y-6">
      {/* Role Notice & Welcome Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
        role === 'admin'
          ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30'
          : 'bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent border-sky-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            role === 'admin' ? 'bg-amber-500 text-slate-950' : 'bg-sky-600 text-white'
          }`}>
            {role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                {role === 'admin' ? 'โหมดผู้ดูแลระบบ (Admin) - สิทธิ์เต็ม' : 'โหมดผู้ใช้งานทั่วไป (Viewer) - สิทธิ์ดูอย่างเดียว (Read-only)'}
              </h2>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
              }`}>
                {role === 'admin' ? 'Full Control' : 'Read-Only Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {role === 'admin'
                ? 'ท่านสามารถเพิ่ม, แก้ไข, ลบโครงการ, อัปเดตสถานะความก้าวหน้า และจัดการงบประมาณได้อย่างอิสระ'
                : 'ระบบแสดงเฉพาะข้อมูลแดชบอร์ด แผนภูมิวงกลม และตารางรายการโครงการ โดยซ่อนปุ่มเพิ่ม/แก้ไข/ลบตามนโยบายความปลอดภัย'}
            </p>
          </div>
        </div>

        {/* Action Controls for Admin */}
        <div className="flex items-center gap-2">
          {role === 'admin' && onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>+ เพิ่มโครงการใหม่</span>
            </button>
          )}
          <button
            onClick={onNavigateToTable}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-xl text-xs shadow-xs transition"
          >
            <span>ดูตารางรายการ</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">กรองข้อมูลปีงบประมาณ:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedFiscalYear('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                selectedFiscalYear === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ทุกปีงบประมาณ ({projects.length})
            </button>
            {fiscalYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedFiscalYear(yr.toString())}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedFiscalYear === yr.toString()
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ปี พ.ศ. {yr} ({projects.filter((p) => p.fiscalYear === yr).length})
              </button>
            ))}
          </div>
        </div>

        {/* Chart View Dimension Selector */}
        <div className="flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-slate-700">มุมมองแผนภูมิวงกลมหลัก:</span>
          <select
            value={chartDimension}
            onChange={(e) => setChartDimension(e.target.value as any)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="project">สัดส่วนงบประมาณแยกตามแต่ละโครงการ (By Project)</option>
            <option value="category">สัดส่วนงบประมาณแยกตามหมวดหมู่งาน (By Category)</option>
            <option value="status">สัดส่วนโครงการแยกตามสถานะการดำเนินงาน (By Status)</option>
            <option value="funding">สัดส่วนงบประมาณแยกตามแหล่งเงินทุน (By Funding)</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              งบประมาณรวมทั้งสิ้น
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-['Prompt']">
            {formatBaht(totalBudget)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>ทั้งหมด {filteredProjects.length} โครงการ</span>
            <span className="text-blue-600 font-semibold font-mono">100% กรอบวงเงิน</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-blue-500/5 rounded-full pointer-events-none" />
        </div>

        {/* Disbursed Budget Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              เบิกจ่ายแล้วจริง
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 font-['Prompt']">
            {formatBaht(totalDisbursed)}
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>อัตราการเบิกจ่าย</span>
              <span className="font-bold text-emerald-600 font-mono">{disbursementRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(disbursementRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Active Projects Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              โครงการที่กำลังดำเนินการ
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 font-['Prompt']">
            {activeProjectsCount} <span className="text-sm font-normal text-slate-500">โครงการ</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>ก่อสร้าง/จัดซื้อจัดจ้าง</span>
            <span className="text-amber-700 font-semibold">
              ส่งมอบแล้ว {completedProjectsCount} รายการ
            </span>
          </div>
        </div>

        {/* Physical Progress Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              ความก้าวหน้าเฉลี่ย
            </span>
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-violet-600 font-['Prompt']">
            {averageProgress}%
          </div>
          <div className="mt-2">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-violet-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${averageProgress}%` }}
              />
            </div>
            <div className="mt-1.5 text-right text-[11px] text-slate-400">
              คำนวณจากทุกโครงการในมุมมอง
            </div>
          </div>
        </div>
      </div>

      {/* Primary Highlight Pie Chart: สรุปผลแยกโครงการ (Project Budget Breakdown Pie Chart) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-amber-500 rounded-full" />
            <h2 className="text-lg font-bold text-slate-900 font-['Prompt']">
              การสรุปผลและแสดงแผนภูมิวงกลม (Executive Pie Charts)
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            ชี้ที่ชิ้นแผนภูมิหรือรายการเพื่อดูเปอร์เซ็นต์และยอดเงิน
          </span>
        </div>

        {/* Two-Column Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: สรุปผลแยกตามแต่ละโครงการ (ตามคำขอหลัก) */}
          <PieChart
            title="1. สัดส่วนงบประมาณแยกตามโครงการ (Project Share)"
            subtitle="เปรียบเทียบขนาดวงเงินงบประมาณที่จัดสรรให้แก่แต่ละโครงการพัฒนาหอพักบุคลากร"
            data={projectSlices}
            isCurrency={true}
            donut={true}
            size={290}
          />

          {/* Chart 2: สัดส่วนงบประมาณแยกตามหมวดหมู่งาน */}
          <PieChart
            title="2. สัดส่วนงบประมาณแยกตามหมวดหมู่งาน (Category Share)"
            subtitle="การกระจายตัวของงบประมาณตามลักษณะงาน เช่น ก่อสร้างใหม่, ปรับปรุง, โซลาร์รูฟท็อป, ระบบอัจฉริยะ"
            data={categorySlices}
            isCurrency={true}
            donut={true}
            size={290}
          />
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 3: สัดส่วนตามสถานะโครงการ */}
          <PieChart
            title="3. สัดส่วนสถานะการดำเนินงานโครงการ (Status Distribution)"
            subtitle="จำแนกจำนวนโครงการตามแต่ละขั้นตอนของวงจรการพัฒนาหอพักบุคลากร"
            data={statusSlices}
            isCurrency={false}
            donut={true}
            size={270}
          />

          {/* Chart 4: สัดส่วนตามแหล่งเงินทุน */}
          <PieChart
            title="4. สัดส่วนงบประมาณแยกตามแหล่งเงินทุน (Funding Source)"
            subtitle="สัดส่วนที่มาจากงบประมาณแผ่นดิน, เงินรายได้มหาวิทยาลัย และกองทุนสวัสดิการหอพัก"
            data={fundingSlices}
            isCurrency={true}
            donut={true}
            size={270}
          />
        </div>
      </div>

      {/* Quick Summary Project Highlights Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base font-['Prompt']">
              สรุปรายการโครงการพัฒนาหอพักบุคลากรเด่น (Key Projects Summary)
            </h3>
            <p className="text-xs text-slate-500">
              แสดงภาพรวมงบประมาณและเปอร์เซ็นต์ความคืบหน้ารายโครงการ
            </p>
          </div>
          <button
            onClick={onNavigateToTable}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            เปิดตารางข้อมูลฉบับเต็ม ({projects.length} รายการ) &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">รหัส</th>
                <th className="py-3 px-4">ชื่อโครงการ</th>
                <th className="py-3 px-4">หมวดหมู่</th>
                <th className="py-3 px-4 text-center">ปีงบ</th>
                <th className="py-3 px-4 text-right">งบประมาณจัดสรร</th>
                <th className="py-3 px-4 text-center">ความคืบหน้า</th>
                <th className="py-3 px-4">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.slice(0, 5).map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {project.code}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate" title={project.name}>
                    {project.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                      {project.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    {project.fiscalYear}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                    {formatBaht(project.budget)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-slate-700">
                        {project.progressPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block whitespace-nowrap"
                      style={{
                        backgroundColor: `${STATUS_COLORS[project.status] || '#64748b'}18`,
                        color: STATUS_COLORS[project.status] || '#475569',
                      }}
                    >
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
