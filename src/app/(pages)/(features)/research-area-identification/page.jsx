'use client'

import { useAuth } from '@/app/Context/UserAuth'
import { AuthenticateProfile } from '@/app/Services/Auth'
import { handelResearchAresEnquiry } from '@/app/Services/Research-Ientification'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'

const Page = () => {
  const { user, setUser } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [showInsufficientTokenPopup, setShowInsufficientTokenPopup] = useState(false)
  
  // Research Feature Form States
  const [formData, setFormData] = useState({
    highest_qualification: '',
    specialization: '',
    interests: [''],
    career_goals: '',
    openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY,
    tokensToDebit: 10,
    description: "Research Area Identification"
  })
  const [aiResponse, setAiResponse] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  
  // Refs for scrolling
  const responseRef = useRef(null)

  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const res = await AuthenticateProfile()
        console.log(res)
        
        if (!res.data) {
          router.push('/auth/login')
          return
        }

        setUser(res.data)

        if (!res.data.tokenAccount || res.data.tokenAccount.balance <= 1) {
          // setShowInsufficientTokenPopup(true)
        }
      } catch (err) {
        console.log(err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkUserAccess()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleInterestChange = (index, value) => {
    const newInterests = [...formData.interests]
    newInterests[index] = value
    setFormData(prev => ({
      ...prev,
      interests: newInterests
    }))
  }

  const addInterest = () => {
    setFormData(prev => ({
      ...prev,
      interests: [...prev.interests, '']
    }))
  }

  const removeInterest = (index) => {
    if (formData.interests.length > 1) {
      const newInterests = formData.interests.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        interests: newInterests
      }))
    }
  }

  const handleGenerateResponse = async () => {
    // Validate required fields
    if (!formData.highest_qualification || !formData.specialization || formData.interests.some(interest => !interest.trim())) {
      alert('Please fill in all required fields!')
      return
    }

    setIsGenerating(true)
    setShowResponse(false)

    try {
      // Clean up interests array
      const cleanedInterests = formData.interests.filter(interest => interest.trim() !== '')
      const requestData = {
        ...formData,
        interests: cleanedInterests
      }

      const response = await handelResearchAresEnquiry(requestData)
      console.log(response)
      
      if (response.results) {
        setAiResponse(response.results)
        setShowResponse(true)
      }
      
      // Scroll to response section
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)
      
    } catch (error) {
      console.error('Error generating research suggestions:', error)
      setAiResponse({ error: 'Sorry, there was an error generating research suggestions. Please try again.' })
      setShowResponse(true)
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setFormData({
      highest_qualification: '',
      specialization: '',
      interests: [''],
      career_goals: ''
    })
    setAiResponse(null)
    setShowResponse(false)
  }

  const getRelevanceColor = (score) => {
    if (score === 5) return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    if (score === 4) return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-amber-100 text-amber-800 border-amber-200'
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



// Helper function to map score to visual width
function mapScoreToWidth(score) {
  return (score / 5) * 50;
}


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full mb-4 animate-pulse">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Verifying Access...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-blue-500/10 backdrop-blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-6">
            Research Area Identification
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover personalized research opportunities tailored to your academic profile and career aspirations
          </p>
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="px-4 sm:px-6 py-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Build Your Research Profile</h2>
              <p className="text-indigo-100">Tell us about your academic background and research interests</p>
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Highest Qualification */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                    Highest Qualification *
                  </label>
                  <select
                    value={formData.highest_qualification}
                    onChange={(e) => handleInputChange('highest_qualification', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 outline-none disabled:opacity-50"
                    disabled={isGenerating}
                  >
                    <option value="">Select your qualification</option>
                    <option value="Bachelor's">Bachelor's Degree</option>
                    <option value="Master's">Master's Degree</option>
                    <option value="Ph.D.">Ph.D.</option>
                    <option value="Post-Doc">Post-Doctoral</option>
                  </select>
                </div>

                {/* Specialization */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Specialization *
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    placeholder="e.g., Biotechnology, Computer Science, Physics"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none disabled:opacity-50"
                    disabled={isGenerating}
                  />
                </div>
              </div>

              {/* Research Interests */}
              <div className="mt-6 space-y-4">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Research Interests *
                </label>
                <div className="space-y-3">
                  {formData.interests.map((interest, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={interest}
                          onChange={(e) => handleInterestChange(index, e.target.value)}
                          placeholder={`Interest ${index + 1} (e.g., Machine Learning, Genomics, Quantum Computing)`}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 outline-none disabled:opacity-50"
                          disabled={isGenerating}
                        />
                      </div>
                      {formData.interests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInterest(index)}
                          className="flex items-center justify-center w-10 h-10 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                          disabled={isGenerating}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addInterest}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200 disabled:opacity-50"
                  disabled={isGenerating}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Another Interest
                </button>
              </div>

              {/* Career Goals */}
              <div className="mt-6 space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                  <svg className="w-4 h-4 mr-2 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Career Goals (Optional)
                </label>
                <textarea
                  value={formData.career_goals}
                  onChange={(e) => handleInputChange('career_goals', e.target.value)}
                  placeholder="Share your career aspirations, research objectives, and long-term goals..."
                  className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 outline-none disabled:opacity-50"
                  disabled={isGenerating}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={handleGenerateResponse}
                  disabled={isGenerating || !formData.highest_qualification || !formData.specialization}
                  className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating Insights...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get Research Suggestions
                    </div>
                  )}
                </button>
                
                {showResponse && (
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Form
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Response Section */}
      {showResponse && (
        <div ref={responseRef} className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Your Personalized Research Suggestions
                </h2>
                <p className="text-indigo-100">AI-powered recommendations based on your profile</p>
              </div>
              
              <div className="p-8">
                {aiResponse?.error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {aiResponse.error}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {aiResponse?.suggested_research_features?.map((feature, index) => (
                      <div key={index} className="group bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                          <h3 className="text-lg md:text-xl font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {feature.feature_name}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRelevanceColor(feature.relevance_score)}`}>
                              <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              Relevance: {feature.relevance_score}/5
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                              <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              {feature.research_domain}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-slate-700 leading-relaxed">
                          {feature.brief_description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>generatePDF()}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                   <Download></Download>
                    Download PDF
                  </button>
                  
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Back to Top
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Token Popup */}
      {showInsufficientTokenPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full text-center overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed text-sm">
                You're logged in, but your account doesn't have enough tokens to access this service.
              </p>
              <button
                onClick={() => {
                  setShowInsufficientTokenPopup(false)
                  router.push('/')
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-200"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page