import { motion } from 'motion/react';
import { SectionHeader } from './SectionHeader';
import { PrimaryButton } from './PrimaryButton';
import { Mail, Linkedin, Instagram } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLFormElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-[1440px] w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left: Header & Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SectionHeader
              title="Let's Build Something Extraordinary"
              description="Ready to bring your vision to life? Get in touch and let's create something amazing together."
            />

            {/* Contact Info */}
            <div className="space-y-4">
              <a
                href="mailto:hello@hypercube.dev"
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-400/30 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span>hello@hypercube.dev</span>
              </a>

              {/* Social Links */}
              <div className="flex gap-3 pt-4">
                {[
                  { icon: Linkedin, href: '#' },
                  { icon: Instagram, href: '#' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.form
            className="space-y-6 backdrop-blur-2xl bg-white/5 border border-white/20 rounded-2xl p-8 relative overflow-hidden"
            style={{
              boxShadow: '0 8px 32px 0 rgba(0, 212, 255, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
            }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={(e) => e.preventDefault()}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Water droplet effect */}
            {isHovering && (
              <div
                className="absolute pointer-events-none transition-opacity duration-300"
                style={{
                  left: mousePos.x,
                  top: mousePos.y,
                  width: '250px',
                  height: '250px',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(0, 212, 255, 0.2) 20%, transparent 70%)',
                  filter: 'blur(25px)',
                  opacity: 0.8,
                }}
              />
            )}
            
            {/* Glass refraction highlights */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-tl from-cyan-400/5 via-transparent to-transparent pointer-events-none rounded-2xl" />

            {/* Form fields - wrapped in relative div for proper z-index */}
            <div className="relative z-10 space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-gray-400 text-sm">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all backdrop-blur-xl"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-400 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all backdrop-blur-xl"
                  placeholder="your@email.com"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-gray-400 text-sm">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all resize-none backdrop-blur-xl"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Submit */}
              <PrimaryButton>SEND MESSAGE</PrimaryButton>
            </div>
          </motion.form>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-24 pt-8 border-t border-white/10 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          © 2025 HYPERCUBE. Crafted with passion and precision.
        </motion.div>
      </div>
    </section>
  );
}