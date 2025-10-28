import React from "react";
import "../styles/AboutUs.css";
import Footer from "../components/Footer";


const AboutUs = () => {
  return (
    <div>
      <div className="about-background">
        <header className="about-header">
          <h1>About Us</h1>
        </header>
        <main className="about-container">
          <section className="about-section">
            <h2>Who We Are</h2>
            <p>
              Lawyer.AI is a pioneering platform dedicated to integrating artificial intelligence with the legal industry. 
              Our team of legal experts and AI engineers work tirelessly to make legal information accessible, accurate, and easy to understand.
            </p>
          </section>
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              We strive to bridge the gap between legal professionals and the general public. Our mission is to empower users 
              by providing AI-driven legal assistance, improving efficiency, and enhancing accessibility to legal resources.
            </p>
          </section>
          <section className="about-section">
            <h2>Our Vision</h2>
            <p>
              We envision a future where AI-driven legal assistance becomes an essential part of the legal landscape. By leveraging the power of AI, 
              we aim to revolutionize legal consultations, ensuring transparency, efficiency, and justice for all.
            </p>
          </section>
          <section className="about-section">
            <h2>Why Choose Us?</h2>
            <p>
              At Lawyer.AI, we combine cutting-edge AI technology with legal expertise to offer solutions that redefine 
              the way people interact with legal information. Our system is fast, secure, and designed for professionals and civilians alike.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
