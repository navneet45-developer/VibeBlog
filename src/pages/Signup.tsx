import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('https://vibeblog-backend.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user);
        toast.success('Account created! Welcome.');
        navigate('/');
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Join the Tribe</h2>
          <p className="text-neutral-500 dark:text-neutral-400">Create an account to start writing and connecting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full pl-12 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get Started <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-neutral-500 text-sm">
          Already have an account? <Link to="/login" className="text-orange-600 font-bold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
