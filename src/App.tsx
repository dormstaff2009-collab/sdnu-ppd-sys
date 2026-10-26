import React, { useState, useEffect } from 'react';
import { Project, UserSession, UserRole, ProjectStatus } from './types/project';
import { INITIAL_PROJECTS } from './data/initialData';
import {
  subscribeToProjects,
  seedInitialProjectsIfEmpty,
  addProjectToFirestore,
  updateProjectInFirestore,
  deleteProjectFromFirestore,
  testConnection
} from './services/firebase';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ProjectsTableView } from './components/ProjectsTableView';
import { ProjectModal } from './components/ProjectModal';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Building2,
  RefreshCw,
  Sparkles,
  Database
} from 'lucide-react';

export default function App() {
  // Navigation tab state (แดชบอร์ด & ตารางโครงการ)
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'table'>('dashboard');

  // User session state: Default to Admin per prompt credentials so user can test all features right away
  const [userSession, setUserSession] = useState<UserSession>({
    username: 'adminsdnu',
    role: 'admin',
    displayName: 'ผู้ดูแลระบบ (Admin) - เจ้าของ/ผู้บริหารสูงสุด',
    loginTime: new Date().toLocaleTimeString('th-TH'),
  });

  // Projects state initialized with rich default projects
  const [projects, setProjects] = useState<Project[]>(() => {
    return INITIAL_PROJECTS.map((item, index) => ({
      ...item,
      id: `init-${index + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Project | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Connect to Firestore and sync real-time data
  useEffect(() => {
    let isMounted = true;

    async function initFirestore() {
      try {
        await testConnection();
        // Seed initial data if Firestore collection is empty
        await seedInitialProjectsIfEmpty();
      } catch (err) {
        console.warn('Firestore initial boot note:', err);
      }
    }

    initFirestore();

    // Attach real-time subscription
    const unsubscribe = subscribeToProjects(
      (updatedItems) => {
        if (!isMounted) return;
        if (updatedItems && updatedItems.length > 0) {
          setProjects(updatedItems);
        }
      },
      (err) => {
        console.warn('Real-time sync notice, keeping local active state:', err);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Handle Login / Role Switch
  const handleLogin = (role: UserRole, username: string) => {
    if (role === 'admin') {
      setUserSession({
        username: 'adminsdnu',
        role: 'admin',
        displayName: 'ผู้ดูแลระบบ (Admin) - เจ้าของ/ผู้บริหารสูงสุด',
        loginTime: new Date().toLocaleTimeString('th-TH'),
      });
      showToast('เข้าสู่ระบบในฐานะ ผู้ดูแลระบบ (Admin) สำเร็จ - เข้าถึงได้ทุกฟังก์ชัน', 'success');
    } else {
      setUserSession({
        username: 'viewer',
        role: 'viewer',
        displayName: 'ผู้ใช้งานทั่วไป (Viewer) - Read-only',
        loginTime: new Date().toLocaleTimeString('th-TH'),
      });
      showToast('สลับเข้าสู่โหมด ผู้ใช้งานทั่วไป (Viewer) - ซ่อนปุ่มจัดการโครงการ', 'info');
    }
  };

  const handleLogout = () => {
    setUserSession({
      username: 'viewer',
      role: 'viewer',
      displayName: 'ผู้ใช้งานทั่วไป (Viewer) - Read-only',
      loginTime: new Date().toLocaleTimeString('th-TH'),
    });
    showToast('ออกจากระบบแล้ว - เปลี่ยนเป็นสิทธิ์ Viewer (Read-only)', 'info');
  };

  // Create or Update Project
  const handleSaveProject = async (projectData: Omit<Project, 'id'>, id?: string) => {
    if (userSession.role !== 'admin') {
      showToast('ไม่มีสิทธิ์ดำเนินการ: เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น', 'error');
      return;
    }

    try {
      if (id && !id.startsWith('init-')) {
        // Update in Firestore
        await updateProjectInFirestore(id, projectData);
      } else if (id && id.startsWith('init-')) {
        // Update local initialized item
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...projectData, updatedAt: new Date().toISOString() } : p))
        );
      } else {
        // Add new project
        try {
          const newId = await addProjectToFirestore(projectData);
          if (newId) {
            setProjects((prev) => [
              { ...projectData, id: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
              ...prev,
            ]);
          }
        } catch {
          // Local fallback
          const fallbackId = `proj-${Date.now()}`;
          setProjects((prev) => [
            { ...projectData, id: fallbackId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            ...prev,
          ]);
        }
      }
      showToast(id ? 'บันทึกการแก้ไขโครงการสำเร็จ' : 'เพิ่มโครงการพัฒนาหอพักใหม่สำเร็จ', 'success');
    } catch (error) {
      console.error('Error saving project:', error);
      showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    }
  };

  // Quick Status Update
  const handleQuickUpdateStatus = async (projectId: string, newStatus: ProjectStatus) => {
    if (userSession.role !== 'admin') {
      showToast('ไม่มีสิทธิ์ดำเนินการ: เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น', 'error');
      return;
    }

    try {
      if (!projectId.startsWith('init-')) {
        await updateProjectInFirestore(projectId, { status: newStatus });
      }
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus, updatedAt: new Date().toISOString() } : p))
      );
      showToast(`อัปเดตสถานะเป็น "${newStatus}" เรียบร้อยแล้ว`, 'success');
    } catch (err) {
      console.error(err);
      showToast('ไม่สามารถอัปเดตสถานะได้', 'error');
    }
  };

  // Delete Project Confirmation
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    if (userSession.role !== 'admin') {
      showToast('ไม่มีสิทธิ์ลบข้อมูล: เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น', 'error');
      setDeleteCandidate(null);
      return;
    }

    try {
      if (!deleteCandidate.id.startsWith('init-')) {
        await deleteProjectFromFirestore(deleteCandidate.id);
      }
      setProjects((prev) => prev.filter((p) => p.id !== deleteCandidate.id));
      showToast(`ลบโครงการ "${deleteCandidate.code}" ออกจากระบบแล้ว`, 'info');
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการลบโครงการ', 'error');
    } finally {
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-['Sarabun',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-bounce transition-all">
          <div
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 border ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : toastMessage.type === 'info'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-red-600 text-white border-red-500'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-200" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-300" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userSession={userSession}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            projects={projects}
            role={userSession.role}
            onNavigateToTable={() => setCurrentTab('table')}
            onOpenAddModal={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
          />
        )}

        {currentTab === 'table' && (
          <ProjectsTableView
            projects={projects}
            role={userSession.role}
            onOpenAddModal={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
            onEditProject={(proj) => {
              setEditingProject(proj);
              setIsModalOpen(true);
            }}
            onDeleteProject={(proj) => setDeleteCandidate(proj)}
            onQuickUpdateStatus={handleQuickUpdateStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-800 font-['Prompt']">
              Staff Dormitory Nu Development Planning System (SDNU-PPD-SYS)
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>ฐานข้อมูล Firestore: <strong className="font-mono text-slate-600">sdnu-ppd-sys</strong></span>
            <span>•</span>
            <span>บทบาท: System Analyst & Software Architect</span>
            <span>•</span>
            <span>มหาวิทยาลัยนเรศวร</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        editProject={editingProject}
      />

      {/* Delete Confirmation Dialog */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="p-2.5 rounded-xl bg-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-['Prompt']">
                  ยืนยันการลบโครงการ
                </h3>
                <p className="text-xs text-slate-500">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 leading-relaxed">
              ท่านต้องการลบโครงการ <strong className="text-slate-900">[{deleteCandidate.code}] {deleteCandidate.name}</strong> ออกจากระบบวางแผนโครงการพัฒนาหอพักบุคลากรใช่หรือไม่?
            </p>

            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
