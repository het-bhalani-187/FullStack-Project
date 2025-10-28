import React from "react";
import "../styles/Features.css";
import Footer from "../components/Footer";

const featuresData = [
  {
    title: "AI-Powered Legal Assistance",
    description: "Get instant legal advice with AI-driven insights. Lawyer.AI helps with research, case analysis, and document drafting, making legal work easier and more efficient.",
  },
  {
    title: "Virtual Courtroom & Consultation",
    description: "A secure, seamless, and professional virtual meeting space for lawyers and civilians to connect, discuss cases, and collaborate remotely.",
  },
  {
    title: "Legal Blog & Knowledge Hub",
    description: "A platform where experienced lawyers share insights, case studies, and legal updates to help students and professionals stay informed.",
  },
  {
    title: "Indian Penal Code (IPC) Dictionary",
    description: "A comprehensive and user-friendly legal dictionary covering all IPC sections, making it easy to reference laws and legal terms.",
  },
  {
    title: "Handcrafted Legal Dataset",
    description: "A meticulously curated dataset with over 12,000+ legal references, ensuring accurate and reliable AI-driven legal responses.",
  },
  {
    title: "24/7 Legal Support",
    description: "Get access to round-the-clock legal assistance with instant responses, ensuring help is available whenever you need it.",
  },
  {
    title: "Natural Language Understanding (NLU)",
    description: "Lawyer.AI uses advanced AI to understand and generate human-like legal conversations, providing smart and contextual responses.",
  },
  {
    title: "Secure & Private Consultations",
    description: "All legal interactions are end-to-end encrypted, ensuring complete privacy and confidentiality for clients and legal professionals.",
  },
  {
    title: "Multi-Device Accessibility",
    description: "Access Lawyer.AI on desktops, tablets, and mobile devices, ensuring a smooth legal experience anytime, anywhere.",
  },
];

const Features = () => {
  return (
    <div>
      <div className="features-background">
        <div className="features-container">
          <h1 className="features-title">Features of Lawyer.AI</h1>
          <hr className="features-divider" />
          <div className="features-list">
            {featuresData.map((feature, index) => (
              <div className="feature-item" key={index}>
                <h2>{feature.title}</h2>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Features;
