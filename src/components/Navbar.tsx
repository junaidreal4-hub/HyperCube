import { Linkedin, Instagram, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryButton } from './PrimaryButton';
import { useState } from 'react';
import logo from 'figma:asset/723da97200e766ba2770a48515790aa2d928eee9.png';

interface NavbarProps {
  scrollDirection: 'up' | 'down';
}

export function Navbar({ scrollDirection }: NavbarProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#projects' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-8 py-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Left section: Logo and Company Name */}
          <motion.div 
            className="flex items-center gap-4"
            animate={{
              opacity: scrollDirection === 'down' ? 0 : 1,
              scale: scrollDirection === 'down' ? 0.3 : 1,
              x: scrollDirection === 'down' ? 600 : 0,
              y: scrollDirection === 'down' ? -10 : 0,
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <img 
              src={logo} 
              alt="HYPERCUBE Logo" 
              className="w-16 h-16 object-contain hover:scale-110 transition-transform"
            />
            <span className="text-white tracking-wider font-bold">HYPERCUBE</span>
          </motion.div>

          {/* Right section: Social + CTA + Menu */}
          <motion.div 
            className="backdrop-blur-2xl bg-white/5 border border-white/20 rounded-full px-6 py-3 flex items-center gap-6 relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
              boxShadow: '0 8px 32px 0 rgba(0, 212, 255, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
            }}
            animate={{
              opacity: scrollDirection === 'down' ? 0 : 1,
              scale: scrollDirection === 'down' ? 0.3 : 1,
              x: scrollDirection === 'down' ? -120 : 0,
              y: scrollDirection === 'down' ? -10 : 0,
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Water droplet effect */}
            {isHovering && (
              <div
                className="absolute pointer-events-none transition-opacity duration-300"
                style={{
                  left: mousePos.x,
                  top: mousePos.y,
                  width: '200px',
                  height: '200px',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(0, 212, 255, 0.2) 20%, transparent 70%)',
                  filter: 'blur(20px)',
                  opacity: 0.8,
                }}
              />
            )}
            
            {/* Glass refraction highlights */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-full" />
            <div className="absolute inset-0 bg-gradient-to-tl from-cyan-400/5 via-transparent to-transparent pointer-events-none rounded-full" />
            
            {/* Social Icons */}
            <div className="hidden md:flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-white/20" />

            {/* CTA Button */}
            <PrimaryButton href="#contact">GET IN TOUCH</PrimaryButton>

            {/* Menu */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-cyan-400 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </motion.div>
        </div>

        {/* Menu button only - shows on scroll down */}
        <motion.div
          className="absolute top-4 right-8"
          animate={{
            opacity: scrollDirection === 'down' ? 1 : 0,
            scale: scrollDirection === 'down' ? 1 : 0.3,
          }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: scrollDirection === 'down' ? 'auto' : 'none' }}
        >
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-14 h-14 rounded-full backdrop-blur-2xl bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110 shadow-lg shadow-cyan-500/20"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </motion.div>
      </motion.nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Floating Menu Panel */}
            <motion.div
              className="fixed top-20 right-8 z-[70] backdrop-blur-2xl bg-white/5 border border-white/20 rounded-3xl p-8 overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                boxShadow: '0 20px 60px 0 rgba(0, 212, 255, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Glass refraction highlights */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-3xl" />
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-400/5 via-transparent to-transparent pointer-events-none rounded-3xl" />
              
              {/* Close button */}
              <motion.button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-xl bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110 hover:rotate-90"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>

              {/* Menu Items */}
              <div className="flex flex-col gap-4 min-w-[240px] mt-8">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="group relative text-2xl text-white/80 hover:text-cyan-400 transition-colors px-4 py-3 rounded-xl hover:bg-white/5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.08, duration: 0.3 }}
                  >
                    {item.label}
                    {/* Underline effect */}
                    <motion.div
                      className="absolute bottom-2 left-4 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600"
                      initial={{ width: 0 }}
                      whileHover={{ width: 'calc(100% - 32px)' }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}

                {/* Divider */}
                <div className="w-full h-px bg-white/20 my-2" />

                {/* Social Links in Menu */}
                <motion.div
                  className="flex items-center gap-6 px-4 py-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors hover:scale-125 transition-transform">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors hover:scale-125 transition-transform">
                    <Instagram className="w-6 h-6" />
                  </a>
                </motion.div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}