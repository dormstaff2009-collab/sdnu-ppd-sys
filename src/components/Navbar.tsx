import React, { useState } from 'react';
import { UserSession } from '../types/project';
import {
  Building2,
  ShieldAlert,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  LayoutDashboard,
  TableProperties,
  Layers,
  FileCode2,
  Database,
  Lock
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'table';
  onSelectTab: (tab: 'dashboard' | 'table') => void;
  userSession: UserSession;
  onLogin: (role: 'admin' | 'viewer', username: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userSession,
  onLogin,
  onLogout,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('adminsdnu');
  const [loginPassword, setLoginPassword] = useState('nustaff2009');
  const [loginError, setLoginError] = useState('');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername.trim() === 'adminsdnu' && loginPassword === 'nustaff2009') {
      onLogin('admin', 'adminsdnu');
      setShowLoginModal(false);
      setLoginError('');
    } else {
      setLoginError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (User: adminsdnu / Pass: nustaff2009)');
    }
  };

  const handleSwitchToViewer = () => {
    onLogin('viewer', 'guest_viewer');
    setShowLoginModal(false);
    setLoginError('');
  };

  return (
    <>
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        {/* Top Announcement & System Status Bar */}
        <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">
              Staff Dormitory Nu Development Planning System
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">ระบบวางแผนโครงการพัฒนาหอพักบุคลากร มหาวิทยาลัยนเรศวร</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
              <Database className="w-3 h-3 text-amber-400" />
              Firebase Project: <strong className="font-mono text-white">sdnu-ppd-sys</strong>
            </span>

            {/* Current Role Banner */}
            {userSession.role === 'admin' ? (
              <span className="inline-flex items-center gap-1 text-[11px] bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-medium">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                สิทธิ์: ผู้ดูแลระบบ (Admin)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] bg-sky-500/10 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-500/30 font-medium">
                <ShieldAlert className="w-3 h-3 text-sky-400" />
                สิทธิ์: ผู้ใช้งานทั่วไป (Viewer - Read-only)
              </span>
            )}
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/20">
                <Building2 className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-tight text-lg text-white font-['Prompt']">
                    SDNU-PPD-SYS
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    V1.0 Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                  หอพักบุคลากร มหาวิทยาลัยนเรศวร
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex space-x-1">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                แดชบอร์ด & แผนภูมิวงกลม
              </button>

              <button
                onClick={() => onSelectTab('table')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'table'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <TableProperties className="w-4 h-4" />
                ตารางรายการโครงการ
              </button>
            </nav>

            {/* Auth / Role Switcher Action */}
            <div className="flex items-center gap-3">
              {userSession.role === 'admin' ? (
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-amber-400 flex items-center justify-end gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {userSession.displayName}
                    </div>
                    <div className="text-[10px] text-slate-400">สิทธิ์ผู้ดูแลระบบสูงสุด</div>
                  </div>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                    title="สลับสิทธิ์การใช้งาน"
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>สลับสิทธิ์</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 transition"
                    title="ออกจากระบบ"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-sky-400 flex items-center justify-end gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {userSession.displayName}
                    </div>
                    <div className="text-[10px] text-slate-400">โหมดดูอย่างเดียว (Read-only)</div>
                  </div>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow transition"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-950" />
                    <span>เข้าสู่ระบบ Admin</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden border-t border-slate-800 px-2 py-2 flex justify-around bg-slate-950">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 rounded text-xs ${
              currentTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            แดชบอร์ด
          </button>
          <button
            onClick={() => onSelectTab('table')}
            className={`flex flex-col items-center py-1 px-4 rounded text-xs ${
              currentTab === 'table' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <TableProperties className="w-4 h-4 mb-0.5" />
            ตารางโครงการ
          </button>
        </div>
      </header>

      {/* Role Management / Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">ระบบจัดการสิทธิ์ผู้ใช้งาน (User Roles)</h3>
                  <p className="text-xs text-slate-500">เลือกสิทธิ์เข้าใช้งานตามที่กำหนดในข้อกำหนดระบบ</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Presets Notice */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
              <div className="font-semibold text-slate-700 flex items-center gap-1">
                <span>🔐 ข้อมูลบัญชีผู้ใช้ตามข้อกำหนดโครงการ:</span>
              </div>
              <div className="text-slate-600">
                • <strong>Admin (สิทธิ์เต็ม):</strong> User = <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono">adminsdnu</code> | Pass = <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono">nustaff2009</code>
              </div>
              <div className="text-slate-600">
                • <strong>Viewer (Read-only):</strong> สิทธิ์ดูแดชบอร์ด แผนภูมิวงกลม และตารางโครงการเท่านั้น (ซ่อนปุ่มเพิ่ม/แก้/ลบ)
              </div>
            </div>

            {loginError && (
              <div className="mt-3 p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleAdminSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อผู้ใช้ (Username)
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="adminsdnu"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  รหัสผ่าน (Password)
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold rounded-lg text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  เข้าสู่ระบบในฐานะ ผู้ดูแลระบบ (Admin)
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-2 text-slate-400 text-[11px]">หรือ</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  type="button"
                  onClick={handleSwitchToViewer}
                  className="w-full py-2 px-4 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-semibold rounded-lg text-xs transition flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-sky-600" />
                  สลับใช้งานในฐานะ ผู้ใช้งานทั่วไป (Viewer - Read-only)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
