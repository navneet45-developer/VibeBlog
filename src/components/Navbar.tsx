import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Sun, Moon, LogOut, User, PlusCircle, LayoutDashboard, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
            Vibe<span className="text-orange-600">Blog</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5 text-neutral-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2 md:gap-4">
                <Link
                  to="/create"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-sm font-medium transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Write
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1 rounded-full border border-neutral-200 dark:border-neutral-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase">
                        {user.username.charAt(0)}
                      </div>
                    )}
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> My Blogs
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                        <Settings className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <div className="h-px bg-neutral-100 dark:border-neutral-800 my-1 mx-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-4 font-medium text-sm">
                <Link to="/login" className="hover:text-orange-600 transition-colors">Sign in</Link>
                <Link to="/signup" className="px-5 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full hover:opacity-90 transition-opacity">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
