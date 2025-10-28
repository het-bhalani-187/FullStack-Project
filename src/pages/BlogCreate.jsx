import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/CreateBlog.css';

const BlogCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(
        'http://localhost:5000/api/blogs/create-blog',
        { title, content, author: user.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      navigate('/blog');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-page">
      <div className="create-blog-container">
        <h2 className="create-blog-title">Create New Blog Post</h2>
        {error && <div className="create-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-blog-form">
          <div className="create-form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="create-form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="10"
            ></textarea>
          </div>

          <div className="create-form-buttons">
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Blog'}
            </button>
            <button
              type="button"
              className="create-cancel-btn"
              onClick={() => navigate('/blog')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogCreate;
