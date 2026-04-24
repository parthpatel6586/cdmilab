import React from 'react';
import { User } from 'lucide-react';

const Header = ({ admin }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">Welcome Back, {admin?.username}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{admin?.username}</p>
          <p className="text-xs text-gray-500 uppercase">{admin?.role}</p>
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

export default Header;
