import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import toast from 'react-hot-toast';
import { Calendar, User as UserIcon, Heart, MessageSquare, ArrowLeft, Send, Trash2, Edit } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export default function BlogDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blogs/slug/${slug}`);
      if (!res.ok) throw new Error('Blog not found');
      const data = await res.json();
      setBlog(data);
      fetchComments(data._id);
    } catch (err) {
      toast.error('Blog not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (blogId: string) => {
    try {
      const res = await fetch(`/api/blogs/comments/${blogId}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching comments');
    }
  };

  const handleLike = async () => {
    if (!user) return toast.error('Please login to like');
    try {
      setLiking(true);
      const res = await fetch(`/api/blogs/like/${blog._id}`, { method: 'POST' });
      const data = await res.json();
      setBlog({ ...blog, likes: Array(data.likes).fill(0) }); // Dummy update for UI
      fetchBlog(); // Refresh properly
    } catch (err) {
      toast.error('Error liking blog');
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to comment');
    if (!newComment.trim()) return;

    try {
      const res = await fetch('/api/blogs/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment, blogId: blog._id })
      });
      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment('');
        toast.success('Comment added');
      }
    } catch (err) {
      toast.error('Error adding comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const res = await fetch(`/api/blogs/${blog._id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Blog deleted');
          navigate('/');
        }
      } catch (err) {
        toast.error('Error deleting blog');
      }
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto py-20 text-center">Loading Story...</div>;
  if (!blog) return null;

  const isAuthor = user?.id === blog.author?._id;
  const isAdmin = user?.role === 'admin';

  return (
    <article className="max-w-3xl mx-auto py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to feed
      </Link>

      <header className="mb-10 text-center">
        <div className="flex justify-center mb-6">
          <span className="px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs font-bold uppercase tracking-widest rounded-full">
            {blog.category}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-neutral-500 border-y border-neutral-100 dark:border-neutral-800 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-600">
              {blog.author?.username?.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-neutral-900 dark:text-white">{blog.author?.username}</p>
              <p className="text-xs uppercase tracking-tighter">Author</p>
            </div>
          </div>
          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 hidden md:block" />
          <div className="flex items-center gap-2 text-sm uppercase tracking-tighter">
            <Calendar className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </div>
          
          {(isAuthor || isAdmin) && (
            <div className="flex gap-4 ml-auto">
              {isAuthor && (
                <Link to={`/edit/${blog._id}`} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-blue-600 transition-colors">
                  <Edit className="w-5 h-5" />
                </Link>
              )}
              <button onClick={handleDelete} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-600 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {blog.image && (
        <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl aspect-video">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-16 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 pt-12 space-y-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${
                blog.likes?.includes(user?.id) 
                ? 'bg-red-500 text-white' 
                : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${blog.likes?.includes(user?.id) ? 'fill-current' : ''}`} />
              {blog.likes?.length || 0} Likes
            </button>
            <div className="flex items-center gap-2 font-medium text-neutral-500">
              <MessageSquare className="w-5 h-5" />
              {(comments || []).length} Comments
            </div>
          </div>
        </div>

        <section className="space-y-8">
          <h3 className="text-2xl font-bold">Responses</h3>
          
          <form onSubmit={handleComment} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0 flex items-center justify-center font-bold text-neutral-600">
              {user?.username?.charAt(0) || '?'}
            </div>
            <div className="flex-1 space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts?"
                className="w-full p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none min-h-[100px] text-sm resize-none"
              />
              <button 
                type="submit"
                className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 ml-auto"
              >
                Publish <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="space-y-6 pt-8">
            {(comments || []).map((comment) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={comment._id} 
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 shrink-0 flex items-center justify-center font-bold text-neutral-500 uppercase">
                  {comment.author?.username?.charAt(0)}
                </div>
                <div className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-4 rounded-3xl text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{comment.author?.username}</span>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{comment.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </footer>
    </article>
  );
}
