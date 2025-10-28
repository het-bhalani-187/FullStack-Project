/* Updated Blog Edit Page - Dark Theme */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/BlogForm.css';

const BlogEdit = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const blog = response.data.data;
      if (!blog || blog.author._id !== user?._id) {
        setError('Unauthorized access');
        navigate('/blog');
        return;
      }

      setTitle(blog.title);
      setContent(blog.content);
    } catch (err) {
      setError('Failed to fetch blog');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/blog/${id}`);
    } catch (err) {
      setError('Update failed');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-blog-page">
      <div className="edit-blog-container">
        <h2 className="edit-blog-title">Edit Blog</h2>
        {error && <p className="error-message">{error}</p>}

        <form className="edit-blog-form" onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            required
          ></textarea>

          <div className="form-buttons">
            <button type="submit" className="update-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Blog'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/blog/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEdit;