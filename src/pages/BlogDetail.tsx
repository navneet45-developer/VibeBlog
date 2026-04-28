import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import toast from 'react-hot-toast';
import { Calendar, Heart, MessageSquare, ArrowLeft, Send, Trash2, Edit } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

const BASE_URL = "https://vibeblog-backend.onrender.com";

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
      const res = await fetch(`${BASE_URL}/api/blogs/slug/${slug}`, {
        credentials: 'include'
      });
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
      const res = await fetch(`${BASE_URL}/api/blogs/comments/${blogId}`, {
        credentials: 'include'
      });
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
      await fetch(`${BASE_URL}/api/blogs/like/${blog._id}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }, // 🔥 ADD
  credentials: 'include'
      });
      fetchBlog();
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
      const res = await fetch(`${BASE_URL}/api/blogs/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
        const res = await fetch(`${BASE_URL}/api/blogs/${blog._id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (res.ok) {
          toast.success('Blog deleted');
          navigate('/');
        }
      } catch (err) {
        toast.error('Error deleting blog');
      }
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!blog) return null;

  const isAuthor = user?.id === blog.author?._id;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link to="/" className="flex items-center gap-2 mb-6">
        <ArrowLeft /> Back
      </Link>

      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

      {blog.image && <img src={blog.image} className="rounded mb-6" />}

      <ReactMarkdown>{blog.content}</ReactMarkdown>

      <div className="flex gap-4 mt-6">
        <button onClick={handleLike}>
          <Heart /> {blog.likes?.length || 0}
        </button>

        {(isAuthor || isAdmin) && (
          <button onClick={handleDelete}>
            <Trash2 />
          </button>
        )}
      </div>

      {/* COMMENTS */}
      <form onSubmit={handleComment} className="mt-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write comment..."
          className="w-full border p-2"
        />
        <button type="submit" className="mt-2">Post</button>
      </form>

      <div className="mt-6">
        {comments.map((c) => (
          <div key={c._id} className="border p-2 mb-2">
            <b>{c.author?.username}</b>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}