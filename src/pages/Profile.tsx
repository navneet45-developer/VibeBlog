import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import toast from 'react-hot-toast';
import { User as UserIcon, Mail, Shield, Save, Loader2, Camera, UserSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, avatar })
      });
      const data = await res.json();
      if (res.ok) {
        updateUser(data.user);
        toast.success('Profile updated successfully');
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xl"
      >
        <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600" />
        
        <div className="px-8 pb-8">
          <div className="flex justify-center -mt-16 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-neutral-100 dark:bg-neutral-800 border-4 border-white dark:border-neutral-900 overflow-hidden shadow-inner flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserSquare className="w-12 h-12 text-neutral-300" />
                )}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-neutral-900 text-white rounded-xl shadow-lg hover:bg-black transition-colors ring-2 ring-white dark:ring-neutral-900">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-1">{user?.username}</h1>
            <p className="text-neutral-500 font-medium">{user?.email}</p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
                <Shield className="w-3 h-3" /> {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 ml-1 text-neutral-600 dark:text-neutral-400">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 ml-1 text-neutral-600 dark:text-neutral-400">Avatar URL</label>
                <div className="relative">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={avatar}
                    placeholder="https://example.com/avatar.jpg"
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 ml-1 text-neutral-600 dark:text-neutral-400">Email Address (Read-only)</label>
                <div className="relative opacity-60">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 bg-neutral-100 dark:bg-neutral-900 border-none rounded-2xl cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
