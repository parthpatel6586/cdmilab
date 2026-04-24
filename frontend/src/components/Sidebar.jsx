import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Monitor, Settings, LogOut, Database, Clock } from 'lucide-react';

const Sidebar = ({ logout }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Lab Management', icon: <Database size={20} />, path: '/labs' },
    { name: 'Student Management', icon: <Users size={20} />, path: '/students' },
    { name: 'Manage Batches', icon: <Clock size={20} />, path: '/batches' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold text-green-400 border-b border-gray-800">
        CDMI Lab
      </div>
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 hover:bg-gray-800 transition-colors ${
                isActive ? 'bg-gray-800 border-r-4 border-green-500 text-green-400' : 'text-gray-400'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-6 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors w-full text-left"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
