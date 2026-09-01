import React from "react";
import {
  FaArrowRight,
  FaPlay,
  FaCheckCircle,
  FaUsers,
  FaChartLine,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";

import "../../styles/Auth.css";

const HeroSection = () => {
  const benefits = [
    "Free Forever Plan",
    "No Credit Card",
    "2 Minute Setup",
    "Cloud Sync Included",
  ];

  const stats = [
    {
      icon: <FaUsers />,
      value: "10K+",
      label: "Teams",
    },
    {
      icon: <FaChartLine />,
      value: "50K+",
      label: "Tasks Managed",
    },
    {
      icon: <FaShieldAlt />,
      value: "99.9%",
      label: "Secure",
    },
    {
      icon: <FaRocket />,
      value: "24/7",
      label: "Support",
    },
  ];

  const scrollToFeatures = () => {
    const target = document.getElementById("features");

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="auth-hero">
      <div className="auth-hero-badge">
        <span className="badge-dot"></span>

        <span>Next Generation Project Management</span>

        <FaArrowRight />
      </div>

      <h1 className="auth-hero-title">
        <span className="title-white">Manage Projects.</span>

        <span className="title-gradient">Collaborate Faster.</span>

        <span className="title-white">Deliver On Time.</span>
      </h1>

      <p className="auth-hero-description">
        TaskFlow is an all-in-one project management platform built for modern
        teams. Plan projects, assign tasks, monitor progress and collaborate in
        real time — all from one intelligent workspace.
      </p>

      <div className="auth-hero-actions">
        <button
          type="button"
          className="hero-primary-button"
          onClick={() => {
            const authCard = document.querySelector(".auth-card");

            if (authCard) {
              authCard.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }}
        >
          <span>Start Free</span>
          <FaArrowRight />
        </button>

        <button
          type="button"
          className="hero-secondary-button"
          onClick={scrollToFeatures}
        >
          <span className="play-icon">
            <FaPlay />
          </span>

          <span>Explore Features</span>
        </button>
      </div>

      <div className="auth-benefits">
        {benefits.map((benefit) => (
          <div className="auth-benefit" key={benefit}>
            <FaCheckCircle />
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      <div className="auth-stats">
        {stats.map((stat) => (
          <div className="auth-stat" key={stat.label}>
            <div className="auth-stat-icon">{stat.icon}</div>

            <div className="auth-stat-content">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
