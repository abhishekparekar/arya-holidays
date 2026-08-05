import { useState, useEffect } from 'react';
import { NavLink, useLocation, Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Mountain, 
  Calendar, 
  Users, 
  Image, 
  Star, 
  ChevronLeft,
  ChevronRight,
  Phone,
  Briefcase,
  MessageSquare,
  Menu,
  X,
  Globe,
  LogOut
} from 'lucide-react';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/trips', icon: Mountain, label: 'Trips' },
  { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { path: '/admin/categories', icon: Star, label: 'Categories' },
  { path: '/admin/testimonials', icon: Users, label: 'Testimonials' },
  { path: '/admin/gallery', icon: Image, label: 'Gallery' },
  { path: '/admin/contact', icon: Phone, label: 'Contact Info' },
  { path: '/admin/travel-services', icon: Briefcase, label: 'Travel Services' },
  { path: '/admin/queries', icon: MessageSquare, label: 'Queries' },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col lg:flex-row font-inter">

      {/* ================= MOBILE HEADER ================= */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#111111] border-b border-[#222222] px-4 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/arya.png" alt="Arya Holidays" className="h-8 w-auto object-contain bg-white/90 p-1 rounded-md" />
          <div>
            <span className="text-xs font-bold text-white block leading-tight">Arya Holidays</span>
            <span className="text-[9px] text-[#F5B301] font-semibold block">Admin Panel</span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-white hover:text-[#F5B301] transition-colors rounded-lg bg-[#222222]"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ================= MOBILE SLIDE-OUT DRAWER ================= */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`lg:hidden fixed top-14 left-0 bottom-0 z-40 w-64 bg-[#111111] border-r border-[#222222] transition-transform duration-300 flex flex-col justify-between ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-[#F5B301] text-[#111111] font-bold shadow-md' 
                    : 'text-gray-300 hover:bg-[#222222] hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#222222]">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#222222] rounded-xl transition-all"
          >
            <Globe size={16} />
            <span>View Public Website</span>
          </Link>
        </div>
      </aside>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-screen bg-[#111111] border-r border-[#222222] z-40 transition-all duration-300 flex-col justify-between ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#222222]">
          {!collapsed ? (
            <Link to="/admin" className="flex items-center gap-3">
              <img src="/arya.png" alt="Arya Holidays" className="h-9 w-auto object-contain bg-white/90 p-1 rounded-md" />
              <div>
                <h1 className="text-white font-bold text-sm leading-tight">Arya Holidays</h1>
                <p className="text-[#F5B301] text-[10px] font-semibold">Admin Panel</p>
              </div>
            </Link>
          ) : (
            <Link to="/admin" className="mx-auto">
              <img src="/arya.png" alt="Arya Holidays" className="h-8 w-auto object-contain bg-white/90 p-1 rounded-md" />
            </Link>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-[#F5B301] text-[#111111] font-bold shadow-md' 
                    : 'text-gray-300 hover:bg-[#222222] hover:text-white'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#222222] space-y-1">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#222222] rounded-xl transition-all ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title={collapsed ? 'View Website' : undefined}
          >
            <Globe size={16} />
            {!collapsed && <span>View Website</span>}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#222222] rounded-xl transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main
        className={`flex-1 transition-all duration-300 pt-14 lg:pt-0 ${
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
