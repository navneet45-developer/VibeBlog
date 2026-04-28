import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import toast from 'react-hot-toast';
import { Loader2, Image as ImageIcon, Send, ArrowLeft, Eye, Save } from 'lucide-react';
import { motion } from 'motion/react';

export default function CreateBlog({ isEdit = false }: { isEdit?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    image: '',
    visibility: 'public' as 'public' | 'private'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      fetchBlog();
    }
  }, [isEdit, id]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`https://vibeblog-backend.onrender.com/api/blogs${id}`); // Assuming id is slug for simple lookup or we fix router
      // Actually usually we'd pass ID for edit, but let's assume our API takes ID
      const data = await res.json();
      if (res.ok) {
        setFormData({
          title: data.title,
          content: data.content,
          category: data.category,
          image: data.image || '',
          visibility: data.visibility
        });
      }
    } catch (err) {
      toast.error('Could not fetch blog for editing');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = isEdit ? `/api/blogs/${id}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(isEdit ? 'Story updated!' : 'Story published!');
        navigate(`/blog/${data.slug}`);
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="py-20 text-center">Loading Story...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-8 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Cancel
      </Link>

      <form onSubmit={handleSubmit} className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <input
              type="text"
              required
              placeholder="Your Brilliant Title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none focus:ring-0 outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-700"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
              className="bg-neutral-100 dark:bg-neutral-800 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-orange-600 text-white rounded-full font-bold flex items-center gap-2 hover:bg-orange-700 disabled:opacity-50 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEdit ? <><Save className="w-5 h-5" /> Update</> : <><Send className="w-5 h-5" /> Publish</>)}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-6">
            <textarea
              required
              placeholder="Tell your story... (Supports Markdown)"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full min-h-[500px] bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-orange-500 outline-none resize-none shadow-sm text-lg leading-relaxed"
            />
          </div>

          <aside className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-600" /> Cover Image
              </h3>
              <input
                type="text"
                placeholder="Image URL..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl text-sm mb-4 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              {formData.image && (
                <div className="rounded-xl overflow-hidden aspect-video border border-neutral-100 dark:border-neutral-800">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Category</h3>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Lifestyle', 'Travel', 'Food', 'Design', 'General'].map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      formData.category === cat 
                      ? 'bg-orange-600 text-white shadow-md' 
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-6 rounded-3xl shadow-xl">
              <h4 className="font-bold flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-orange-500" /> Pro Tip
              </h4>
              <p className="text-sm opacity-80 leading-relaxed">
                Use Markdown for rich text like **bold**, *italic*, # headers, and [links](https://example.com).
              </p>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
