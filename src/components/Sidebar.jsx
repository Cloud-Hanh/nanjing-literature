import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Clock, Map, BarChart3, Lightbulb, BookOpen, X, Menu } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { path: '/',          icon: Home,      label: '首页' },
  { path: '/timeline',  icon: Clock,     label: '文学时间轴' },
  { path: '/map',       icon: Map,       label: '文学地图' },
  { path: '/data',      icon: BarChart3, label: '数据洞察' },
  { path: '/strategies',icon: Lightbulb, label: '破局建议' },
];

function SidebarContent({ onClose }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '28px 20px 24px', borderBottom: '1px solid rgba(212,165,116,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookOpen size={22} color="#d4a574" />
          <div>
            <div style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: 15,
              fontWeight: 700,
              color: '#f0ebe3',
              lineHeight: 1.2,
            }}>
              南京·文学之都
            </div>
            <div style={{ fontSize: 10, color: 'rgba(212,165,116,0.7)', marginTop: 2 }}>
              World City of Literature
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'none', border: 'none',
              color: 'rgba(240,235,227,0.6)', cursor: 'pointer',
              display: 'flex', padding: 4,
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} end={path === '/'} onClick={onClose}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  marginBottom: 4,
                  borderLeft: isActive ? '3px solid #d4a574' : '3px solid transparent',
                  background: isActive ? 'rgba(212,165,116,0.15)' : 'transparent',
                  color: isActive ? '#d4a574' : 'rgba(240,235,227,0.65)',
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                <Icon size={16} />
                <span style={{ fontWeight: isActive ? 600 : 400 }}>{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(212,165,116,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 10, color: 'rgba(212,165,116,0.5)', lineHeight: 1.6 }}>
          <div>东南大学 · 大创项目</div>
          <div>2024 - 2025</div>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside
        className="hidden md:flex"
        style={{
          width: 220,
          minHeight: '100vh',
          background: 'var(--bg-sidebar)',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
        }}
      >
        <SidebarContent />
      </aside>

      {/* 移动端汉堡按钮 */}
      <button
        className="md:hidden"
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed',
          top: 16, left: 16,
          zIndex: 100,
          width: 42, height: 42,
          borderRadius: 10,
          background: 'var(--accent)',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        }}
      >
        <Menu size={20} />
      </button>

      {/* 移动端遮罩 */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 90,
              }}
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0,
                width: 240,
                background: 'linear-gradient(180deg, #3d2b1f, #5a3e2b)',
                zIndex: 100,
              }}
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
