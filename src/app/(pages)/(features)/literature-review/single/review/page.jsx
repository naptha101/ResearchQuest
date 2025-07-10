"use client"
import { finalReview, generateCitation, generateContext, generateTitle } from '@/app/Services/Literature_Review'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FileText, Quote, BookOpen, CheckCircle, AlertCircle, BookAIcon } from 'lucide-react'
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
    <div className="bg-white rounded-xl col-span-2 shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${isLoading ? 'bg-blue-100' : hasError ? 'bg-red-100' : 'bg-green-100'}`}>
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
        
        <div className="min-h-[100px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-500 text-sm">Generating {title.toLowerCase()}...</p>
            </div>
          ) : hasError ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-red-600 text-sm font-medium">Failed to generate {title.toLowerCase()}</p>
              <p className="text-gray-500 text-xs mt-1">Please try again later</p>
            </div>
          ) : (
            <div className="prose max-w-none">
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
    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
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
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
    </span>
  )
}

const page = () => {
  const [title, setTitles] = useState(null)
  const [context, setContext] = useState(null)
  const [citation, setCitation] = useState(null)
  const [result,setResults]=useState(null)
  const [titleLoading, setTitleLoading] = useState(false)
  const [contextLoading, setContextLoading] = useState(false)
  const [citationLoading, setCitationLoading] = useState(false)
  const [reviewLoading,setReviewLoading]=useState(false)
  
  const [titleError, setTitleError] = useState(false)
  const [contextError, setContextError] = useState(false)
  const [citationError, setCitationError] = useState(false)
  const [reviewError,setReviewError]=useState(false)
  
  const params = useSearchParams()
  
  useEffect(() => {
    handleTitleGeneration()
    handleContextGeneration()
    handleCitationGeneration()
  
  }, [])

  useEffect(()=>{

    handleReviewGeneration()
  },[title,citation,context])
  
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
  const handleReviewGeneration=async()=>{
    setReviewLoading(true)
    setReviewError(false)
    try{
        if(title&&citation&&context){
        const response=await finalReview({
            titleLR:title,
            citationLR:citation,
            graphragLR:context,
            openapikey:process.env.NEXT_PUBLIC_OPEN_API_KEY
        })
        setResults(response.results)
    }
else{
    setReviewError(true)
}
    }
    catch(err){
        console.log(err);
        toast.error("Error Generating Review")
        setReviewError(true)
    }
    setReviewLoading(false)
  }
  
  const handleCitationGeneration = async () => {
    setCitationLoading(true)
    setCitationError(false)
    try {
      const paper = params.get("paper")
      const response = await generateCitation(paper)
    //  console.log(response)
      if (response.results) {
        setCitation(response.results)
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

    return count
  }
  
  const getLoadingCount = () => {
    let count = 0
    if (titleLoading) count++
    if (contextLoading) count++
    if (citationLoading) count++
      if (reviewLoading) count++
    return count
  }
  
  const getErrorCount = () => {
    let count = 0
    if (titleError) count++
    if (contextError) count++
    if (citationError) count++
    if(reviewError)count++
    return count
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mt-16 mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Literature Review Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generating comprehensive analysis including title, context, and citations for your research paper
          </p>
        </div>
        
        {/* Progress Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Generation Progress</h2>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="completed" count={getCompletedCount()} />
              <StatusBadge status="loading" count={getLoadingCount()} />
              <StatusBadge status="error" count={getErrorCount()} />
            </div>
          </div>
          <ProgressBar completed={getCompletedCount()} total={3} />
        </div>
        
        {/* Content Cards */}
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Title Card */}
          <LoadingCard
            icon={FileText}
           
            title="Title Generation"
            subtitle="Creating an appropriate title"
            isLoading={titleLoading}
            hasError={titleError}
          >
            {title && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Generated Title:</h3>
                <p className="text-gray-700 font-medium text-xl leading-relaxed">{title}</p>
              </div>
            )}
          </LoadingCard>
          
     <LoadingCard
            icon={BookAIcon}
           
            title="Review Genertion"
            subtitle="Creating an appropriate Literature Review"
            isLoading={reviewLoading}
            hasError={reviewError}
          >
            {result &&(
             <div className="w-full bg-white px-6 md:px-28 xl:px-60 py-20 font-serif text-neutral-800 leading-loose tracking-wide selection:bg-yellow-200">
      <article className="max-w-none space-y-16">

        <header className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 font-sans mb-3">
            Literature Review
          </h1>
          <p className="text-lg text-gray-500 italic">An Academic Reflection on Newtonian Conceptualization</p>
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

        <Section title="Research Gaps">
          <ul className="list-disc pl-6 space-y-2 marker:text-orange-500">
            {result.ResearchGaps.map((item, idx) => (
              <li key={idx}>{item.gap}</li>
            ))}
          </ul>
        </Section>

        <Section title="Study Objectives">
          <ol className="list-decimal pl-6 space-y-2 marker:text-sky-600">
            {result.StudyObjectives.map((item, idx) => (
              <li key={idx}>{item.objective}</li>
            ))}
          </ol>
        </Section>

        <Section title="Comprehensive Summary">
          {result.ResearchSummary}
        </Section>

        <footer className="pt-12 border-t border-gray-200 mt-20 text-center text-sm text-gray-400">
          Crafted with scholarly elegance — © {new Date().getFullYear()}
        </footer>

      </article>
    </div>
            )}
          </LoadingCard>


          {/* Context Card */}
       
          
          {/* Citation Card */}
         
        </div>
        
        {/* Summary Section */}
        {getCompletedCount() === 3 && (
          <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-900">Generation Complete!</h3>
            </div>
            <p className="text-gray-700 text-lg">
              All components of your literature review have been successfully generated. 
              You can now use the title, context, and citations for your research work.
            </p>
          </div>
        )}
        
        {/* Retry Section */}
        {getErrorCount() > 0 && (
          <div className="mt-8 bg-red-50 rounded-xl p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">Some Items Failed to Generate</h3>
            </div>
            <p className="text-red-700 mb-4">
              {getErrorCount()} item(s) failed to generate. You can try refreshing the page to retry.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Retry Failed Items
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">
        {title}
      </h2>
      <div className="text-[1.15rem] text-gray-800">
        {children}
      </div>
    </section>
  );
}
export default page