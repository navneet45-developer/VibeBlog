import express from 'express';
import { 
  createBlog, 
  getAllPublicBlogs, 
  getMyBlogs, 
  getBlogBySlug, 
  updateBlog, 
  deleteBlog, 
  likeBlog,
  addComment,
  getCommentsByBlog
} from '../controllers/blogController.ts';
import { authenticate } from '../middleware/authMiddleware.ts';

const router = express.Router();

// Public routes
router.get('/', getAllPublicBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/comments/:blogId', getCommentsByBlog);

// Protected routes
router.post('/', authenticate, createBlog);
router.get('/my-blogs', authenticate, getMyBlogs);
router.put('/:id', authenticate, updateBlog);
router.delete('/:id', authenticate, deleteBlog);
router.post('/like/:id', authenticate, likeBlog);
router.post('/comments', authenticate, addComment);

export default router;
