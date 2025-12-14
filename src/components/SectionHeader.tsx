import { motion } from 'motion/react';

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-4">
      <motion.h2
        className="text-white tracking-tight"
        style={{
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          lineHeight: '1.1',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em'
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          className="text-gray-400 text-lg max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}