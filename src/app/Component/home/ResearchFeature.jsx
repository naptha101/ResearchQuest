"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react'; // A nice icon for the CTA

const Features = () => {
  const router = useRouter();

const features = [
    {
      title: "Research Area Identification",
      description: "Leverage AI to analyze your academic profile, publications, and interests against a vast database of current literature. Our tool identifies emerging research areas, suggests niche topics with high impact potential, and provides keyword maps from Scopus & WoS to guide your focus.",
      icon: "🧭",
      accentColor: "blue",
      textColor: "text-blue-600",
      borderColor: "border-blue-500",
      glowColor: "shadow-blue-500/50",
      url: '/research-area-identification'
    },
    {
      title: "Title Generator for Research",
      description: "Overcome writer's block with an AI that generates compelling, field-aligned titles. Whether for a paper, thesis, or dissertation, you can create a list of original titles in various styles—declarative, interrogative, or descriptive—ensuring your work grabs attention from the start.",
      icon: "🏷️",
      accentColor: "orange",
      textColor: "text-orange-600",
      borderColor: "border-orange-500",
      glowColor: "shadow-orange-500/50",
      url: '/title-generation'
    },
    {
      title: "AI Literature Review Builder",
      description: "Transform the tedious process of literature review. Our AI synthesizes dozens of sources, identifies key themes and arguments, highlights research gaps, and helps you build a structured, coherent narrative. It's like having a research assistant that reads and connects the dots for you.",
      icon: "📚",
      accentColor: "sky",
      textColor: "text-sky-600",
      borderColor: "border-sky-500",
      glowColor: "shadow-sky-500/50",
      url: '/literature-review'
    },
    {
      title: "Methodology Generator",
      description: "Ensure your research is robust and valid. Based on your research questions and objectives, the AI recommends appropriate methodologies (qualitative, quantitative, or mixed-methods), suggests data collection tools, optimal sampling techniques, and the correct statistical tests for your analysis.",
      icon: "🧪",
      accentColor: "amber",
      textColor: "text-amber-600",
      borderColor: "border-amber-500",
      glowColor: "shadow-amber-500/50",
      url: '/research-methodology'
    },
    {
      title: "Citation Generator",
      description: "Create a comprehensive, university-compliant research proposal in a fraction of the time. The tool helps you draft the problem statement, objectives, hypotheses, scope, limitations, and even generates a Gantt chart for your proposed timeline, ensuring you meet every requirement.",
      icon: "📄",
      accentColor: "indigo",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-500",
      glowColor: "shadow-indigo-500/50",
      url: '/citation-generator'
    },
    {
      title: "Thesis Chapter Writing",
      description: "Draft entire chapters of your thesis with AI assistance. From structuring the introduction and arguments to writing the results and discussion, our tool helps maintain a consistent academic tone, integrates your data smoothly, and ensures each section logically flows into the next.",
      icon: "📘",
      accentColor: "rose",
      textColor: "text-rose-600",
      borderColor: "border-rose-500",
      glowColor: "shadow-rose-500/50",
      url: '/thesis-chapter-writing'
    },
  ];

  const [currentFeature, setCurrentFeature] = useState(0);
  const activeFeature = features[currentFeature];

  const navigateToFeature = () => {
    router.push(activeFeature.url);
  };

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-slate-50 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-blue-100/50 to-transparent blur-3xl -translate-x-1/2" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-orange-100/50 to-transparent blur-3xl translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight text-slate-800">
            Accelerate Your Research with<br />
            <span className="bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent">
              Intelligent Tools
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            From identifying a topic to writing the final paper, our AI-powered suite streamlines every step of your academic journey.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Highlighted Features List */}
          <motion.div className="bg-white/60 backdrop-blur-md rounded-xl border border-slate-200 shadow-sm">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => setCurrentFeature(index)}
                className="relative p-5 cursor-pointer group border-b border-slate-200 last:border-b-0"
              >
                {/* Sliding Highlight */}
                {currentFeature === index && (
                  <motion.div
                    layoutId="highlight"
                    className={`absolute inset-0 rounded-lg bg-gradient-to-r from-${feature.accentColor}-100/70 to-white`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <div className="relative flex items-center gap-5 transition-all duration-300">
                  <div className={`text-2xl p-3.5 rounded-lg bg-slate-100 ${feature.textColor} transition-colors duration-300`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-slate-800 transition-colors duration-300 ${currentFeature === index ? feature.textColor : ''}`}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      {feature.description.substring(0,100)}...
                    </p>
                  </div>
                  <motion.div 
                    className="ml-auto text-slate-400 group-hover:text-slate-800"
                    animate={{ x: currentFeature === index ? 0 : -5, opacity: currentFeature === index ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                     <div className={`w-2.5 h-2.5 rounded-full bg-${activeFeature.accentColor}-500`} />
                  </motion.div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Feature Visualization */}
          <div className="sticky top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                className="relative bg-white/70 backdrop-blur-md p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-xl text-center overflow-hidden"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              >
                {/* Background Glow */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-${activeFeature.accentColor}-100 rounded-full blur-3xl opacity-60`} />
                
                <div className="relative">
                  <motion.div 
                    className={`text-5xl mb-6 inline-block p-5 rounded-2xl bg-white shadow-md ${activeFeature.textColor}`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {activeFeature.icon}
                  </motion.div>

                  <h3 className={`text-2xl font-bold mb-4 text-slate-800`}>
                    {activeFeature.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-8">
{activeFeature.description}                 
 </p>

                  <motion.button 
                    onClick={navigateToFeature}
                    className={`group w-full inline-flex items-center justify-center px-6 py-3 bg-${activeFeature.accentColor}-500 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 shadow-lg ${activeFeature.glowColor}`}
                    whileHover={{ scale: 1.05, boxShadow: `0 10px 25px -5px var(--tw-shadow-color)` }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try This Feature
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;