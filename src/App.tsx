import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { TechStack } from './components/TechStack';
import { Projects } from './components/Projects';
import { Process } from './components/Process';
import { Contact } from './components/Contact';
import { AnimatedBackground } from './components/AnimatedBackground';

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress, scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      if (latest > lastScrollY && latest > 100) {
        setScrollDirection('down');
      } else if (latest < lastScrollY) {
        setScrollDirection('up');
      }
      setLastScrollY(latest);
    });

    return () => unsubscribe();
  }, [scrollY, lastScrollY]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#000814]">
      {/* Animated Background */}
      <AnimatedBackground mousePosition={mousePosition} scrollProgress={scrollYProgress} />

      {/* Content */}
      <div className="relative z-10">
        <Navbar scrollDirection={scrollDirection} />
        <Hero />
        <Services />
        <TechStack />
        <Projects />
        <Process />
        <Contact />
      </div>
    </div>
  );
}