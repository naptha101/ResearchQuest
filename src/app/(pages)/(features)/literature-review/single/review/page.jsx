"use client"
import { finalReview, generateCitation, generateContext, generateTitle, summarizeReview } from '@/app/Services/Literature_Review'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FileText, Quote, BookOpen, CheckCircle, AlertCircle, BookAIcon, ChevronRight, RefreshCw } from 'lucide-react'
import { handleRegister } from '@/app/Services/Auth'

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 w-full h-full"></div>
    </div>
  )
}

const LoadingCard = ({ icon: Icon, title, subtitle, isLoading, hasError, children }) => {
  return (
    <div className="bg-white col-span-2 rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl group">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg transition-colors ${isLoading ? 'bg-blue-100 animate-pulse' : hasError ? 'bg-red-100' : 'bg-green-100'}`}>
            {isLoading ? (
              <LoadingSpinner size="sm" className="text-blue-600" />
            ) : hasError ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        
        <div className="min-h-[100px] transition-all duration-300">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-500 text-sm animate-pulse">Generating {title.toLowerCase()}...</p>
            </div>
          ) : hasError ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-red-600 text-sm font-medium">Failed to generate {title.toLowerCase()}</p>
              <p className="text-gray-500 text-xs mt-1">Please try again later</p>
            </div>
          ) : (
            <div className="prose max-w-none transition-opacity duration-300">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ProgressBar = ({ completed, total }) => {
  const percentage = (completed / total) * 100
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  )
}

const StatusBadge = ({ status, count }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'loading': return 'bg-blue-100 text-blue-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(status)} flex items-center gap-1`}>
      {status.charAt(0).toUpperCase() + status.slice(1)} 
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white bg-opacity-80 text-xs">
        {count}
      </span>
    </span>
  )
}

const Section = ({ title, children }) => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-sans tracking-tight border-b pb-2 border-gray-200">
        {title}
      </h2>
      <div className="text-base sm:text-[1.15rem] text-gray-800">
        {children}
      </div>
    </section>
  );
}

