"use client";

import { useAuth } from '@/app/Context/UserAuth';
import { AuthenticateProfile } from '@/app/Services/Auth';
import { handelResearchAresEnquiry } from '@/app/Services/Research-Ientification';
import { Award, Atom, BookCopy, BookOpenText, BrainCircuit, ChevronDown, Dna, Download, FlaskConical, Info, Loader, Plus, Search, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';


// --- Self-Contained Component Styles ---
const formInputClasses = "block w-full px-4 py-2 bg-stone-100 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-500 focus:bg-white transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed";
const buttonPrimaryClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-md disabled:transform-none";
const buttonSecondaryClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors duration-200 disabled:opacity-60";
const buttonDangerClasses = "w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:-translate-y-0.5";

const Page = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [showInsufficientTokenPopup, setShowInsufficientTokenPopup] = useState(false);
  
  // Refs for scrolling
  const formRef = useRef(null);
  
  // Form States
  const [formData, setFormData] = useState({
    highest_qualification: '',
    specialization: '',
    interests: [''],
    career_goals: '',
    openaikey: process.env.NEXT_PUBLIC_OPEN_API_KEY,
    tokensToDebit: 10,
    description: "Research Area Identification"
  });
  const [formError, setFormError] = useState('');
  
  // AI Response States
  const [aiResponse, setAiResponse] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const responseRef = useRef(null);

  // Authentication & Initial Load
  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const res = await AuthenticateProfile();
        if (!res.data) {
          router.push('/auth/login');
          return;
        }
        setUser(res.data);
        if (!res.data.tokenAccount || res.data.tokenAccount.balance < formData.tokensToDebit) {
           setShowInsufficientTokenPopup(true);
        }
      } catch (err) {
        console.error("Authentication failed:", err);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    checkUserAccess();
  }, [router, setUser, formData.tokensToDebit]);

  // Form Handlers
  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleInterestChange = (index, value) => {
    const newInterests = [...formData.interests];
    newInterests[index] = value;
    setFormData(prev => ({ ...prev, interests: newInterests }));
  };
  const addInterest = () => setFormData(prev => ({ ...prev, interests: [...prev.interests, ''] }));
  const removeInterest = (index) => {
    if (formData.interests.length > 1) {
      setFormData(prev => ({ ...prev, interests: prev.interests.filter((_, i) => i !== index) }));
    }
  };

  // Main AI Generation Logic
  const handleGenerateResponse = async () => {
    if (!formData.highest_qualification || !formData.specialization || formData.interests.some(i => !i.trim())) {
      setFormError('Please fill in all required fields to get the best results.');
      return;
    }
    setFormError('');
    setIsGenerating(true);
    setAiResponse(null);

    try {
      const requestData = { ...formData, interests: formData.interests.filter(i => i.trim() !== '') };
      const response = await handelResearchAresEnquiry(requestData);
      setAiResponse(response.results);
      setTimeout(() => responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (error) {
      console.error('Error generating research suggestions:', error);
      setAiResponse({ error: 'An unexpected error occurred. Please check your connection and try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      highest_qualification: '',
      specialization: '',
      interests: [''],
      career_goals: ''
    });
    setAiResponse(null);
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // PDF Generation with improved styling
  function mapScoreToWidth(score) {

  return (score / 5) * 50;

}


const generatePDF = () => {
  const doc = new jsPDF();
  const marginLeft = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Set default font
  doc.setFont('helvetica');

  // Add header with gradient background
  doc.setFillColor(40, 60, 120);
  doc.rect(0, 0, pageWidth, 15, 'F');
  
  // Header text
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Research Area Analysis", pageWidth / 2, 10, { align: 'center' });
y+=2
  // Main title
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 90);
  doc.setFont('helvetica', 'bold');
  doc.text(`Research Analysis Report`, marginLeft, y);
  
  y += 8;
  
  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 120);
  doc.setFont('helvetica', 'normal');
  doc.text(`Specialization: ${formData.specialization}`, marginLeft, y);
  y += 6;
  doc.text(`Interest Area: ${formData.interests}`, marginLeft, y);
  
  y += 15;

  // Add divider
  doc.setDrawColor(200, 200, 220);
  doc.line(marginLeft, y, pageWidth - marginLeft, y);
  y += 10;

  // Section title
  doc.setFontSize(14);
  doc.setTextColor(40, 60, 120);
  doc.setFont('helvetica', 'bold');
  doc.text("Suggested Research Features", marginLeft, y);
  y += 10;

  aiResponse.suggested_research_features.forEach((item, index) => {
    // Feature container with subtle shadow effect
    doc.setDrawColor(220, 220, 235);
    doc.setFillColor(248, 249, 255);
    doc.roundedRect(marginLeft, y, pageWidth - marginLeft * 2, 40, 3, 3, 'FD');
    
    // Feature Name with icon
    doc.setFontSize(12);
    doc.setTextColor(30, 50, 100);
    doc.setFont('helvetica', 'bold');
    doc.text(` ${item.feature_name}`, marginLeft + 5, y + 8);
    
    // Description
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 80);
    doc.setFont('helvetica', 'normal');
    const splitDesc = doc.splitTextToSize(item.brief_description, pageWidth - marginLeft * 2 - 10);
    doc.text(splitDesc, marginLeft + 5, y + 18);
    
    // Relevance Score with visual indicator
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 120);
    
    // Draw score bar
    const scoreWidth = mapScoreToWidth(item.relevance_score);
    doc.setFillColor(230, 230, 240);
    doc.rect(marginLeft + 5, y + 32, 50, 5, 'F');
    doc.setFillColor(70, 100, 180);
    doc.rect(marginLeft + 5, y + 32, scoreWidth, 5, 'F');
    
    // Score text
    doc.text(`Relevance: ${item.relevance_score}/5`, marginLeft + 60, y + 36);

    y += 45;

    // Add small space between items except last
    if (index < aiResponse.suggested_research_features.length - 1) {
      y += 5;
    }

    // Handle page overflow
    if (y > 260) {
      doc.addPage();
      y = 20;
      
      // Add header to new page
      doc.setFillColor(40, 60, 120);
      doc.rect(0, 0, pageWidth, 15, 'F');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text("Research Area Analysis (continued)", pageWidth / 2, 10, { align: 'center' });
    }
  });

  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 290, { align: 'center' });

  doc.save("research_analysis_report.pdf");
};

  // Loading State UI
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-amber-500 animate-spin" />
          <p className="text-lg font-semibold text-slate-600">Preparing Your Workspace...</p>
        </div>
      </div>
    );
  }

  // Main Component Render
  return (
    <>
      <main className="min-h-screen bg-stone-50 text-slate-800 antialiased">
        <div className="relative isolate overflow-hidden">
            {/* Decorative Gradients */}
            <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
              <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#fb923c] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
            </div>
            
            {/* --- HEADER SECTION --- */}
            <header className="relative pt-24 pb-12 sm:pt-32 sm:pb-20">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-x-12 gap-y-16">
                {/* Left Column: Text Content */}
                <div className="flex flex-col justify-center text-center lg:text-left">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <span className="inline-flex items-center gap-x-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                        AI-Powered Research Tool
                        <Sparkles className="h-4 w-4 text-amber-600" />
                      </span>
                    </motion.div>
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
                    >
                      Unlock Your Next Research Breakthrough
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                      className="mt-6 text-lg max-w-2xl mx-auto lg:mx-0 leading-8 text-slate-600"
                    >
                      Stop the endless search. Our AI analyzes your academic profile to pinpoint novel, high-impact research areas perfect for your expertise and career goals.
                    </motion.p>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                      className="mt-10 flex items-center justify-center lg:justify-start gap-x-6"
                    >
                      <button onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })} className={buttonPrimaryClasses}>
                        Start Discovery <ArrowRight className="h-5 w-5" />
                      </button>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                      className="mt-8 flex items-center justify-center lg:justify-start gap-x-3"
                    >
                      <div className="flex -space-x-2 overflow-hidden">
                          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User"/>
                          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User"/>
                          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="User"/>
                      </div>
                      <p className="text-sm text-slate-500"><span className="font-semibold text-slate-700">12k+</span> researchers have started here.</p>
                    </motion.div>
                </div>
                {/* Right Column: Visual Element */}
                <div className="relative row-start-1 lg:col-start-2 flex items-center justify-center">
                    <IdeaCloud />
                </div>
              </div>
            </header>
              <HowItWorks />
            {/* Main Form Section */}
            <motion.section 
              ref={formRef}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto px-6 lg:px-8 pb-20 scroll-mt-20"
            >
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Build Your Research Profile</h2>
                  <p className="text-slate-500 mb-6">Provide your details and let our AI do the heavy lifting.</p>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormInput 
                        label="Highest Qualification *" 
                        as='select'
                        value={formData.highest_qualification} 
                        onChange={(e) => handleInputChange('highest_qualification', e.target.value)} 
                        selectOptions={["Bachelor's Degree", "Master's Degree", "Ph.D.", "Post-Doctoral"]}
                        helperText="Select the highest degree you have obtained or are pursuing."
                        disabled={isGenerating} 
                      />


                      
                      <FormInput 
                        label="Specialization *" 
                        value={formData.specialization} 
                        onChange={(e) => handleInputChange('specialization', e.target.value)} 
                        placeholder="e.g., Artificial Intelligence" 
                        helperText="Your primary field of study or expertise."
                        disabled={isGenerating} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Research Interests *</label>
                      <p className="text-xs text-slate-500 mb-2">List specific topics or keywords you're passionate about.</p>
                      <div className="space-y-3">
                        {formData.interests.map((interest, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input type="text" value={interest} onChange={(e) => handleInterestChange(index, e.target.value)} placeholder={`Interest ${index + 1}`} className={formInputClasses} disabled={isGenerating} />
                            {formData.interests.length > 1 && <button type="button" onClick={() => removeInterest(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-md transition-colors" disabled={isGenerating}><Trash2 className="w-5 h-5" /></button>}
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={addInterest} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors" disabled={isGenerating}><Plus className="w-4 h-4"/>Add Interest</button>
                    </div>
                    <FormInput 
                      label="Career Goals (Optional)" 
                      value={formData.career_goals} 
                      onChange={(e) => handleInputChange('career_goals', e.target.value)} 
                      placeholder="e.g., A career in academia, R&D in a tech firm..." 
                      as="textarea"
                      helperText="Describe your ambitions to help us align suggestions with your future path." 
                      disabled={isGenerating} 
                    />
                  </div>
                  <div className="mt-8 border-t border-slate-200 pt-6">
                    <AnimatePresence>
                      {formError && <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm text-red-600 text-center mb-4">{formError}</motion.p>}
                    </AnimatePresence>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={handleGenerateResponse} disabled={isGenerating} className={`${buttonPrimaryClasses} w-full sm:w-auto flex-1`}>
                        {isGenerating ? <><Loader className="w-5 h-5 animate-spin"/>Generating...</> : <><Sparkles className="w-5 h-5"/>Get Suggestions</>}
                      </button>
                      {aiResponse && <button onClick={resetForm} className={buttonSecondaryClasses}>Start Over</button>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
            
            {/* AI Response Section */}
            <AnimatePresence>
              {aiResponse && (
                <motion.section 
                  ref={responseRef}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="max-w-4xl mx-auto px-6 lg:px-8 pb-24"
                >
                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
                    <div className="p-8">
                      <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Personalized Research Suggestions</h2>
                      {aiResponse.error ? (
                        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3"><Info className="w-5 h-5"/>{aiResponse.error}</div>
                      ) : (
                        <div className="space-y-6">
                          {aiResponse.suggested_research_features?.map((feature, index) => (
                            <div key={index} className="p-6 bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all duration-300">
                               <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-3">
                                <h3 className="text-xl font-semibold text-slate-800">{feature.feature_name}</h3>
                                <div className={`px-3 py-1 text-xs font-medium rounded-full border ${getRelevanceColor(feature.relevance_score)}`}>Relevance: {feature.relevance_score}/5</div>
                               </div>
                               <p className="text-slate-500 mb-4">{feature.brief_description}</p>
                               <div className="text-sm font-medium text-slate-600"><strong>Domain:</strong> {feature.research_domain}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-8 border-t border-slate-200 pt-6 flex justify-end">
                         <button onClick={generatePDF} className={buttonPrimaryClasses}><Download className="w-5 h-5"/>Download as PDF</button>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
        </div>
        
        {/* How It Works Section */}
       
        {/* FAQ Section */}
        <FAQ />
      </main>
      
      {/* Insufficient Token Popup */}
      <AnimatePresence>
        {showInsufficientTokenPopup && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
             <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white rounded-2xl shadow-xl max-w-sm w-full text-center p-8">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Info className="w-8 h-8 text-red-500" />
               </div>
               <h2 className="text-xl font-bold text-slate-800 mb-2">Insufficient Tokens</h2>
               <p className="text-slate-500 mb-6">You need more tokens to use this feature. Please top up your account to continue.</p>
               <button onClick={() => router.push('/')} className={buttonDangerClasses}>Go to Dashboard</button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Reusable & Helper Components ---

const IdeaCloud = () => {
  const mouseX = useSpring(0, { stiffness: 50, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 100 });
  
  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left - width / 2);
    mouseY.set(clientY - top - height / 2);
  }

  const icons = [
    { icon: Atom, className: "w-16 h-16 text-sky-500 top-0 left-1/4", rotate: -15 },
    { icon: Dna, className: "w-12 h-12 text-emerald-500 top-1/4 right-0", rotate: 20 },
    { icon: BrainCircuit, className: "w-20 h-20 text-indigo-500 top-1/2 left-0 -translate-y-1/2", rotate: 5 },
    { icon: FlaskConical, className: "w-12 h-12 text-rose-500 bottom-1/4 left-10", rotate: -25 },
    { icon: BookOpenText, className: "w-16 h-16 text-amber-500 bottom-0 right-1/4", rotate: 10 },
    { icon: Sparkles, className: "w-10 h-10 text-violet-500 top-5 right-10", rotate: -5 },
  ];

  return (
    <motion.div 
      onMouseMove={onMouseMove}
      className="w-full h-80 sm:h-96 relative"
    >
      <div className="absolute inset-0 bg-amber-100/30 rounded-full blur-3xl"></div>
      {icons.map((item, index) => {
        const x = useTransform(mouseX, [-200, 200], [item.rotate > 0 ? -20 : 20, item.rotate > 0 ? 20 : -20]);
        const y = useTransform(mouseY, [-200, 200], [item.rotate > 0 ? -20 : 20, item.rotate > 0 ? 20 : -20]);
        
        return (
          <motion.div
            key={index}
            style={{ x, y, rotate: item.rotate }}
            animate={{ y: [0, item.rotate, 0] }}
            transition={{ duration: 5 + index * 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            className={`absolute ${item.className} opacity-70`}
          >
            <item.icon className="w-full h-full drop-shadow-lg" />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

const getRelevanceColor = (score) => {
    if (score >= 4) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 3) return 'bg-sky-50 text-sky-700 border-sky-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
};

const FormInput = ({ label, as = 'input', selectOptions, helperText, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
        {as === 'select' ? (
            <select className={formInputClasses} {...props}>
                <option value="">Select an option...</option>
                {selectOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        ) : as === 'textarea' ? (
            <textarea className={`${formInputClasses} h-24 resize-none`} {...props} />
        ) : (
            <input className={formInputClasses} {...props} />
        )}
        {helperText && <p className="text-xs text-slate-500 mt-1.5 px-1">{helperText}</p>}
    </div>
);

const HowItWorks = () => (
  <section className="py-24 bg-white/50 border-t border-slate-200">
    <div className="max-w-5xl mx-auto px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">How It Works</h2>
        <p className="mt-4 text-lg leading-8 text-slate-600">Transform your research journey in three simple steps.</p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once: true}} transition={{delay: 0.1}} className="flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4"><Award className="w-8 h-8 text-orange-600"/></div>
          <h3 className="text-xl font-semibold text-slate-800">1. Share Your Research query</h3>
          <p className="mt-2 text-slate-500">Enter your qualifications, specialization, and areas of interest. The more detail, the better the suggestions.</p>
        </motion.div>
        <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once: true}} transition={{delay: 0.2}} className="flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4"><Search className="w-8 h-8 text-orange-600"/></div>
          <h3 className="text-xl font-semibold text-slate-800">2. Powered Analysis</h3>
          <p className="mt-2 text-slate-500">Our algorithm scans millions of publications and trends to find the perfect academic niche for you.</p>
        </motion.div>
        <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once: true}} transition={{delay: 0.3}} className="flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4"><BookCopy className="w-8 h-8 text-orange-600"/></div>
          <h3 className="text-xl font-semibold text-slate-800">3. Receive Your Topics</h3>
          <p className="mt-2 text-slate-500">Get a curated list of novel, relevant, and high-impact research areas, complete with descriptions.</p>
        </motion.div>
      </div>
    </div>
  </section>
);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const faqs = [
        { q: "How does the AI identify suitable research areas?", a: "Our AI uses a sophisticated language model trained on a massive dataset of academic literature. It cross-references your profile (qualification, interests) with emerging trends, citation velocity, and gaps in current research to identify novel and viable topics." },
        { q: "Is the generated content original and plagiarism-free?", a: "Absolutely. The AI generates descriptions and suggestions from scratch based on its analysis. It does not copy-paste from existing papers. However, we always recommend using the suggestions as a starting point for your own unique research." },
        { q: "What academic fields do you support?", a: "Our tool is designed to be domain-agnostic and supports a wide range of fields, from STEM (Science, Technology, Engineering, and Mathematics) to humanities, social sciences, and arts. The quality of suggestions is highest in fields with a large body of published digital literature." },
        { q: "How many tokens does one search cost?", a: "A standard search for research areas costs 10 tokens. This allows our AI to perform a comprehensive analysis to provide you with high-quality, personalized results. You can always check your token balance in your account dashboard." }
    ];

    return (
        <section className="py-24 bg-stone-50">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">Frequently Asked Questions</h2>
                    <p className="mt-4 text-lg leading-8 text-slate-600">Have questions? We have answers.</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                            <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex justify-between items-center text-left p-5 bg-white hover:bg-slate-50 transition-colors">
                                <span className="font-semibold text-slate-700">{faq.q}</span>
                                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="p-5 pt-0 text-slate-500 leading-relaxed">{faq.a}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Page;