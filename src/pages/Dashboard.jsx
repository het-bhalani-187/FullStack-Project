import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';
import { FaQuoteLeft, FaLinkedin, FaInstagram, FaAndroid, FaApple, FaLinux, FaWindows, FaSnapchat } from "react-icons/fa";
import Footer from '../components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const testimonials = [
  {
    text: "I was facing a challenging legal issue, but provided exceptional guidance and support. Their expertise not only resolved my case efficiently but also gave me peace of mind throughout the process. Highly recommend!",
    name: "Jay Soni",
    platforms: [{icon: FaAndroid, key: 'android1'}, {icon: FaApple, key: 'apple1'}],
  },
  {
    text: "I had a fantastic experience with Lawyer.AI. They were attentive, knowledgeable, and always kept me informed. Their hard work led to a successful resolution of my case. I highly recommend their services!",
    name: "Neel Patel",
    platforms: [{icon: FaAndroid, key: 'android2'}, {icon: FaSnapchat, key: 'snapchat1'}],
  },
  {
    text: "They handled my case with professionalism and care, making the entire process much easier for me. Thanks to their expertise, I achieved a favorable outcome. I highly recommend Lawyer.AI to anyone in need of legal assistance!",
    name: "Hetansh Panchal",
    platforms: [{icon: FaAndroid, key: 'android3'}, {icon: FaWindows, key: 'windows1'}],
  },
  {
    text: "I can't thank Lawyer.AI enough for their outstanding support. They were knowledgeable, responsive, and truly cared about my case. Thanks to their efforts, I received a positive outcome. I highly recommend their services!",
    name: "Himay",
    platforms: [{icon: FaAndroid, key: 'android4'}, {icon: FaLinkedin, key: 'linkedin1'}],
  },
  {
    text: "Lawyer.AI was a tremendous help during a difficult time. Their expertise and attention to detail made all the difference in my case. I'm very pleased with the outcome and would recommend them to anyone in need of legal assistance!",
    name: "Dhwanit Prajapati",
    platforms: [{icon: FaAndroid, key: 'android5'}, {icon: FaLinux, key: 'linux1'}],
  },
  {
    text: "I had a great experience with Lawyer.AI. They were professional, attentive, and guided me every step of the way. Thanks to their hard work, my case was resolved successfully. I highly recommend their services!",
    name: "Kavya Patel",
    platforms: [{icon: FaAndroid, key: 'android6'}, {icon: FaInstagram, key: 'instagram1'}],
  },
];

// const prospects = [
//   {
//     text: "Add Functionality to upload documents",
//   },
//   {
//     text: "Update Contact Us page and footer",
//   },
//   {
//     text: "Add Audio/Video Tutorials for better understanding",
//   },
//   {
//     text: "Add Memberships",
//   },
//   {
//     text: "Add Regional Language Support",
//   },
//   {
//     text: "Real time notification when government announces new laws",
//   },
// ];

const Dashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="dashboard">
      <div className="animated-bg"></div>
      <div className="main-content">
        <section className="hero">
          <h1>Get Professional Legal Advice</h1>
          <h1>Your trusted partner in legal matters.</h1>
          <div className="cta-buttons">
            <Link to="/Chatbot" className="cta-primary">Start Chat</Link>
            <Link to="/features" className="cta-primary">Features</Link> <hr/>
            <Link to="/aboutus" className="cta-primary">About Us</Link>
            <Link to="/contactus" className="cta-primary">Contact Us</Link>
          </div>
        </section>

        <center>
          <section id="testimonials" className="testimonials">
            <h2 className="text-center" data-aos="fade-up">What Our Clients Say!</h2>
            <div className="testimonial-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial" data-aos="zoom-in">
                  <FaQuoteLeft className="quote-icon" />
                  <h4>{testimonial.text}</h4>
                  <h3>{testimonial.name}</h3>
                  <p className="testimonial-platforms">
                    User Of {testimonial.platforms.map(platform => (
                      <platform.icon key={platform.key} />
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* <section id="prospects" className="prospects">
            <h2 className="text-center" data-aos="fade-up">Future Prospects</h2>
            <div className="prospect-grid">
              {prospects.map((prospect, index) => (
                <div key={index} className="prospect" data-aos="zoom-in">
                  <h4>{prospect.text}</h4>
                </div>
              ))}
            </div>
          </section> */}
        </center>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;