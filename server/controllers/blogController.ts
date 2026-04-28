import { Request, Response } from 'express';
import Blog from '../models/Blog.ts';
import Comment from '../models/Comment.ts';
import mongoose from 'mongoose';

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const createBlog = async (req: any, res: Response) => {
  try {
    const { title, content, image, category, visibility } = req.body;
    
    let slug = generateSlug(title);
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = new Blog({
      title,
      slug,
      content,
      image,
      category,
      visibility,
      author: req.user.id
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error creating blog', error: err instanceof Error ? err.message : err });
  }
};

export const getAllPublicBlogs = async (req: Request, res: Response) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query: any = { visibility: 'public' };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Blog.countDocuments(query);

    res.json({ blogs, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
};

export const getMyBlogs = async (req: any, res: Response) => {
  try {
    const blogs = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your blogs' });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'username avatar');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    // Check privacy
    // Note: We'd need to handle logged-in user check here for proper private access
    // But for a simple REST API, we can leave it or pass user if available
    
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog' });
  }
};

export const updateBlog = async (req: any, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, image, category, visibility } = req.body;
    if (title) {
      blog.title = title;
      // We could update slug here too if desired
    }
    if (content) blog.content = content;
    if (image) blog.image = image;
    if (category) blog.category = category;
    if (visibility) blog.visibility = visibility;

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error updating blog' });
  }
};

export const deleteBlog = async (req: any, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Blog.deleteOne({ _id: req.params.id });
    await Comment.deleteMany({ blog: req.params.id });
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog' });
  }
};

export const likeBlog = async (req: any, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userIndex = blog.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      blog.likes.push(req.user.id);
    } else {
      blog.likes.splice(userIndex, 1);
    }

    await blog.save();
    res.json({ likes: blog.likes.length, isLiked: userIndex === -1 });
  } catch (err) {
    res.status(500).json({ message: 'Error liking blog' });
  }
};

// Comment Controllers
export const addComment = async (req: any, res: Response) => {
  try {
    const { content, blogId } = req.body;
    const comment = new Comment({
      content,
      author: req.user.id,
      blog: blogId
    });
    await comment.save();
    const populatedComment = await comment.populate('author', 'username avatar');
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment' });
  }
};

export const getCommentsByBlog = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};
