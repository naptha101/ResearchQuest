"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Features = () => {
  const features = [
    {
      title: "Research Area Identification",
      description: "AI analyzes your qualifications and interests to suggest trending research domains with keyword mapping from recent literature.",
      icon: "🧭",
      gradient: "from-blue-500 to-sky-600",
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      stats: "Trending Topics",
      url: '/research-area-identification'
    },
    {
      title: "Title Generator for Research",
      description: "Get original, compelling, and field-aligned research titles for papers, theses, or dissertations using AI suggestions.",
      icon: "🏷️",
      gradient: "from-purple-500 to-indigo-600",
      color: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      stats: "1000+ Titles",
      url: '/research-area-identification'
    },
    {
      title: "AI Literature Review Builder",
      description: "Build structured, comprehensive literature reviews using the latest papers and critical analysis of user-specified topics.",
      icon: "📚",
      gradient: "from-green-500 to-emerald-600",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-300",
      stats: "Auto-Sourced",
      url: '/research-area-identification'
    },
    {
      title: "Research Methodology Generator",
      description: "Recommends appropriate research methods including qualitative, quantitative, or mixed, with sampling and analysis suggestions.",
      icon: "🧪",
      gradient: "from-pink-500 to-rose-600",
      color: "text-pink-700",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-300",
      stats: "Field-Specific",
      url: '/research-area-identification'
    },
    {
      title: "Synopsis / Proposal Creator",
      description: "Create full synopses or proposals with objectives, hypotheses, methodology, significance, and timelines as per university format.",
      icon: "📄",
      gradient: "from-yellow-500 to-amber-600",
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      stats: "University Format",
      url: '/research-area-identification'
    },
    {
      title: "Thesis Chapter Writing",
      description: "Generate complete thesis chapters like Introduction, Methodology, Results, and Conclusion based on your data and goals.",
      icon: "📘",
      gradient: "from-cyan-500 to-teal-600",
      color: "text-cyan-700",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-300",
      stats: "Chapter-wise",
      url: '/research-area-identification'
    },
    {
      title: "Mock Viva AI Chatbot",
      description: "Simulate real viva sessions with an AI-powered chatbot that asks relevant field-specific questions based on your thesis.",
      icon: "🤖",
      gradient: "from-gray-600 to-gray-800",
      color: "text-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-300",
      stats: "Smart QA",
      url: '/research-area-identification'
    },
    {
      title: "Citation & Bibliography Generator",
      description: "Format references in APA, MLA, Chicago, Harvard, or IEEE styles from source URLs, papers, or manual entries.",
      icon: "🔖",
      gradient: "from-orange-500 to-amber-600",
      color: "text-orange-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300",
      stats: "6+ Styles",
      url: '/research-area-identification'
    },
    {
      title: "Research Article Writer",
      description: "Turn your thesis into a journal-ready article compatible with Scopus, Web of Science, or SCI with all formal sections.",
      icon: "📰",
      gradient: "from-red-500 to-rose-600",
      color: "text-red-700",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-300",
      stats: "Journal-Ready",
      url: '/research-area-identification'
    }
  ];

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlay || isHovered) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentFeature((current) => (current + 1) % features.length);
          return 0;
        }
        return prev + 0.5; // Slower progress
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [features.length, isAutoPlay, isHovered]);

  const handleFeatureClick = (index) => {
    setCurrentFeature(index);
    setProgress(0);
    setIsAutoPlay(false);
    router.push(features[index].url);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const nextFeature = () => {
    setCurrentFeature((current) => (current + 1) % features.length);
    setProgress(0);
  };

  const prevFeature = () => {
    setCurrentFeature((current) => (current - 1 + features.length) % features.length);
    setProgress(0);
  };

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200/50 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex gap-1">
              <motion.div 
                className="w-1.5 h-1.5 bg-orange-400 rounded-full"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <motion.div 
                className="w-1.5 h-1.5 bg-red-500 rounded-full"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div 
                className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <span className="text-xs font-semibold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              Accelerate Your Research with
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
              Intelligent Tools
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Experience <span className="font-semibold text-orange-600">cutting-edge AI</span> that transforms your research process with 
            <span className="font-semibold text-blue-600"> precision and efficiency</span>.
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Features List */}
          <motion.div 
            className="space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar pr-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                onClick={() => handleFeatureClick(index)}
                className={`group relative p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                  currentFeature === index
                    ? `bg-white ${feature.borderColor} shadow-lg scale-[1.02] ring-4 ring-opacity-20`
                    : `${feature.bgColor} ${feature.borderColor} hover:bg-white hover:shadow-md`
                }`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Progress bar for active feature */}
                {currentFeature === index && (
                  <motion.div 
                    className="absolute top-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-t-xl" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                )}

                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <motion.div 
                    className={`relative text-2xl p-3 rounded-xl ${feature.bgColor} ${feature.borderColor} border-2 transition-all duration-500 flex-shrink-0 ${
                      currentFeature === index ? 'animate-bounce' : 'group-hover:scale-110'
                    }`}
                    whileHover={{ rotate: 10 }}
                  >
                    {feature.icon}
                    
                    {/* Floating particles */}
                    {currentFeature === index && (
                      <>
                        <motion.div 
                          className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-orange-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <motion.div 
                          className="absolute -bottom-1 -left-1 w-1 h-1 bg-pink-400 rounded-full"
                          animate={{ scale: [1, 1.8, 1], opacity: [1, 0.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        />
                      </>
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className={`text-lg font-bold transition-colors duration-300 ${
                        currentFeature === index ? feature.color : 'text-gray-800 group-hover:' + feature.color
                      }`}>
                        {feature.title}
                      </h3>
                      
                      {/* Stats badge */}
                      <motion.div 
                        className={`px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 flex-shrink-0 ${
                          currentFeature === index 
                            ? `bg-gradient-to-r ${feature.gradient} text-white` 
                            : `${feature.bgColor} ${feature.color}`
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {feature.stats}
                      </motion.div>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Visualization */}
          <motion.div 
            className="min-h-[90vh]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="sticky top-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/50 shadow-xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Animated background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${features[currentFeature].gradient} opacity-5 transition-all duration-500`}></div>
                  
                  {/* Floating elements */}
                  <motion.div 
                    className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-xl opacity-50"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute bottom-4 left-4 w-10 h-10 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-xl opacity-50"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  />

                  <div className="relative text-center transition-all duration-500">
                    {/* Navigation Controls */}
                    <div className="flex justify-between items-center mb-6">
                      <motion.button
                        onClick={prevFeature}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Previous feature"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </motion.button>

                      <div className="text-sm text-gray-500 font-medium">
                        {currentFeature + 1} / {features.length}
                      </div>

                      <motion.button
                        onClick={nextFeature}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Next feature"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Icon with animation */}
                    <motion.div 
                      className="text-5xl mb-5 transition-all duration-500"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <div className="relative inline-block">
                        {features[currentFeature].icon}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 opacity-20 rounded-full blur-xl"
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.2, 0.4, 0.2]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity
                          }}
                        />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold mb-3 transition-all duration-500 bg-gradient-to-r ${features[currentFeature].gradient} bg-clip-text text-transparent`}>
                      {features[currentFeature].title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-6">
                      {features[currentFeature].description}
                    </p>

                    {/* Interactive dots */}
                    <motion.div 
                      className="flex justify-center gap-2 mb-6 flex-wrap"
                      layout
                    >
                      {features.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleFeatureClick(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            currentFeature === index 
                              ? `bg-gradient-to-r ${features[index].gradient} scale-125` 
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          whileHover={{ scale: 1.3 }}
                          aria-label={`Feature ${index + 1}`}
                          layout
                        />
                      ))}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.button 
                      className="group relative px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(features[currentFeature].url)}
                    >
                      <span className="relative z-10">Try This Feature</span>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div 
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="group bg-gray-50 py-2 cursor-pointer hover:bg-gray-100 rounded-2xl hover:border-black hover:border-dotted"
              onClick={() => handleFeatureClick(index)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`text-xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent mb-1 transition-transform duration-200 group-hover:scale-110`}>
                {feature.stats}
              </div>
              <div className="text-xs text-gray-600 font-medium">{feature.title.split(' ')[0]}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #ec4899);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #db2777);
        }
      `}</style>
    </section>
  );
};

export default Features;