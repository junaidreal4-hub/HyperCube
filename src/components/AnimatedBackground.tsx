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
  scrollProgress: MotionValue;
}

export function AnimatedBackground({
  mousePosition,
  scrollProgress,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Always keep latest mouse position without re-running heavy effects
  const mouseRef = useRef(mousePosition);
  useEffect(() => {
    mouseRef.current = mousePosition;
  }, [mousePosition]);

  const [isMouseIdle, setIsMouseIdle] = useState(true);
  const lastMouseMoveTime = useRef(Date.now());
  const autoRotateAngle = useMotionValue(0);

  // Scroll detection for pausing animation
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  // Scroll -> cube rotation and position
  const cubeRotateX = useTransform(scrollProgress, [0, 1], [35, 395]);
  const cubeRotateY = useTransform(scrollProgress, [0, 1], [45, 225]);
  const cubeY = useTransform(scrollProgress, [0, 1], ["20%", "70%"]);

  // Smooth cube offsets
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

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Idle detection
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
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
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

    // OPTIMIZED: Reduced star count
    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 400 : 800;
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

    // Gradient cache for performance
    const gradientCache = new Map<string, CanvasGradient>();

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
      // OPTIMIZED: Skip rendering while scrolling
      if (isScrolling) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      ctx.fillStyle = "#000814";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Mouse parallax (read from ref)
      lastMouseX += (mouseRef.current.x * 20 - lastMouseX) * 0.1;
      lastMouseY += (mouseRef.current.y * 20 - lastMouseY) * 0.1;

      const currentCenterX = canvas.width / 2;
      const currentCenterY = canvas.height / 2;
      const currentTime = Date.now();

      // OPTIMIZED: Less frequent shooting stars
      if (currentTime - lastShootingStarTime > 15000) {
        createShootingStar();
        lastShootingStarTime = currentTime;
      }

      // OPTIMIZED: Simplified shooting star rendering
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

        // Simplified tail gradient
        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(
          0.3,
          `rgba(150, 220, 255, ${star.opacity * 0.6})`
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

        // Simplified head
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // OPTIMIZED: Star rendering with gradient caching
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
          const cacheKey = `${star.color}-${star.brightness.toFixed(2)}-${star.size.toFixed(2)}`;

          if (!gradientCache.has(cacheKey)) {
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
            gradient.addColorStop(
              0,
              `rgba(${star.color}, ${star.brightness * 0.8})`
            );
            gradient.addColorStop(
              0.4,
              `rgba(${star.color}, ${star.brightness * 0.3})`
            );
            gradient.addColorStop(1, `rgba(${star.color}, 0)`);
            gradientCache.set(cacheKey, gradient);
          }

          ctx.save();
          ctx.translate(x, y);
          ctx.fillStyle = gradientCache.get(cacheKey)!;
          ctx.beginPath();
          ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
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
  }, [isScrolling]);

  return (
    <>
      {/* Canvas starfield */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          willChange: "contents",
          pointerEvents: "none",
        }}
      />

      {/* Glowing tesseract cube */}
      <motion.div
        style={{
          position: "fixed",
          top: cubeY,
          left: "50%",
          x: "-50%",
          y: "-50%",
          perspective: 1200,
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        {/* Single cube with crystal-like appearance */}
        <motion.div
          style={{
            position: "relative",
            width: 320,
            height: 320,
            transformStyle: "preserve-3d",
            rotateX: cubeRotateX,
            rotateY: cubeRotateY,
            x: smoothOffsetX,
            y: smoothOffsetY,
          }}
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
              style={{
                position: "absolute",
                width: 320,
                height: 320,
                background: face.gradient,
                transform: face.transform,
                border: "1px solid rgba(0, 212, 255, 0.3)",
                boxShadow:
                  "inset 0 0 60px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2)",
                backdropFilter: "blur(2px)",
              }}
            />
          ))}

          {/* Inner cube - smaller and glowing, perfectly synchronized */}
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
              style={{
                position: "absolute",
                width: 320,
                height: 320,
                background: face.gradient,
                transform: face.transform,
                border: "1px solid rgba(150, 250, 255, 0.6)",
                boxShadow:
                  "inset 0 0 80px rgba(150, 250, 255, 0.7), 0 0 60px rgba(0, 230, 255, 0.4)",
                backdropFilter: "blur(1px)",
              }}
            />
          ))}

          {/* Inner cube core glow - brighter */}
          <div
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              background:
                "radial-gradient(circle, rgba(200, 255, 255, 0.6) 0%, rgba(0, 230, 255, 0.4) 30%, transparent 70%)",
              transform: "translateZ(0px)",
              filter: "blur(30px)",
            }}
          />
        </motion.div>

        {/* Reduced outer glow layers */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(0, 212, 255, 0.25) 0%, transparent 60%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* Nebula fog overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(0, 100, 150, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(100, 50, 150, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}
