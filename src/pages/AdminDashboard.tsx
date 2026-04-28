import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import toast from 'react-hot-toast';
import { Shield, Users, FileText, Trash2, Search, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'users' | 'blogs'>('blogs');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uRes, bRes] = await Promise.all([
        fetch('/api/auth/users'),
        fetch('/api/blogs')
      ]);
      const uData = await uRes.json();
      const bData = await bRes.json();
      setUsers(Array.isArray(uData) ? uData : []);
      setBlogs(bData.blogs || []);
    } catch (err) {
      toast.error('Error fetching administrative data');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (window.confirm('ADMIN: Delete this blog permanently?')) {
      try {
        const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setBlogs(blogs.filter(b => b._id !== id));
          toast.success('Blog removed by administrator');
        }
      } catch (err) {
        toast.error('Admin deletion failed');
      }
    }
  };

  if (loading) return <div className="py-20 text-center uppercase tracking-widest text-xs font-bold">Accessing Secure Vault...</div>;

  return (
    <div className="space-y-10">
      <header className="flex items-center gap-4 py-8 border-b border-neutral-100 dark:border-neutral-800">
        <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Control</h1>
          <p className="text-neutral-500 font-medium tracking-wide flex items-center gap-2">
            System Overseer <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </p>
        </div>
      </header>

      <div className="flex gap-4 p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-2xl w-fit">
        <button
          onClick={() => setTab('blogs')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'blogs' ? 'bg-white dark:bg-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
        >
          <FileText className="w-4 h-4" /> All Blogs ({(blogs || []).length})
        </button>
        <button
          onClick={() => setTab('users')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'users' ? 'bg-white dark:bg-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
        >
          <Users className="w-4 h-4" /> Registered Users ({(users || []).length})
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {tab === 'blogs' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Content</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Author</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                {(blogs || []).map((blog) => (
                  <tr key={blog._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden">
                          <img src={blog.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="font-bold text-sm truncate max-w-[200px]">{blog.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{blog.author?.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${blog.visibility === 'public' ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-neutral-500 bg-neutral-50 dark:bg-neutral-800'}`}>
                        {blog.visibility}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-400 font-bold">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteBlog(blog._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-400">User</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Role</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-400 text-right">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                {(users || []).map((u) => (
                  <tr key={u._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-200 flex items-center justify-center font-bold text-xs">
                          {u.username.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{u.username}</p>
                          <p className="text-[10px] text-neutral-400 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${u.role === 'admin' ? 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'text-neutral-500 bg-neutral-50 dark:bg-neutral-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-400 font-bold">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <code className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md text-neutral-500">{u._id}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
