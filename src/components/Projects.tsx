import { motion } from 'motion/react';
import { ProjectCard } from './ProjectCard';
import { SectionHeader } from './SectionHeader';

const projects = [
  {
    title: 'Quantum Commerce',
    category: ['E-commerce', 'WebGL'],
    description: 'An immersive 3D product configurator with real-time rendering and AR preview.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  },
  {
    title: 'Neural Network Studio',
    category: ['SaaS', 'Dashboard'],
    description: 'AI-powered creative platform with interactive data visualization and real-time collaboration.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  },
  {
    title: 'Cosmos Gallery',
    category: ['Portfolio', 'Animation'],
    description: 'Award-winning portfolio site featuring scroll-driven animations and particle effects.',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
  },
];

export function Projects() {
  return (
    <section id="projects" className="min-h-screen flex items-center justify-center px-8 py-24">
      <div className="max-w-[1440px] w-full mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Header */}
          <SectionHeader
            title="Featured Work"
            description="A selection of projects that showcase innovation, craftsmanship, and attention to detail."
          />

          {/* Right: Empty space or could add a stat/highlight */}
          <div />
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
