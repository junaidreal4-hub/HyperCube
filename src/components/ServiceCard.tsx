import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ServiceCard({ icon: Icon, title, description }: ServiceCardProps) {
  return (
    <motion.div
      className="relative p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all overflow-hidden"
      whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
      />

      {/* Border glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(6, 182, 212, 0.3) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: 'borderGlow 3s ease infinite',
        }}
      />

      <div className="relative z-10 space-y-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-7 h-7 text-cyan-400" />
        </div>

        {/* Title */}
        <h3 className="text-white text-2xl tracking-tight">{title}</h3>

        {/* Description */}
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
