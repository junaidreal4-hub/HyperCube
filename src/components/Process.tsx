import { motion } from 'motion/react';
import { SectionHeader } from './SectionHeader';
import { Lightbulb, Pencil, Code, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Lightbulb,
    title: 'Discovery',
    description: 'We explore your vision, goals, and target audience to establish a solid foundation.',
  },
  {
    number: '02',
    icon: Pencil,
    title: 'Design',
    description: 'Creating wireframes, prototypes, and high-fidelity designs that bring your brand to life.',
  },
  {
    number: '03',
    icon: Code,
    title: 'Development',
    description: 'Building with cutting-edge technologies, ensuring performance, scalability, and maintainability.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Launch',
    description: 'Testing, optimizing, and deploying your project with ongoing support and iteration.',
  },
];

export function Process() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-[1440px] w-full mx-auto">
        <SectionHeader
          title="How It Works"
          description="A streamlined process designed to deliver exceptional results, on time and on budget."
        />

        {/* Timeline */}
        <div className="mt-16 space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="flex gap-8 items-start">
                {/* Number & Icon */}
                <div className="flex-shrink-0 space-y-4">
                  <div className="text-6xl font-black text-transparent bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text">
                    {step.number}
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-4 space-y-3 pb-8 border-b border-white/10 last:border-b-0">
                  <h3 className="text-white text-3xl tracking-tight">{step.title}</h3>
                  <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">{step.description}</p>
                </div>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-32 w-px h-16 bg-gradient-to-b from-cyan-400/50 to-transparent" />
                )}
              </div>

              {/* Glowing dot */}
              <motion.div
                className="absolute left-[30px] top-36 w-3 h-3 rounded-full bg-cyan-400"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.3 }}
                style={{
                  boxShadow: '0 0 20px rgba(34, 211, 238, 0.8)',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}