import React, { useState, useEffect } from 'react';
import { ChevronRight, FileText, Search, Brain, Edit, CheckCircle, Lightbulb, BookOpen, Users, Target, Bookmark } from 'lucide-react';

export default function ResearchPaperGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());

 const steps = [
  {
    id: 1,
    title: "Input Research Basics",
    description: "Provide core research details",
    icon: FileText, // use any icon like FileText or Edit
    details: [
      "Enter subject/domain",
      "Specify specialization",
      "Mention relevant keywords"
    ],
    color: "from-blue-500 to-sky-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    id: 2,
    title: "Instant Title Suggestion",
    description: "Get quick titles using AI",
    icon: Lightbulb, // symbol of fast idea generation
    details: [
      "Keyword-mapped title ideas",
      "Super-fast title generation",
      "Based on basic inputs only"
    ],
    color: "from-yellow-400 to-orange-400",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  {
    id: 3,
    title: "Deep Literature Search",
    description: "Search thousands of papers smartly",
    icon: Search,
    details: [
      "Similarity-based paper search",
      "Filter by relevance & recency",
      "Intelligent paper clustering"
    ],
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    id: 4,
    title: "Top Paper Selection",
    description: "Pick 3 most relatable papers",
    icon: Bookmark,
    details: [
      "Ranked by similarity & domain",
      "Filter based on methodology",
      "Smart match to your idea"
    ],
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200"
  },
  {
    id: 5,
    title: "Gap & Novelty Analysis",
    description: "Analyze what's missing and what's new",
    icon: Brain,
    details: [
      "Compare core contributions",
      "Identify gaps and limitations",
      "Understand common methodologies"
    ],
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    id: 6,
    title: "Custom Title Generation",
    description: "Generate refined research-specific title",
    icon: Target,
    details: [
      "Gap-bridging title suggestions",
      "Based on selected papers",
      "Classified and scoped by domain"
    ],
    color: "from-cyan-500 to-teal-500",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200"
  }
];


  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        setCurrentStep(prev => (prev + 1) % steps.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentStep, steps.length]);

  const handleStepClick = (index) => {
    setCurrentStep(index);
    setCompletedSteps(prev => new Set([...prev, index]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg border border-white/20">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700">Research Paper Title Generation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Academic Excellence
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A systematic approach to generating high-quality research papers with synchronized methodology
          </p>
        </div>

        {/* Progress Timeline */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Research Process Timeline</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
              <span>Auto-progressing</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-200"></div>
            <div 
              className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
            
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`relative flex flex-col items-center group transition-all duration-300 ${
                    index <= currentStep ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <div className={`
                    w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 transform
                    ${index === currentStep 
                      ? `bg-gradient-to-r ${step.color} border-white shadow-lg scale-110` 
                      : completedSteps.has(index)
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-white shadow-md'
                        : 'bg-white border-slate-300'
                    }
                    ${isAnimating && index === currentStep ? 'animate-pulse' : ''}
                    hover:scale-105 cursor-pointer
                  `}>
                    {completedSteps.has(index) && index !== currentStep ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <step.icon className={`w-6 h-6 ${
                        index === currentStep ? 'text-white' : 
                        completedSteps.has(index) ? 'text-white' : 'text-slate-400'
                      }`} />
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                    index <= currentStep ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    Step {step.id}
                    
                  </span>
                  <br></br>
                   <span className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                    index <= currentStep ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {step.title}
                    
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Step Detail */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className={`
            p-8 rounded-3xl border-2 transition-all duration-700 transform
            ${steps[currentStep].bgColor} ${steps[currentStep].borderColor}
            ${isAnimating ? 'scale-105 shadow-xl' : 'shadow-lg'}
          `}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${steps[currentStep].color} flex items-center justify-center shadow-lg`}>
                <steps className="w-8 h-8 text-white" />
                {
                     [currentStep].icon 
                }
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                  {steps[currentStep].title}
                </h3>
                <p className="text-slate-600">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {steps[currentStep].details.map((detail, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/50 rounded-xl transition-all duration-300 hover:bg-white/70"
                >
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700 font-medium">{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Representation */}
          <div className="p-8 bg-white/70 backdrop-blur-sm rounded-3xl border-2 border-white/30 shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Process Visualization</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`
                    flex items-center gap-4 p-4 rounded-xl transition-all duration-500
                    ${index === currentStep 
                      ? `bg-gradient-to-r ${step.color} text-white shadow-lg transform scale-105` 
                      : completedSteps.has(index)
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-slate-100 text-slate-500'
                    }
                  `}
                >
                  <step.icon className={`w-5 h-5 ${
                    index === currentStep ? 'text-white' : 
                    completedSteps.has(index) ? 'text-green-600' : 'text-slate-400'
                  }`} />
                  <span className="font-medium">{step.title}</span>
                  {completedSteps.has(index) && index !== currentStep && (
                    <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <button
            onClick={() => handleStepClick((currentStep + 1) % steps.length)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span>Next Step</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}