"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Tag,
  BookOpenText,
  FlaskConical,
  FileText,
  BookMarked,
  Bot,
  Bookmark,
  Newspaper,
  ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';

// Helper to map icon strings to actual components
const ICONS = {
  compass: Compass,
  tag: Tag,
  "book-open": BookOpenText,
  flask: FlaskConical,
  file: FileText,
  "book-marked": BookMarked,
  bot: Bot,
  bookmark: Bookmark,
  newspaper: Newspaper,
};

const Features = () => {
  // Data with added layout classes and icon keys
  const features = [
    {
      title: "Research Area Identification",
      description: "AI analyzes your qualifications and interests to suggest trending research domains with keyword mapping.",
      icon: "compass",
      link: "/research-area-identification",
      className: "lg:col-span-2",
    },
    {
      title: "Title Generator",
      description: "Get original, compelling, and field-aligned research titles for papers, theses, or dissertations.",
      icon: "tag",
      link: "/title-generation",
      className: "lg:col-span-1",
    },
    {
      title: "Literature Review Builder",
      description: "Build structured, comprehensive literature reviews using the latest papers and critical analysis.",
      icon: "book-open",
      link: "/literature-review-builder",
      className: "lg:col-span-1",
    },
    {
      title: "Methodology Generator",
      description: "Recommends appropriate research methods with sampling and analysis suggestions.",
      icon: "flask",
      link: "/research-methodology-generator",
      className: "lg:col-span-2",
    },
    {
      title: "Synopsis / Proposal Creator",
      description: "Create full synopses or proposals with objectives, hypotheses, methodology, and timelines.",
      icon: "file",
      link: "/synopsis-proposal-creator",
      className: "lg:col-span-3",
    },
    {
      title: "Thesis Chapter Writing",
      description: "Generate complete thesis chapters like Introduction, Methodology, Results, and Conclusion.",
      icon: "book-marked",
      link: "/thesis-chapter-writing",
      className: "lg:col-span-2",
    },
    {
      title: "Mock Viva Chatbot",
      description: "Simulate real viva sessions with an AI chatbot that asks relevant, field-specific questions.",
      icon: "bot",
      link: "/mock-viva-chatbot",
      className: "lg:col-span-1",
    },
    {
      title: "Citation & Bibliography",
      description: "Format references in APA, MLA, Chicago, or IEEE styles from source URLs or papers.",
      icon: "bookmark",
      link: "/citation-bibliography-generator",
      className: "lg:col-span-1",
    },
    {
      title: "Research Article Writer",
      description: "Turn your thesis into a journal-ready article compatible with Scopus, Web of Science, or SCI.",
      icon: "newspaper",
      link: "/research-article-writer",
      className: "lg:col-span-2",
    },
  ];

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-24 px-4 bg-stone-50 text-slate-800 overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-0 -left-1/4 w-full h-full bg-amber-100/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 -right-1/4 w-full h-full bg-orange-100/30 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>

      {/* Interactive warm glow effect */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 146, 60, 0.15), transparent 80%)`,
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
            Accelerate Your Entire Research Workflow
          </h2>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto">
            From identifying a novel research area to writing a journal-ready article, our AI suite is your ultimate academic partner.
          </p>
        </div>

        {/* Features Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature) => {
            const Icon = ICONS[feature.icon];
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={clsx(
                  "relative p-6 rounded-2xl overflow-hidden cursor-pointer group",
                  "bg-white/60 backdrop-blur-sm border border-stone-200/80",
                  "hover:border-amber-400/80 hover:shadow-lg transition-all duration-300",
                  feature.className
                )}
              >
                <a href={feature.link} className="absolute inset-0 z-10">
                  <span className="sr-only">View {feature.title}</span>
                </a>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-400 transform transition-transform duration-300 group-hover:text-amber-500 group-hover:translate-x-1" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-stone-500 text-md">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;