import { motion } from 'motion/react';
import { ServiceCard } from './ServiceCard';
import { Palette, Code2, Box, Gauge } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const services = [
  {
    icon: Palette,
    title: 'Web Design',
    description: 'Crafting stunning, user-centric interfaces that blend aesthetics with functionality.',
  },
  {
    icon: Code2,
    title: 'Web Development',
    description: 'Building robust, scalable applications with modern frameworks and best practices.',
  },
  {
    icon: Box,
    title: 'Interactive 3D',
    description: 'Creating immersive 3D experiences that engage users and tell compelling stories.',
  },
  {
    icon: Gauge,
    title: 'Performance & SEO',
    description: 'Optimizing for speed, accessibility, and search engine visibility from the ground up.',
  },
];

export function Services() {
  return (
    <section id="services" className="min-h-screen flex items-center justify-center px-8 py-24">
      <div className="max-w-[1440px] w-full mx-auto">
        <SectionHeader
          title="What I Offer"
          description="Comprehensive web solutions that combine technical excellence with creative vision."
        />

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
