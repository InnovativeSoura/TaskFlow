// src/components/landing/BackgroundAnimation.jsx

import React from "react";
import "./BackgroundAnimation.css";

const BackgroundAnimation = () => {
  return (
    <div
      className="background-animation"
      aria-hidden="true"
    >
      {/* Main glow orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="bg-orb bg-orb-4" />

      {/* Glass bubbles */}
      <div className="glass-bubble glass-bubble-1" />
      <div className="glass-bubble glass-bubble-2" />
      <div className="glass-bubble glass-bubble-3" />
      <div className="glass-bubble glass-bubble-4" />

      {/* Grid */}
      <div className="background-grid" />

      {/* Noise */}
      <div className="background-noise" />
    </div>
  );
};

export default BackgroundAnimation;