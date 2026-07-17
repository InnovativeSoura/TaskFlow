import { motion } from "framer-motion";

const particles = [
  {
    size: 120,
    top: "8%",
    left: "10%",
    delay: 0,
    duration: 10,
  },
  {
    size: 180,
    top: "18%",
    right: "8%",
    delay: 1,
    duration: 12,
  },
  {
    size: 80,
    top: "45%",
    left: "18%",
    delay: 2,
    duration: 9,
  },
  {
    size: 140,
    bottom: "12%",
    left: "10%",
    delay: 3,
    duration: 11,
  },
  {
    size: 220,
    bottom: "6%",
    right: "12%",
    delay: 4,
    duration: 14,
  },
  {
    size: 90,
    top: "65%",
    right: "28%",
    delay: 5,
    duration: 8,
  },
];

function BackgroundAnimation() {
  return (
    <div className="background-animation">

      {/* Gradient Blobs */}

      <motion.div
        className="bg-gradient bg-gradient-1"
        animate={{
          x: [-40, 40, -40],
          y: [-20, 20, -20],
          scale: [1, 1.1, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 14,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="bg-gradient bg-gradient-2"
        animate={{
          x: [30, -30, 30],
          y: [20, -20, 20],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="bg-gradient bg-gradient-3"
        animate={{
          y: [-25, 25, -25],
          rotate: [0, 20, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut",
        }}
      />

      {/* Floating Circles */}

      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="floating-particle"
          style={{
            width: particle.size,
            height: particle.size,
            top: particle.top,
            bottom: particle.bottom,
            left: particle.left,
            right: particle.right,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{
            repeat: Infinity,
            delay: particle.delay,
            duration: particle.duration,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Grid Overlay */}

      <div className="background-grid" />

      {/* Glow */}

      <div className="background-glow" />

    </div>
  );
}

export default BackgroundAnimation;