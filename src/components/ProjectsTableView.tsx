import React, { useState, useMemo } from 'react';
import { Project, UserRole, ProjectStatus } from '../types/project';
import {
  Search,
  Filter,
  Download,
  Plus,
  Pencil,
  Trash2,
  Eye,
  ShieldCheck,
  ShieldAlert,
  ArrowUpDown,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';

interface ProjectsTableViewProps {
  projects: Project[];
  role: UserRole;
  onOpenAddModal: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  onQuickUpdateStatus: (projectId: string, newStatus: ProjectStatus) => void;
}

export const ProjectsTableView: React.FC<ProjectsTableViewProps> = ({
  projects,
  role,
  onOpenAddModal,
  onEditProject,
  onDeleteProject,
  onQuickUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'budget' | 'fiscalYear' | 'progress' | 'code'>('fiscalYear');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewDetailProject, setViewDetailProject] = useState<Project | null>(null);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.contractor && p.contractor.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.responsibleUnit && p.responsibleUnit.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesYear = selectedYear === 'all' || p.fiscalYear.toString() === selectedYear;
        const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

        return matchesSearch && matchesYear && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        const valA: any = sortBy === 'progress' ? a.progressPercent : a[sortBy as keyof Project];
        const valB: any = sortBy === 'progress' ? b.progressPercent : b[sortBy as keyof Project];

        if (typeof valA === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
      });
  }, [projects, searchTerm, selectedYear, selectedStatus, selectedCategory, sortBy, sortOrder]);

  const toggleSort = (field: 'budget' | 'fiscalYear' | 'progress' | 'code') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'รหัสโครงการ',
      'ชื่อโครงการ',
      'หมวดหมู่',
      'พื้นที่ดำเนินงาน',
      'ปีงบประมาณ',
      'งบประมาณจัดสรร (บาท)',
      'เบิกจ่ายแล้ว (บาท)',
      'ความคืบหน้า (%)',
      'สถานะ',
      'แหล่งเงินทุน',
      'หน่วยงานรับผิดชอบ',
      'ผู้รับจ้าง/คู่สัญญา',
    ];

    const rows = filteredProjects.map((p) => [
      `"${p.code}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.location.replace(/"/g, '""')}"`,
      p.fiscalYear,
      p.budget,
      p.disbursedBudget,
      p.progressPercent,
      `"${p.status}"`,
      `"${p.fundingSource}"`,
      `"${(p.responsibleUnit || '').replace(/"/g, '""')}"`,
      `"${(p.contractor || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SDNU_Projects_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatBaht = (val: number) => {
    return val.toLocaleString('th-TH');
  };

  // Unique lists for filter options
  const years = Array.from(new Set(projects.map((p) => p.fiscalYear))).sort((a, b) => a - b);
  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const statuses: ProjectStatus[] = [
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

  return (
    <div className="space-y-6">
      {/* Role State Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${
              role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
            }`}
          >
            {role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 font-['Prompt']">
                ตารางทะเบียนโครงการพัฒนาหอพักบุคลากร (Master Projects Registry)
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  role === 'admin'
                    ? 'bg-amber-500/10 text-amber-700 border border-amber-300'
                    : 'bg-sky-500/10 text-sky-700 border border-sky-300'
                }`}
              >
                {role === 'admin' ? 'สิทธิ์ Admin (เพิ่ม/แก้ไข/ลบ ได้)' : 'สิทธิ์ Viewer (Read-only ซ่อนปุ่มแก้ไข)'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              พบ {filteredProjects.length} จากทั้งหมด {projects.length} โครงการ
            </p>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            title="ส่งออกรายงานในรูปแบบ CSV"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก CSV</span>
          </button>

          {/* Admin-only Add Button */}
          {role === 'admin' ? (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>เพิ่มโครงการใหม่</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs rounded-xl flex items-center gap-1 border border-slate-200">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              <span>โหมดอ่านอย่างเดียว (ซ่อนปุ่มจัดการ)</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, รหัส, พื้นที่, ผู้รับจ้าง..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="all">ทุกปีงบประมาณ</option>
              {years.map((y) => (
                <option key={y} value={y.toString()}>
                  ปีงบประมาณ พ.ศ. {y}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="all">ทุกหมวดหมู่งาน</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="all">ทุกสถานะการดำเนินงาน</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] font-semibold text-slate-600 tracking-wider">
              <tr>
                <th
                  onClick={() => toggleSort('code')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>รหัสโครงการ</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 min-w-[220px]">ชื่อโครงการ / หมวดหมู่งาน</th>
                <th className="py-3.5 px-4 min-w-[160px]">พื้นที่ดำเนินงาน</th>
                <th
                  onClick={() => toggleSort('fiscalYear')}
                  className="py-3.5 px-4 text-center cursor-pointer hover:bg-slate-100 transition whitespace-nowrap"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>ปีงบ</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('budget')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100 transition whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>งบประมาณ (บาท)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('progress')}
                  className="py-3.5 px-4 text-center cursor-pointer hover:bg-slate-100 transition whitespace-nowrap"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>ความก้าวหน้า</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 whitespace-nowrap">สถานะการดำเนินงาน</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    ไม่พบโครงการที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {project.code}
                    </td>

                    {/* Name & Category */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 line-clamp-1" title={project.name}>
                        {project.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {project.category}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          แหล่ง: {project.fundingSource}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-1 text-slate-700">
                        <MapPin className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2 text-xs">{project.location}</span>
                      </div>
                    </td>

                    {/* Fiscal Year */}
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">
                      พ.ศ. {project.fiscalYear}
                    </td>

                    {/* Budget & Disbursed */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-slate-900">
                        {formatBaht(project.budget)}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-mono mt-0.5">
                        เบิกแล้ว: {formatBaht(project.disbursedBudget)}
                      </div>
                    </td>

                    {/* Progress */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              project.progressPercent >= 100
                                ? 'bg-emerald-500'
                                : project.progressPercent > 50
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${project.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-[11px] text-slate-800">
                          {project.progressPercent}%
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {role === 'admin' ? (
                        <select
                          value={project.status}
                          onChange={(e) => onQuickUpdateStatus(project.id, e.target.value as ProjectStatus)}
                          className="text-[11px] font-semibold bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-800 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                            project.status.includes('Completed')
                              ? 'bg-emerald-100 text-emerald-800'
                              : project.status.includes('Progress')
                              ? 'bg-blue-100 text-blue-800'
                              : project.status.includes('Procurement')
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {project.status}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewDetailProject(project)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="ดูรายละเอียดฉบับเต็ม"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Admin-only edit & delete */}
                        {role === 'admin' && (
                          <>
                            <button
                              onClick={() => onEditProject(project)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition"
                              title="แก้ไขข้อมูลโครงการ"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteProject(project)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition"
                              title="ลบโครงการ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Detail Modal (Available for both Admin & Viewer) */}
      {viewDetailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {viewDetailProject.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-['Prompt']">
                  {viewDetailProject.name}
                </h3>
              </div>
              <button
                onClick={() => setViewDetailProject(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">หมวดหมู่งาน</span>
                <span className="font-semibold text-slate-800">{viewDetailProject.category}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">พื้นที่ดำเนินงาน</span>
                <span className="font-semibold text-slate-800">{viewDetailProject.location}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">ปีงบประมาณ</span>
                <span className="font-semibold text-slate-800">พ.ศ. {viewDetailProject.fiscalYear}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">แหล่งเงินทุน</span>
                <span className="font-semibold text-slate-800">{viewDetailProject.fundingSource}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">งบประมาณจัดสรร</span>
                <span className="font-bold text-blue-700 text-sm font-mono">
                  {formatBaht(viewDetailProject.budget)} บาท
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">เบิกจ่ายแล้วจริง</span>
                <span className="font-bold text-emerald-700 text-sm font-mono">
                  {formatBaht(viewDetailProject.disbursedBudget)} บาท
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">ความก้าวหน้าโครงการ</span>
                <span className="font-bold font-mono text-amber-600">{viewDetailProject.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-2.5 rounded-full"
                  style={{ width: `${viewDetailProject.progressPercent}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-500 flex justify-between">
                <span>สถานะ: <strong>{viewDetailProject.status}</strong></span>
                {viewDetailProject.targetStartDate && (
                  <span>ระยะเวลา: {viewDetailProject.targetStartDate} ถึง {viewDetailProject.targetEndDate || '-'}</span>
                )}
              </div>
            </div>

            {/* Units & Description */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block mb-1">หน่วยงานรับผิดชอบ:</span>
                <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {viewDetailProject.responsibleUnit || '-'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1">ผู้รับจ้าง/คู่สัญญา (ถ้ามี):</span>
                <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {viewDetailProject.contractor || 'ยังไม่มีคู่สัญญา'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1">รายละเอียดและขอบเขตงาน:</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {viewDetailProject.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewDetailProject(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
