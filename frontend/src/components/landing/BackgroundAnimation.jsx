import React from "react";
import "./BackgroundAnimation.css";

const BackgroundAnimation = () => {
  return (
    <div className="background-animation" aria-hidden="true">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="bg-orb bg-orb-4" />

      <div className="glass-bubble glass-bubble-1" />
      <div className="glass-bubble glass-bubble-2" />
      <div className="glass-bubble glass-bubble-3" />
      <div className="glass-bubble glass-bubble-4" />

      <div className="background-grid" />

      <div className="background-noise" />
    </div>
  );
};

export default BackgroundAnimation;
