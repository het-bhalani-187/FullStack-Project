import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/BlogDetail.css';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      if (response.data.status === 'success' && response.data.data) {
        setBlog(response.data.data);
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Blog post not found');
      } else {
        setError('Failed to fetch blog post. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.status === 'success') {
          navigate('/blog');
        } else {
          throw new Error(response.data.message || 'Failed to delete blog post');
        }
      } catch (err) {
        setError(err.message || 'Failed to delete blog post');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!blog) return <div className="error">Blog not found</div>;

  const isAuthor = user && blog.author && user._id === blog.author._id;
  const authorName = blog.author ? blog.author.name : 'Unknown Author';

  return (
    <div className="blog-detail-page">
      <div className="blog-detail">
        <h1>{blog.title}</h1>
        <div className="blog-detail-meta">
          <p>By: {authorName}</p>
          <p>Created: {formatDate(blog.createdAt)}</p>
        </div>
        <div className="blog-detail-content">
          {blog.content}
        </div>

        <div className="blog-actions">
          <Link to="/blog" className="back-button">Back to Blogs</Link>

          {isAuthor && (
            <>
              <Link to={`/blog/edit/${id}`} className="edit-button">Edit Blog</Link>
              <button onClick={handleDelete} className="delete-button">Delete Blog</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
