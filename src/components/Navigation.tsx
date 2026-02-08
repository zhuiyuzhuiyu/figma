import { Link, useLocation } from 'react-router';
import { Swords, BarChart3, Shield, Package, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const links = [
    { path: '/solo', icon: Swords, label: '单挑模拟器' },
    { path: '/items', icon: Package, label: '装备模拟' },
    { path: '/stats', icon: BarChart3, label: '英雄属性' },
    { path: '/counter', icon: Shield, label: '克制分析' },
  ];
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-slate-900 border-b border-slate-700 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Swords className="w-8 h-8 text-red-500" />
              <span className="font-bold text-xl text-white">LOL 单挑模拟器</span>
            </Link>
            
            <div className="flex gap-1">
              {links.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path || 
                                (link.path === '/solo' && location.pathname === '/');
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="bg-slate-900 border-b border-slate-700 md:hidden">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2">
              <Swords className="w-6 h-6 text-red-500" />
              <span className="font-bold text-lg text-white">LOL 单挑</span>
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="border-t border-slate-700 pb-2">
            {links.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || 
                              (link.path === '/solo' && location.pathname === '/');
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-slate-300 active:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 md:hidden z-50">
        <div className="grid grid-cols-4">
          {links.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || 
                            (link.path === '/solo' && location.pathname === '/');
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center justify-center py-2 transition-colors ${
                  isActive
                    ? 'text-red-500'
                    : 'text-slate-400 active:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{link.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}