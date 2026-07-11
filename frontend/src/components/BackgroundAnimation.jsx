import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const BackgroundAnimation = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },

        background: {
          color: {
            value: "#050816",
          },
        },

        fpsLimit: 120,

        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
            },
          },

          color: {
            value: [
              "#7c4dff",
              "#3b82f6",
              "#06b6d4",
              "#ffffff",
            ],
          },

          links: {
            enable: true,
            color: "#7c4dff",
            distance: 150,
            opacity: 0.3,
            width: 1,
          },

          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "bounce",
            },
          },

          opacity: {
            value: 0.6,
          },

          size: {
            value: {
              min: 1,
              max: 4,
            },
          },
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },

            onClick: {
              enable: true,
              mode: "push",
            },

            resize: {
              enable: true,
            },
          },

          modes: {
            grab: {
              distance: 180,
              links: {
                opacity: 0.7,
              },
            },

            push: {
              quantity: 4,
            },
          },
        },

        detectRetina: true,
      }}
    />
  );
};

export default BackgroundAnimation;