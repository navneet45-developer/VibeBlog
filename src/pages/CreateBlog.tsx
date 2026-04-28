import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import toast from 'react-hot-toast';
import { Loader2, Image as ImageIcon, Send, ArrowLeft, Eye, Save } from 'lucide-react';

const BASE_URL = "https://vibeblog-backend.onrender.com";

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
    if (isEdit && id) fetchBlog();
  }, [isEdit, id]);

  // 🔥 FETCH BLOG (EDIT MODE)
  const fetchBlog = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/blogs/${id}`, {
        credentials: 'include'
      });
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
    } catch {
      toast.error('Failed to load blog');
    } finally {
      setFetching(false);
    }
  };

  // 🔥 SUBMIT BLOG (CREATE + EDIT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);

      const url = isEdit
        ? `${BASE_URL}/api/blogs/${id}`
        : `${BASE_URL}/api/blogs`;

      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',   // 🔥 FIX (VERY IMPORTANT)
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(isEdit ? "Blog updated!" : "Blog published!");
        navigate(`/blog/${data.slug}`);
      } else {
        toast.error(data.message || "Failed to publish");
      }

    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link to="/" className="flex items-center gap-2 mb-6">
        <ArrowLeft /> Cancel
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Blog Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full text-3xl font-bold outline-none"
        />

        <textarea
          placeholder="Write your blog..."
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full min-h-[300px] border p-4 rounded"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="border p-2 rounded"
        >
          <option>Technology</option>
          <option>Lifestyle</option>
          <option>Travel</option>
          <option>Food</option>
          <option>General</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 text-white px-6 py-3 rounded flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
          {isEdit ? "Update" : "Publish"}
        </button>
      </form>
    </div>
  );
}