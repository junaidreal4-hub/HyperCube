import { motion } from 'motion/react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function PrimaryButton({ children, href, onClick, variant = 'primary' }: PrimaryButtonProps) {
  const Component = href ? motion.a : motion.button;
  
  const baseClasses = "relative px-6 py-2.5 rounded-full tracking-wide transition-all overflow-hidden group";
  const variantClasses = variant === 'primary'
    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
    : "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-cyan-400/50";

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </Component>
  );
}
