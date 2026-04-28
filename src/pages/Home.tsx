import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User as UserIcon, Tag, Heart, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Design', 'General'];

  useEffect(() => {
    fetchBlogs();
  }, [category]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const url = `/api/blogs?category=${category}&search=${search}`;
      const res = await fetch(url);
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs();
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent rounded-3xl overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto px-4 z-10 relative"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Share your <span className="italic text-orange-600">stories</span> with the world.
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed">
            The minimal platform for writers and readers. Explore trending stories, tech insights, and lifestyle tips.
          </p>
          
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto p-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full shadow-lg group focus-within:ring-2 focus-within:ring-orange-500/50 transition-all">
            <div className="flex-1 flex items-center pl-4">
              <Search className="w-5 h-5 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search stories..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 px-3 outline-none"
              />
            </div>
            <button type="submit" className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90">
              Search
            </button>
          </form>
        </motion.div>
      </section>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setCategory('')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!category ? 'bg-orange-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
        >
          All Stories
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-orange-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="animate-pulse space-y-4">
              <div className="aspect-[16/10] bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
              <div className="h-4 w-1/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(blogs || []).length > 0 ? (blogs || []).map((blog, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={blog._id}
              className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <Link to={`/blog/${blog.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                <img 
                  src={blog.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} 
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-900 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                    {blog.category}
                  </span>
                </div>
              </Link>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold text-xs uppercase">
                    {blog.author?.username?.charAt(0) || blog.author?.username}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{blog.author?.username}</span>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-1 uppercase tracking-tight">
                      <Calendar className="w-3 h-3" /> {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Link to={`/blog/${blog.slug}`}>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>
                
                <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3 mb-6">
                  {blog.content.substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <Heart className="w-4 h-4" /> {blog.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <MessageSquare className="w-4 h-4" /> Comments
                    </span>
                  </div>
                  <Link to={`/blog/${blog.slug}`} className="text-sm font-bold text-neutral-900 dark:text-white hover:underline underline-offset-4">
                    Read Story
                  </Link>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-20 text-center text-neutral-500">
              No blogs found. Start by writing one!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
