import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import toast from 'react-hot-toast';
import { Edit, Trash2, Eye, PlusCircle, LayoutDashboard, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const res = await fetch('/api/blogs/my-blogs');
      const data = await res.json();
      if (res.ok) setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Error fetching blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this story forever?')) {
      try {
        const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setBlogs(blogs.filter(b => b._id !== id));
          toast.success('Story deleted');
        }
      } catch (err) {
        toast.error('Could not delete story');
      }
    }
  };

  if (loading) return <div className="py-20 text-center uppercase tracking-widest text-xs font-bold animate-pulse">Loading Workspace...</div>;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">My Workspace</h1>
          <p className="text-neutral-500">Manage your stories, drafts, and analytics.</p>
        </div>
        <Link to="/create" className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-bold text-sm flex items-center gap-2 hover:opacity-90 shadow-xl shadow-black/10 transition-all">
          <PlusCircle className="w-5 h-5" /> Write New Story
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-tighter text-neutral-400">Total Stories</h3>
                <p className="text-3xl font-bold">{(blogs || []).length}</p>
              </div>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl">
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                Keep writing! Consistent posting helps grow your audience.
              </p>
            </div>
          </div>
        </div>

        {/* Blog List */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <LayoutDashboard className="w-5 h-5 text-orange-600" /> Recent Activity
          </h3>
          
          {(blogs || []).length > 0 ? (
            <div className="space-y-4">
              {(blogs || []).map((blog) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={blog._id} 
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl flex flex-col md:flex-row md:items-center gap-4 hover:border-orange-500/50 transition-colors group"
                >
                  <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800">
                    <img src={blog.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${blog.visibility === 'public' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                        {blog.visibility}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">{blog.category}</span>
                    </div>
                    <h4 className="font-bold text-neutral-900 dark:text-white truncate">{blog.title}</h4>
                    <p className="text-xs text-neutral-500 font-medium">Published on {new Date(blog.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3">
                    <Link to={`/blog/${blog.slug}`} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-transparent">
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link to={`/edit/${blog._id}`} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-blue-600 border border-transparent">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(blog._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors text-red-600 border border-transparent">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-3xl">
               <p className="text-neutral-400 font-bold">Your canvas is empty.</p>
               <Link to="/create" className="text-orange-600 font-bold hover:underline mt-2 inline-block">Start writing now</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
