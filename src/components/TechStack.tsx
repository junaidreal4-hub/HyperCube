import { motion } from 'motion/react';
import { 
  Code2, 
  Palette, 
  Layers, 
  Zap, 
  Database,
  Globe,
  Box,
  Sparkles
} from 'lucide-react';

const tools = [
  {
    name: 'React',
    category: 'Frontend',
    icon: Layers,
    description: 'Building dynamic UIs',
    gradient: 'from-cyan-400 to-blue-500'
  },
  {
    name: 'TypeScript',
    category: 'Language',
    icon: Code2,
    description: 'Type-safe development',
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling',
    icon: Palette,
    description: 'Rapid UI design',
    gradient: 'from-cyan-300 to-teal-400'
  },
  {
    name: 'Next.js',
    category: 'Framework',
    icon: Zap,
    description: 'Full-stack React',
    gradient: 'from-violet-400 to-purple-500'
  },
  {
    name: 'Node.js',
    category: 'Backend',
    icon: Database,
    description: 'Server-side JavaScript',
    gradient: 'from-emerald-400 to-green-500'
  },
  {
    name: 'Figma',
    category: 'Design',
    icon: Box,
    description: 'Interface design',
    gradient: 'from-pink-400 to-rose-500'
  },
  {
    name: 'Vercel',
    category: 'Deployment',
    icon: Globe,
    description: 'Cloud hosting',
    gradient: 'from-slate-300 to-slate-400'
  },
  {
    name: 'Motion',
    category: 'Animation',
    icon: Sparkles,
    description: 'Smooth animations',
    gradient: 'from-fuchsia-400 to-pink-500'
  }
];

export function TechStack() {
  return (
    <section id="tools" className="min-h-screen flex items-center justify-center px-8 py-32 relative">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-[1440px] w-full mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-4 px-6 py-2 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border border-cyan-400/30"
          >
            <span className="text-cyan-400 uppercase tracking-widest text-sm">My Arsenal</span>
          </motion.div>
          
          <h2 className="text-white mb-4" style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em'
          }}>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              TECH STACK
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Cutting-edge tools and technologies I use to build exceptional digital experiences
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -12, scale: 1.03 }}
              className="group relative"
            >
              {/* Animated gradient border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-2xl blur transition-all duration-500 group-hover:blur-md" 
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  '--tw-gradient-from': 'rgb(34 211 238)',
                  '--tw-gradient-to': 'rgb(59 130 246)',
                  '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'
                } as React.CSSProperties}
              />

              {/* Glassmorphism Card */}
              <div className="relative h-full rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 group-hover:bg-slate-900/60 group-hover:border-cyan-400/50 overflow-hidden">
                {/* Animated background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`} />
                
                {/* Shine effect */}
                <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-700 skew-x-12" />
                
                <div className="relative z-10">
                  {/* Icon with glow */}
                  <motion.div 
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 relative overflow-hidden group-hover:border-transparent"
                  >
                    {/* Icon glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`} />
                    <tool.icon className={`w-10 h-10 relative z-10 text-gray-400 group-hover:text-transparent group-hover:bg-gradient-to-br group-hover:${tool.gradient} group-hover:bg-clip-text transition-all duration-500`} 
                      style={{
                        filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0))',
                      }}
                    />
                  </motion.div>

                  {/* Tool Name */}
                  <h3 className={`text-white mb-3 group-hover:bg-gradient-to-r group-hover:${tool.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`} style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    letterSpacing: '-0.02em'
                  }}>
                    {tool.name}
                  </h3>

                  {/* Category Badge */}
                  <div className={`inline-block mb-4 px-3 py-1.5 rounded-lg bg-gradient-to-r ${tool.gradient} bg-opacity-10 border border-cyan-400/20 group-hover:border-cyan-400/50 transition-all duration-300`}>
                    <span className="text-cyan-300 text-xs uppercase tracking-widest font-semibold">
                      {tool.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {tool.description}
                  </p>

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/0 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl rounded-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}