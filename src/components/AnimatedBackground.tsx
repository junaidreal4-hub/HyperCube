import { useEffect, useRef, useState } from "react";
import {
  motion,
  useTransform,
  MotionValue,
  useMotionValue,
  useAnimationFrame,
  useSpring,
} from "motion/react";

interface AnimatedBackgroundProps {
  mousePosition: { x: number; y: number };
  scrollProgress: MotionValue<number>;
}

export function AnimatedBackground({
  mousePosition,
  scrollProgress,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Always keep latest mouse position without re-running heavy effects
  const mouseRef = useRef(mousePosition);
  useEffect(() => {
    mouseRef.current = mousePosition;
  }, [mousePosition]);

  const [isMouseIdle, setIsMouseIdle] = useState(true);
  const lastMouseMoveTime = useRef(Date.now());

  const autoRotateAngle = useMotionValue(0);

  // Scroll -> cube rotation and position
  const cubeRotateX = useTransform(scrollProgress, [0, 1], [35, 395]);
  const cubeRotateY = useTransform(scrollProgress, [0, 1], [45, 225]);
  const cubeY = useTransform(scrollProgress, [0, 1], ["20%", "70%"]);

  // Smooth cube offsets (instead of animate props)
  const cubeOffsetX = useMotionValue(0);
  const cubeOffsetY = useMotionValue(0);
  const smoothOffsetX = useSpring(cubeOffsetX, {
    stiffness: 140,
    damping: 28,
    mass: 0.6,
  });
  const smoothOffsetY = useSpring(cubeOffsetY, {
    stiffness: 140,
    damping: 28,
    mass: 0.6,
  });

  // Idle detection (slightly less frequent than before)
  useEffect(() => {
    const checkMouseIdle = window.setInterval(() => {
      const timeSinceLastMove = Date.now() - lastMouseMoveTime.current;
      setIsMouseIdle(timeSinceLastMove > 2000);
    }, 150);

    return () => window.clearInterval(checkMouseIdle);
  }, []);

  // Update last mouse move time and update cube target offsets
  useEffect(() => {
    lastMouseMoveTime.current = Date.now();
    setIsMouseIdle(false);

    // When moving: set target offsets
    cubeOffsetX.set(mousePosition.x * 30);
    cubeOffsetY.set(mousePosition.y * 30);
  }, [mousePosition, cubeOffsetX, cubeOffsetY]);

  // When idle: gently return to center
  useEffect(() => {
    if (isMouseIdle) {
      cubeOffsetX.set(0);
      cubeOffsetY.set(0);
    }
  }, [isMouseIdle, cubeOffsetX, cubeOffsetY]);

  // Auto-rotate when idle
  useAnimationFrame((time) => {
    if (isMouseIdle) {
      autoRotateAngle.set(time * 0.015);
    }
  });

  // Starfield canvas (optimized)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;

      // PERFORMANCE FIX: viewport-only height
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const stars: Array<{
      z: number;
      size: number;
      color: string;
      brightness: number;
      angle: number;
      radius: number;
      speed: number;
    }> = [];

    const shootingStars: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
    }> = [];

    // PERFORMANCE FIX: fewer stars (mobile friendly)
    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 1200 : 3500;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const maxRadius =
      Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) * 0.7;

    for (let i = 0; i < starCount; i++) {
      const rand = Math.random();
      let color: string;
      let size: number;
      let brightness: number;

      if (rand < 0.6) {
        color = "255, 255, 255";
        size = Math.random() * 0.8 + 0.1;
        brightness = Math.random() * 0.4 + 0.2;
      } else if (rand < 0.85) {
        color = Math.random() > 0.5 ? "200, 230, 255" : "150, 200, 255";
        size = Math.random() * 1.2 + 0.2;
        brightness = Math.random() * 0.5 + 0.2;
      } else if (rand < 0.97) {
        color = "0, 212, 255";
        size = Math.random() * 1.8 + 0.4;
        brightness = Math.random() * 0.4 + 0.3;
      } else {
        color = "255, 255, 255";
        size = Math.random() * 2.5 + 0.8;
        brightness = Math.random() * 0.3 + 0.6;
      }

      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * maxRadius;

      stars.push({
        z: Math.random(),
        size,
        color,
        brightness,
        angle,
        radius,
        speed:
          (0.0006 + Math.random() * 0.0008) * (1 / (1 + radius / maxRadius)),
      });
    }

    let animationFrame = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastShootingStarTime = Date.now();

    const createShootingStar = () => {
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height * 0.5;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;

      shootingStars.push({
        x: startX,
        y: startY,
        length: 80 + Math.random() * 120,
        speed: 8 + Math.random() * 6,
        angle,
        opacity: 1,
        active: true,
      });
    };

    const animate = () => {
      ctx.fillStyle = "#000814";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Mouse parallax (read from ref)
      lastMouseX += (mouseRef.current.x * 20 - lastMouseX) * 0.1;
      lastMouseY += (mouseRef.current.y * 20 - lastMouseY) * 0.1;

      const currentCenterX = canvas.width / 2;
      const currentCenterY = canvas.height / 2;

      const currentTime = Date.now();
      if (currentTime - lastShootingStarTime > 10000) {
        createShootingStar();
        lastShootingStarTime = currentTime;
      }

      shootingStars.forEach((star, index) => {
        if (!star.active) return;

        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.008;

        if (
          star.opacity <= 0 ||
          star.x > canvas.width ||
          star.y > canvas.height
        ) {
          star.active = false;
          shootingStars.splice(index, 1);
          return;
        }

        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );

        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(
          0.1,
          `rgba(150, 220, 255, ${star.opacity * 0.9})`
        );
        gradient.addColorStop(
          0.3,
          `rgba(100, 200, 255, ${star.opacity * 0.6})`
        );
        gradient.addColorStop(1, "rgba(100, 200, 255, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        ctx.stroke();

        const headGradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          4
        );
        headGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        headGradient.addColorStop(
          0.5,
          `rgba(150, 220, 255, ${star.opacity * 0.6})`
        );
        headGradient.addColorStop(1, "rgba(100, 200, 255, 0)");

        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      stars.forEach((star) => {
        star.angle += star.speed;

        const baseX = currentCenterX + Math.cos(star.angle) * star.radius;
        const baseY = currentCenterY + Math.sin(star.angle) * star.radius;

        const parallaxX = lastMouseX * star.z * 1.5;
        const parallaxY = lastMouseY * star.z * 1.5;

        const x = baseX + parallaxX;
        const y = baseY + parallaxY;

        if (star.size > 1 || star.brightness > 0.5) {
          const glowSize = star.size * (2 + star.brightness * 2);
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);

          gradient.addColorStop(
            0,
            `rgba(${star.color}, ${star.brightness * 0.8})`
          );
          gradient.addColorStop(
            0.4,
            `rgba(${star.color}, ${star.brightness * 0.3})`
          );
          gradient.addColorStop(1, `rgba(${star.color}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, glowSize, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(${star.color}, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        if (star.brightness > 0.7 && star.size > 1.5) {
          ctx.strokeStyle = `rgba(${star.color}, ${star.brightness * 0.6})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x - star.size * 1.5, y);
          ctx.lineTo(x + star.size * 1.5, y);
          ctx.moveTo(x, y - star.size * 1.5);
          ctx.lineTo(x, y + star.size * 1.5);
          ctx.stroke();
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      {/* Canvas starfield */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Glowing tesseract cube */}
      <motion.div
        className="fixed left-1/2 z-0 pointer-events-none"
        style={{
          top: cubeY,
          x: "-50%",
          translateX: smoothOffsetX,
          translateY: smoothOffsetY,
        }}
      >
        <motion.div
          className="relative"
          style={{
            rotateX: cubeRotateX,
            rotateY: isMouseIdle ? autoRotateAngle : cubeRotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Single cube with crystal-like appearance */}
          <div
            className="relative w-80 h-80"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Outer cube faces with gem/crystal effect */}
            {[
              {
                transform: "rotateY(0deg) translateZ(160px)",
                gradient:
                  "radial-gradient(circle at 30% 30%, rgba(100, 240, 255, 0.6) 0%, rgba(0, 212, 255, 0.4) 40%, rgba(0, 168, 204, 0.2) 100%)",
              },
              {
                transform: "rotateY(90deg) translateZ(160px)",
                gradient:
                  "radial-gradient(circle at 40% 40%, rgba(0, 212, 255, 0.5) 0%, rgba(0, 190, 230, 0.35) 40%, rgba(0, 168, 204, 0.2) 100%)",
              },
              {
                transform: "rotateY(180deg) translateZ(160px)",
                gradient:
                  "radial-gradient(circle at 35% 35%, rgba(100, 240, 255, 0.5) 0%, rgba(0, 212, 255, 0.3) 40%, rgba(0, 168, 204, 0.15) 100%)",
              },
              {
                transform: "rotateY(-90deg) translateZ(160px)",
                gradient:
                  "radial-gradient(circle at 30% 30%, rgba(0, 212, 255, 0.55) 0%, rgba(100, 240, 255, 0.4) 40%, rgba(0, 168, 204, 0.2) 100%)",
              },
              {
                transform: "rotateX(90deg) translateZ(160px)",
                gradient:
                  "radial-gradient(circle at 35% 35%, rgba(0, 190, 230, 0.5) 0%, rgba(0, 212, 255, 0.3) 40%, rgba(100, 240, 255, 0.2) 100%)",
              },
              {
                transform: "rotateX(-90deg) translateZ(160px)",
                gradient:
                  "radial-gradient(circle at 40% 40%, rgba(0, 168, 204, 0.45) 0%, rgba(0, 212, 255, 0.35) 40%, rgba(0, 190, 230, 0.15) 100%)",
              },
            ].map((face, i) => (
              <div
                key={i}
                className="absolute w-80 h-80"
                style={{
                  transform: face.transform,
                  backfaceVisibility: "hidden",
                  background: face.gradient,
                  boxShadow:
                    "0 0 40px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.25), inset 0 0 60px rgba(0, 212, 255, 0.2), inset 0 0 30px rgba(255, 255, 255, 0.25), inset 20px 20px 40px rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(3px)",
                  border: "none",
                  outline: "none",
                }}
              />
            ))}

            {/* Inner cube - smaller and glowing, perfectly synchronized */}
            <div
              className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2"
              style={{ transformStyle: "preserve-3d" }}
            >
              {[
                {
                  transform: "rotateY(0deg) translateZ(80px)",
                  gradient:
                    "radial-gradient(circle at 30% 30%, rgba(150, 250, 255, 0.85) 0%, rgba(0, 230, 255, 0.65) 40%, rgba(0, 200, 230, 0.4) 100%)",
                },
                {
                  transform: "rotateY(90deg) translateZ(80px)",
                  gradient:
                    "radial-gradient(circle at 40% 40%, rgba(0, 230, 255, 0.75) 0%, rgba(0, 210, 240, 0.55) 40%, rgba(0, 190, 220, 0.35) 100%)",
                },
                {
                  transform: "rotateY(180deg) translateZ(80px)",
                  gradient:
                    "radial-gradient(circle at 35% 35%, rgba(150, 250, 255, 0.7) 0%, rgba(0, 220, 255, 0.5) 40%, rgba(0, 190, 220, 0.3) 100%)",
                },
                {
                  transform: "rotateY(-90deg) translateZ(80px)",
                  gradient:
                    "radial-gradient(circle at 30% 30%, rgba(0, 230, 255, 0.8) 0%, rgba(150, 250, 255, 0.6) 40%, rgba(0, 200, 230, 0.4) 100%)",
                },
                {
                  transform: "rotateX(90deg) translateZ(80px)",
                  gradient:
                    "radial-gradient(circle at 35% 35%, rgba(0, 210, 240, 0.75) 0%, rgba(0, 230, 255, 0.55) 40%, rgba(150, 250, 255, 0.4) 100%)",
                },
                {
                  transform: "rotateX(-90deg) translateZ(80px)",
                  gradient:
                    "radial-gradient(circle at 40% 40%, rgba(0, 190, 220, 0.7) 0%, rgba(0, 220, 255, 0.55) 40%, rgba(0, 210, 240, 0.35) 100%)",
                },
              ].map((face, i) => (
                <div
                  key={`inner-${i}`}
                  className="absolute w-40 h-40"
                  style={{
                    transform: face.transform,
                    backfaceVisibility: "hidden",
                    background: face.gradient,
                    boxShadow:
                      "0 0 60px rgba(0, 230, 255, 0.8), 0 0 80px rgba(0, 230, 255, 0.5), inset 0 0 50px rgba(0, 230, 255, 0.4), inset 0 0 25px rgba(255, 255, 255, 0.5), inset 15px 15px 30px rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(2px)",
                    border: "none",
                    outline: "none",
                  }}
                />
              ))}

              {/* Inner cube core glow - brighter */}
              <div
                className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(150, 250, 255, 0.9) 0%, rgba(0, 230, 255, 0.6) 30%, rgba(0, 212, 255, 0.3) 60%, transparent 100%)",
                  filter: "blur(20px)",
                  transform: "translate(-50%, -50%) translateZ(0px)",
                  transformStyle: "preserve-3d",
                }}
              />
            </div>
          </div>

          {/* Reduced outer glow layers */}
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-[#00D4FF]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-[#00D4FF]/12 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 bg-[#00A8CC]/25 rounded-full blur-2xl" />
        </motion.div>
      </motion.div>

      {/* Nebula fog overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-3xl" />
      </div>
    </>
  );
}
