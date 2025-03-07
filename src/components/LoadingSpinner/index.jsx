import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingSpinner = ({ message = "Carregando..." }) => {
  // Array de cores para o gradiente e partículas
  const colors = {
    primary: "#4f46e5", // Indigo
    secondary: "#8b5cf6", // Violet
    accent: "#0ea5e9", // Sky Blue
    highlight: "#f97316", // Orange
    success: "#10b981", // Emerald
  };

  // Variante para animação de texto
  const textVariants = {
    animate: {
      opacity: [0, 1],
      transition: {
        times: [0, 1],
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop com blur e gradiente */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-black/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Círculo central com gradiente */}
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center z-10 shadow-lg shadow-indigo-500/30"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 2, 0, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="text-white font-bold text-3xl"
            animate={{
              textShadow: [
                "0 0 5px rgba(255,255,255,0.5)",
                "0 0 20px rgba(255,255,255,0.8)",
                "0 0 5px rgba(255,255,255,0.5)",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            🪙
          </motion.div>
        </motion.div>

        {/* Anéis de pulso com gradientes e glow */}
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              background: `linear-gradient(45deg, ${colors.primary}33, ${colors.secondary}33, ${colors.accent}33)`,
              boxShadow: `0 0 20px ${colors.primary}33`,
            }}
            initial={{
              width: "24%",
              height: "24%",
              opacity: 0.3,
              borderWidth: 3,
            }}
            animate={{
              width: ["24%", "95%"],
              height: ["24%", "95%"],
              opacity: [0.4, 0],
              borderWidth: [3, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: index * 3,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Partículas flutuantes com tamanhos e cores variadas */}
        {[...Array(20)].map((_, index) => {
          const size = Math.random() * 6 + 2; // Tamanho entre 2 e 8px
          const colorKeys = Object.keys(colors);
          const color = colors[colorKeys[index % colorKeys.length]];

          return (
            <motion.div
              key={`particle-${index}`}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}`,
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x:
                  Math.random() > 0.5
                    ? [0, 80 + Math.random() * 60]
                    : [0, -80 - Math.random() * 60],
                y:
                  Math.random() > 0.5
                    ? [0, 80 + Math.random() * 60]
                    : [0, -80 - Math.random() * 60],
                opacity: [0, 0.9, 0],
                scale: [0, 1, 0.5, 0],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Círculos orbitando */}
        {[...Array(3)].map((_, index) => {
          const radius = 10 + index * 15; 
          const duration = 60 - index;
          const size = 8 - index * 1.5; 
          const delay = index * 0.5; 
          const colorKey =
            Object.keys(colors)[index % Object.keys(colors).length];

          return (
            <motion.div
              key={`orbit-${index}`}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                backgroundColor: colors[colorKey],
                boxShadow: `0 0 15px ${colors[colorKey]}`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                x: Array.from(
                  { length: 60 },
                  (_, i) => radius * Math.cos((i * Math.PI) / 30)
                ),
                y: Array.from(
                  { length: 60 },
                  (_, i) => radius * Math.sin((i * Math.PI) / 30)
                ),
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "linear",
                times: Array.from({ length: 60 }, (_, i) => i / 60),
              }}
            />
          );
        })}

        {/* Texto de Loading animado */}
        <div className="absolute bottom-0 translate-y-20">
          <motion.div
            className="bg-gradient-to-r from-indigo-900/90 to-violet-900/90 backdrop-blur-md px-6 py-3 rounded-xl shadow-xl text-center"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 50, scale: 1 }}
            transition={{ delay: 1, duration: 2 }}
          >
            <motion.div
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.p
                className="text-white font-medium mb-1"
                variants={textVariants}
                initial="initial"
                animate="animate"
              >
                Carregando PulsePay
              </motion.p>

              <div className="w-full h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: "100%",
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    backgroundPosition: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default LoadingSpinner;
