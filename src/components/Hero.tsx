import { motion } from 'motion/react';
import { PrimaryButton } from './PrimaryButton';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-8 pt-24 md:pt-32 lg:pt-40">
      <div className="max-w-[1440px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <motion.h1
            className="text-white tracking-tight"
            style={{ 
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              lineHeight: '0.95',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              TURN
              <br />
              IDEAS
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              INTO REALITY
            </span>
          </motion.h1>

          <motion.p
            className="text-gray-400 max-w-lg text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            I build immersive, interactive websites that push boundaries. 
            From cutting-edge web design to performance-optimized development, 
            I create digital experiences that captivate and convert.
          </motion.p>

          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <PrimaryButton href="#projects">VIEW WORK</PrimaryButton>
            <a
              href="#services"
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
            >
              See services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Space for cube (handled by AnimatedBackground) */}
        <div className="hidden md:block" />
      </div>
    </section>
  );
}