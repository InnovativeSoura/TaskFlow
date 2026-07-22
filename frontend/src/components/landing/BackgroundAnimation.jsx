import { motion } from "framer-motion";

const particles = [
  { size: 220, top: "6%", left: "6%", duration: 18, delay: 0 },
  { size: 170, top: "18%", right: "8%", duration: 20, delay: 1 },
  { size: 120, top: "42%", left: "18%", duration: 14, delay: 2 },
  { size: 150, bottom: "22%", right: "18%", duration: 16, delay: 3 },
  { size: 260, bottom: "8%", left: "8%", duration: 24, delay: 4 },
  { size: 110, top: "72%", right: "30%", duration: 13, delay: 5 },
  { size: 90, top: "58%", left: "65%", duration: 11, delay: 6 },
  { size: 180, bottom: "35%", right: "5%", duration: 19, delay: 7 },
];

const lines = new Array(8).fill(0);

function BackgroundAnimation() {
  return (
    <div className="background-animation">
      {/* Aurora Gradient */}

      <motion.div
        className="bg-gradient bg-gradient-1"
        animate={{
          x: [-80, 80, -80],
          y: [-40, 40, -40],
          scale: [1, 1.15, 1],
          rotate: [0, 15, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 22,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="bg-gradient bg-gradient-2"
        animate={{
          x: [70, -70, 70],
          y: [30, -30, 30],
          scale: [1.15, 1, 1.15],
          rotate: [0, -18, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 26,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="bg-gradient bg-gradient-3"
        animate={{
          y: [-40, 40, -40],
          x: [-20, 20, -20],
          scale: [1, 1.08, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut",
        }}
      />

      {/* Floating Glass Particles */}

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
            y: [-30, 30, -30],
            x: [-20, 20, -20],
            opacity: [0.12, 0.35, 0.12],
            scale: [1, 1.08, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated Light Beams */}

      <div className="background-lines">
        {lines.map((_, index) => (
          <motion.span
            key={index}
            className="light-line"
            initial={{
              opacity: 0,
              y: -250,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              y: ["-20%", "120%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 9 + index,
              delay: index * 1.2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Animated Grid */}

      <motion.div
        className="background-grid"
        animate={{
          backgroundPosition: [
            "0px 0px",
            "120px 120px",
          ],
        }}
        transition={{
          repeat: Infinity,
          duration: 35,
          ease: "linear",
        }}
      />

      {/* Center Glow */}

      <motion.div
        className="background-glow"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut",
        }}
      />

      {/* Noise Texture */}

      <div className="background-noise" />

      {/* Vignette */}

      <div className="background-vignette" />
    </div>
  );
}

export default BackgroundAnimation;