const page = () => {
  const [title, setTitles] = useState(null)
  const [context, setContext] = useState(null)
  const [citation, setCitation] = useState(null)
  const [result, setResults] = useState(null)
  const [authors, setAuthors] = useState(null)
  const [summary, setSummary] = useState(null)
  const [titleLoading, setTitleLoading] = useState(false)
  const [contextLoading, setContextLoading] = useState(false)
  const [citationLoading, setCitationLoading] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(false)
  
  const [titleError, setTitleError] = useState(false)
  const [contextError, setContextError] = useState(false)
  const [citationError, setCitationError] = useState(false)
  const [reviewError, setReviewError] = useState(false)
  
  const params = useSearchParams()
  
  useEffect(() => {
    handleTitleGeneration()
    handleContextGeneration()
    handleCitationGeneration()
  }, [])

  useEffect(() => {
    handleReviewGeneration()
  }, [citation])
  
  const handleTitleGeneration = async () => {
    setTitleLoading(true)
    setTitleError(false)
    try {
      const paper = params.get("paper")
      if (paper) {
        const response = await generateTitle(paper)
        
        if (response.results) {
          setTitles(response.results.title)
        } else {
          setTitleError(true)
          toast.error("Error proceeding with your request.")
        }
      }
    } catch (err) {
      console.log(err)
      setTitleError(true)
      toast.error(err.message)
    } finally {
      setTitleLoading(false)
    }
  }
  
  const handleContextGeneration = async () => {
    setContextLoading(true)
    setContextError(false)
    try {
      const paper = params.get("paper")
      if (paper) {
        const response = await generateContext(paper)
        setContext(response.results)
      } else {
        setContextError(true)
        toast.error("Error generating context.")
      }
    } catch (err) {
      setContextError(true)
      toast.error("Error Proceeding with your request")
      console.log(err)
    } finally {
      setContextLoading(false)
    }
  }

  const handleReviewGeneration = async () => {
    setReviewLoading(true)
    setReviewError(false)
    try {
      if (title && citation && context) {
        const response = await finalReview({
          titleLR: title,
          citationLR: citation,
          graphragLR: context,
          openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY
        })
        setResults(response.results)
      } else {
        setReviewError(true)
      }
    } catch (err) {
      console.log(err);
      toast.error("Error Generating Review")
      setReviewError(true)
    } finally {
      setReviewLoading(false)
    }
  }
  
  const handleCitationGeneration = async () => {
    setCitationLoading(true)
    setCitationError(false)
    try {
      const paper = params.get("paper")
      const response = await generateCitation(paper)
      if (response.results) {
        setCitation(response.results)
        setAuthors(response.authors)
        toast.success("Citation Generated Successfully")
      } else {
        setCitationError(true)
        toast.error("Error occurred while processing your request")
      }
    } catch (err) {
      console.log(err)
      setCitationError(true)
      toast.error("Error generating citation")
    } finally {
      setCitationLoading(false)
    }
  }
  
  const getCompletedCount = () => {
    let count = 0
    if (title && !titleLoading && !titleError) count++
    if (context && !contextLoading && !contextError) count++
    if (citation && !citationLoading && !citationError) count++
    if (result && !reviewLoading && !reviewError) count++
    if (summary && !summaryLoading) count++
    return count
  }
  
  const getLoadingCount = () => {
    let count = 0
    if (titleLoading) count++
    if (contextLoading) count++
    if (citationLoading) count++
    if (reviewLoading) count++
    if (summaryLoading) count++
    return count
  }
  
  const getErrorCount = () => {
    let count = 0
    if (titleError) count++
    if (contextError) count++
    if (citationError) count++
    if (reviewError) count++
    return count
  }

  const summarizePaper = async () => {
    setSummaryLoading(true)
    try {
      const response = await summarizeReview({
        summarized_json: {
          individual_title: title,
          literature_review: result,
          citation: citation
        },
        openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY
      })
      if (response.results) {
        setSummary(response.results.results)
      }
    } catch (err) {
      toast.error("Error in Summarizing Paper.")
      console.log(err)
    } finally {
      setSummaryLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mt-12 mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Literature Review Generator
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Generating comprehensive analysis including title, context, and citations for your research paper
          </p>
        </div>
        
        {/* Progress Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="hidden sm:inline-flex w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Generation Progress
            </h2>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <StatusBadge status="completed" count={getCompletedCount()} />
              <StatusBadge status="loading" count={getLoadingCount()} />
              <StatusBadge status="error" count={getErrorCount()} />
            </div>
          </div>
          <ProgressBar completed={getCompletedCount()} total={5} />
        </div>
        
        {/* Content Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Title Card */}
          <LoadingCard
            icon={FileText}
            title="Title Generation"
            subtitle="Creating an appropriate title"
            isLoading={titleLoading}
            hasError={titleError}
          >
            {title && (
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-500">Generated Title</h3>
                <p className="text-lg sm:text-xl font-medium text-gray-800 leading-relaxed bg-blue-50 px-4 py-3 rounded-lg">
                  {title}
                </p>
              </div>
            )}
          </LoadingCard>
          
          {/* Context Card */}
          {/* <LoadingCard
            icon={BookOpen}
            title="Context Generation"
            subtitle="Understanding the research context"
            isLoading={contextLoading}
            hasError={contextError}
          >
            {context && (
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-500">Research Context</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {context}
                </p>
              </div>
            )}
          </LoadingCard> */}
          
          {/* Citation Card */}
          {/* <LoadingCard
            icon={Quote}
            title="Citation Generation"
            subtitle="Generating proper citation"
            isLoading={citationLoading}
            hasError={citationError}
          >
            {citation && (
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-500">Citation</h3>
                <p className="text-gray-700 italic">
                  {citation}
                </p>
                {authors && authors.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-500">Authors</h4>
                    <p className="text-gray-600">{authors.join(', ')}</p>
                  </div>
                )}
              </div>
            )}
          </LoadingCard> */}
        </div>
        
        {/* Review Section - Full Width */}
        <div className="mt-8">
          <LoadingCard
            icon={BookAIcon}
            title="Literature Review"
            subtitle="Comprehensive analysis of the paper"
            isLoading={reviewLoading}
            hasError={reviewError}
          >
            {result && (
              <div className="w-full bg-white px-4 sm:px-8 md:px-12 lg:px-16 py-8 font-serif text-gray-800 leading-relaxed tracking-wide selection:bg-yellow-200">
                <article className="max-w-none space-y-12">
                  <header className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 font-sans mb-3">
                      {title}
                    </h1>
                    {authors && <p className="text-base sm:text-lg text-gray-500 italic">{authors.join(', ')}</p>}
                  </header>

                  <Section title="Key Findings">
                    {result.Findings}
                  </Section>

                  <Section title="Methodology">
                    {result.Methodology}
                  </Section>

                  <Section title="Novelty of the Study">
                    {result.Novelty}
                  </Section>

                  {result.ResearchGaps && result.ResearchGaps.length > 0 && (
                    <Section title="Research Gaps">
                      <ul className="list-disc pl-6 space-y-2 marker:text-orange-500">
                        {result.ResearchGaps.map((item, idx) => (
                          <li key={idx}>{item.gap}</li>
                        ))}
                      </ul>
                    </Section>
                  )}

                  {result.StudyObjectives && result.StudyObjectives.length > 0 && (
                    <Section title="Study Objectives">
                      <ol className="list-decimal pl-6 space-y-2 marker:text-sky-600">
                        {result.StudyObjectives.map((item, idx) => (
                          <li key={idx}>{item.objective}</li>
                        ))}
                      </ol>
                    </Section>
                  )}

                  <Section title="Comprehensive Summary">
                    {result.ResearchSummary}
                  </Section>
                  
                  {citation && (
                    <Section title="Citation">
                      {citation}
                    </Section>
                  )}

                  <footer className="pt-8 border-t border-gray-200 mt-12 text-center text-sm text-gray-400">
                    Crafted with scholarly elegance — © {new Date().getFullYear()}
                  </footer>
                </article>
              </div>
            )}
          </LoadingCard>
        </div>
        
        {/* Summary Button and Result */}
        {result && !reviewLoading && !reviewError && (
          <div className="mt-6">
            <button 
              onClick={summarizePaper}
              disabled={summaryLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                summaryLoading 
                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              {summaryLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <span>Generate Summary</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            {summary && (
              <div className="mt-6 bg-white text-gray-800 px-6 py-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <h3 className="text-lg font-semibold text-gray-800">Paper Summary</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Summary</h4>
                    <p className="text-base font-medium text-gray-700">{summary.cite}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-800 whitespace-pre-line">{summary.summary}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Completion Message */}
        {getCompletedCount() >= 4 && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Generation Complete!</h3>
            </div>
            <p className="text-gray-700">
              Your literature review has been successfully generated. You can now use all components for your research work.
            </p>
          </div>
        )}
        
        {/* Error Message */}
        {getErrorCount() > 0 && (
          <div className="mt-8 bg-red-50 rounded-xl p-6 border border-red-200 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800">Some Items Failed to Generate</h3>
            </div>
            <p className="text-red-700 mb-4">
              {getErrorCount()} item(s) failed to generate. You can try refreshing the page to retry.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Failed Items
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default page