"use client"
import React, { useEffect, useState } from 'react'

const Features = () => {
  const features = [
    {
      title: "Research Area Identification",
      description: "AI analyzes your qualifications and interests to suggest trending research domains with keyword mapping from recent literature.",
      icon: "🧭",
      gradient: "from-orange-300 to-orange-600",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      stats: "Trending Topics"
    },
    {
      title: "Title Generator for Research",
      description: "Get original, compelling, and field-aligned research titles for papers, theses, or dissertations using AI suggestions.",
      icon: "🏷️",
      gradient: "from-orange-300 to-orange-600",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      stats: "1000+ Titles"
    },
    {
      title: "AI Literature Review Builder",
      description: "Build structured, comprehensive literature reviews using the latest papers and critical analysis of user-specified topics.",
      icon: "📚",
      gradient: "from-orange-300 to-orange-600",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      stats: "Auto-Sourced"
    },
    {
      title: "Research Methodology Generator",
      description: "Recommends appropriate research methods including qualitative, quantitative, or mixed, with sampling and analysis suggestions.",
      icon: "🧪",
      gradient: "from-orange-300 to-orange-600",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      stats: "Field-Specific"
    },
    {
      title: "Synopsis / Proposal Creator",
      description: "Create full synopses or proposals with objectives, hypotheses, methodology, significance, and timelines as per university format.",
      icon: "📄",
      gradient: "from-orange-300 to-orange-600",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      stats: "University Format"
    },
    {
      title: "Thesis Chapter Writing",
      description: "Generate complete thesis chapters like Introduction, Methodology, Results, and Conclusion based on your data and goals.",
      icon: "📘",
      gradient: "from-orange-300 to-orange-600",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      stats: "Chapter-wise"
    },
    {
      title: "Mock Viva AI Chatbot",
      description: "Simulate real viva sessions with an AI-powered chatbot that asks relevant field-specific questions based on your thesis.",
      icon: "🤖",
      gradient: "from-orange-300 to-orange-600",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      stats: "Smart QA"
    },
    {
      title: "Citation & Bibliography Generator",
      description: "Format references in APA, MLA, Chicago, Harvard, or IEEE styles from source URLs, papers, or manual entries.",
      icon: "🔖",
      gradient: "from-orange-300 to-orange-600",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      stats: "6+ Styles"
    },
    {
      title: "Research Article Writer",
      description: "Turn your thesis into a journal-ready article compatible with Scopus, Web of Science, or SCI with all formal sections.",
      icon: "📰",
      gradient: "from-orange-300 to-orange-600",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      stats: "Journal-Ready"
    }
  ];

  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden bg-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500"></div>
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-amber-100 opacity-20 mix-blend-multiply filter blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-orange-100 opacity-20 mix-blend-multiply filter blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
            Elevate Your Research Process
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered tools designed to accelerate every stage of your academic research journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative rounded-2xl overflow-hidden shadow-lg hover:scale-105 cursor-pointer transition-all duration-300 ${hoveredCard === index ? 'shadow-xl' : 'shadow-md'}`}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br opacity-90 ${feature.gradient}`}></div>
              
              {/* Card content */}
              <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Icon */}
                <a href='/title-generation' className="mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center text-3xl`}>
                    {feature.icon}
                  </div>
                </a>
                
                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-amber-50 mb-6 flex-grow">{feature.description}</p>
                
                {/* Stats */}
                <div className="mt-auto">
                  <div className={`inline-block px-4 py-2 rounded-full ${feature.bgColor} ${feature.color} text-sm font-semibold`}>
                    {feature.stats}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 transform">
            Start Your Research Journey
          </button>
        </div>
      </div>
    </section>
  )
}

export default Features