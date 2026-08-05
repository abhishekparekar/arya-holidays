import { useState } from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
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
  MessageSquare
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  
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

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-dark-800 border-r border-dark-700 z-40 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-dark-700">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Arya Cline</h1>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto">
            <Mountain className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                  : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-dark-700">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-xl transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <main 
        className={`transition-all duration-300 ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
