// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import { Link, useNavigate } from "react-router-dom"; 
// // import BlogModal from './BlogModal'; // Import the modal component
// import "../styles/Blog.css"; 

// const API_BASE_URL = 'http://localhost:5000';

// const BlogCard = ({ title, description, author, date, id }) => (
//   <div className="blog-card">
//     <div className="blog-content">
//       <h3 className="blog-title">{title}</h3>
//       <p className="blog-description">{description}</p>
//       <div className="blog-meta">
//         <span>By {author}</span>
//         <span>{date}</span>
//       </div>
//       <Link to={`/blog/${id}`} className="read-more">Read More</Link>
//     </div>
//   </div>
// );

// const Blog = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         setError(null);
//         const token = localStorage.getItem('token');
        
//         if (!token) {
//           setError('Please log in to view blogs');
//           navigate('/login');
//           return;
//         }

//         const response = await axios.get(`${API_BASE_URL}/api/blogs`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (response.data.status === 'success') {
//           setBlogs(response.data.data || []);
//         } else {
//           throw new Error(response.data.message || 'Failed to fetch blogs');
//         }
//       } catch (err) {
//         console.error('Error fetching blogs:', err);
        
//         if (err.response?.status === 401) {
//           setError('Your session has expired. Please log in again.');
//           logout();
//           navigate('/login');
//           return;
//         }

//         if (err.response?.status === 403) {
//           setError('Please verify your email to access blogs.');
//           return;
//         }

//         setError(err.response?.data?.message || 'Failed to fetch blogs. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchBlogs();
//     } else {
//       setError('Please log in to view blogs');
//       setLoading(false);
//     }
//   }, [user, logout, navigate]);

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const filteredBlogs = blogs.filter(blog => 
//     blog.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="blog-page">
//       {user?.role === 'lawyer' && (
//         <div className="create-blog-section">
//           <Link to="/blog/create" className="create-blog-button">Create New Blog</Link>
//         </div>
//       )}
      
//       <div className="search-bar">
//         <input 
//           type="text" 
//           placeholder="Search blogs by title..." 
//           value={searchQuery} 
//           onChange={(e) => setSearchQuery(e.target.value)} 
//         />
//       </div>

//       <div className="blog-container">
//         <div className="blogs-grid">
//           {filteredBlogs.length > 0 ? (
//             filteredBlogs.map((blog) => (
//               <BlogCard
//                 key={blog._id}
//                 id={blog._id}
//                 title={blog.title}
//                 description={blog.content.substring(0, 150) + '...'}
//                 author={blog.author?.name || 'Unknown Author'}
//                 date={formatDate(blog.createdAt)}
//               />
//             ))
//           ) : (
//             <div className="no-blogs-message">No blogs found.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Blog;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Blog.css";

const API_BASE_URL = 'http://localhost:5000';

const BlogCard = ({ title, description, author, date, id }) => (
  <div className="blog-card">
    <div className="blog-content">
      <h3 className="blog-title">{title}</h3>
      <p className="blog-description">{description}</p>
      <div className="blog-meta">
        <span>By {author}</span>
        <span>{date}</span>
      </div>
      <Link to={`/blog/${id}`} className="read-more">Read More</Link>
    </div>
  </div>
);

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const blogsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Please log in to view blogs');
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/blogs`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          setBlogs(response.data.data || []);
        } else {
          throw new Error(response.data.message || 'Failed to fetch blogs');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          logout();
          navigate('/login');
        } else if (err.response?.status === 403) {
          setError('Please verify your email to access blogs.');
        } else {
          setError('Failed to fetch blogs. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBlogs();
    } else {
      setError('Please log in to view blogs');
      setLoading(false);
    }
  }, [user, logout, navigate]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIdx = (currentPage - 1) * blogsPerPage;
  const visibleBlogs = filteredBlogs.slice(startIdx, startIdx + blogsPerPage);

  return (
    <div className="blog-page">
      {(user?.role === 'lawyer' || user?.role === 'law_student') && (
        <div className="blog-header">
          {user?.role === 'lawyer' && (
            <Link to="/blog/create" className="create-blog-button">Create New Blog</Link>
          )}
          <input
            type="text"
            className="search-input"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="blog-container">
          <div className="blogs-grid slide-animation">
            {visibleBlogs.length > 0 ? (
              visibleBlogs.map(blog => (
                <BlogCard
                  key={blog._id}
                  id={blog._id}
                  title={blog.title}
                  description={blog.content.substring(0, 150) + '...'}
                  author={blog.author?.name || 'Unknown Author'}
                  date={formatDate(blog.createdAt)}
                />
              ))
            ) : (
              <div className="no-blogs">No blogs found.</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;