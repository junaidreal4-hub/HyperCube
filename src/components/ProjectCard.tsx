import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  category: string[];
  description: string;
  image: string;
}

export function ProjectCard({ title, category, description, image }: ProjectCardProps) {
  return (
    <motion.a
      href="#"
      className="group block relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020815] via-[#020815]/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        {/* Categories */}
        <div className="flex gap-2 flex-wrap">
          {category.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-sm"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-white text-xl tracking-tight flex items-center justify-between">
          {title}
          <ArrowUpRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

        {/* View link */}
        <div className="pt-2">
          <span className="text-cyan-400 text-sm group-hover:underline">
            View case study
          </span>
        </div>
      </div>

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        }}
      />
    </motion.a>
  );
}
