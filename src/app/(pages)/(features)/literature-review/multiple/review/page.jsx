"use client"
import { consolidatedReport, finalReview, generateCitation, generateContext, generateTitle, summarizeReview } from '@/app/Services/Literature_Review'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { FileText, Quote, BookOpen, CheckCircle, AlertCircle, BookAIcon, ChevronRight, RefreshCw, Loader2Icon } from 'lucide-react'

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
  )
}


const ReviewTable = ({ papers, paperData,handleConsolidatedReview,consolidatedReview,loadingConsolidated }) => {
  const [expandedRow, setExpandedRow] = useState(null)
  const dropdownRef = useRef(null)

  const truncateText = (text, maxLength = 20) => {
    if (!text) return '-'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExpandedRow(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 overflow-x-auto" ref={dropdownRef}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Summary Table</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
            <th className="p-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Sr. No</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Title</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Authors</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Findings</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Research Summary</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Methodology</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Novelty</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Research Gaps</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Study Objectives</th>
          </tr>
        </thead>
        <tbody>
          {papers.map((paper, index) => {
            const data = paperData[index] || {}
            const isExpanded = expandedRow === index

            return (
              <tr 
                key={index} 
                className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
              >
                <td className="p-4 text-sm text-gray-700">{index + 1}</td>
                <td className="p-4 text-sm text-gray-700">
                  {isExpanded ? data.title || paper.name : truncateText(data.title || paper.name)}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {isExpanded ? data.authors?.join(', ') || '-' : truncateText(data.authors?.join(', ') || '-')}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {isExpanded ? data.result?.Findings || '-' : truncateText(data.result?.Findings)}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {isExpanded ? data.result?.ResearchSummary || '-' : truncateText(data.result?.ResearchSummary)}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {isExpanded ? data.result?.Methodology || '-' : truncateText(data.result?.Methodology)}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {isExpanded ? data.result?.Novelty || '-' : truncateText(data.result?.Novelty)}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {isExpanded ? data.result?.ResearchGaps?.map(g => g.gap).join(', ') || '-' : truncateText(data.result?.ResearchGaps?.map(g => g.gap).join(', ') || '-')}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {isExpanded ? data.result?.StudyObjectives?.map(o => o.objective).join(', ') || '-' : truncateText(data.result?.StudyObjectives?.map(o => o.objective).join(', ') || '-')}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  <button
                    onClick={() => setExpandedRow(isExpanded ? null : index)}
                    className="flex items-center justify-center w-6 h-6 text-gray-500 hover:text-blue-600"
                  >
                    ▼
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
   
         {papers.length>0&&<div className='w-full py-3 px-2 justify-end items-center'>
       <button disabled={!loadingConsolidated} onClick={()=>handleConsolidatedReview()} className='py-3 rounded-2xl cursor-pointer hover:scale-105 shadow-gray-400  text-white shadow-2xl px-2 bg-gradient-to-r from-blue-600 to-indigo-400 '>
      Consolodated Review

      {
        loadingConsolidated&&
        <Loader2Icon className='h-30 m-2 bg-black w-30 animate-spin'></Loader2Icon>
      }
       </button>
         </div>}
 {consolidatedReview&& <div className='w-full p-3 rounded-2xl border-2 border-dashed  '>

<div style={{whiteSpace:'pre-wrap'}}>
    {consolidatedReview}
</div>

  </div >}



    </div>
  )
}

const PaperCard = ({ paper, index, onComplete, onError, updatePaperData }) => {
  const [title, setTitle] = useState('')
  const [context, setContext] = useState('')
  const [citation, setCitation] = useState('')
  const [result, setResult] = useState(null)
  const [authors, setAuthors] = useState([])
  const [summary, setSummary] = useState(null)
  
  const [titleLoading, setTitleLoading] = useState(false)
  const [contextLoading, setContextLoading] = useState(false)
  const [citationLoading, setCitationLoading] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  
  const [titleError, setTitleError] = useState(false)
  const [contextError, setContextError] = useState(false)
  const [citationError, setCitationError] = useState(false)
  const [reviewError, setReviewError] = useState(false)
  const [summaryError, setSummaryError] = useState(false)

  useEffect(() => {
    const generateAll = async () => {
      await generatePaperTitle()
      await generatePaperContext()
      await generatePaperCitation()
    }
    
    generateAll()
  }, [])

  useEffect(() => {
    if (title && context && citation) {
      generatePaperReview()
    }
  }, [title, context, citation])

  const generatePaperTitle = async () => {
    setTitleLoading(true)
    setTitleError(false)
    try {
      const response = await generateTitle(paper.url)
      if (response.results) {
        setTitle(response.results.title)
      } else {
        setTitleError(true)
        toast.error(`Error generating title for paper ${index + 1}`)
        onError()
      }
    } catch (err) {
      console.error(err)
      setTitleError(true)
      toast.error(`Failed to generate title for paper ${index + 1}`)
      onError()
    } finally {
      setTitleLoading(false)
    }
  }

  const generatePaperContext = async () => {
    setContextLoading(true)
    setContextError(false)
    try {
      const response = await generateContext(paper.url)
      if (response.results) {
        setContext(response.results)
      } else {
        setContextError(true)
        toast.error(`Error generating context for paper ${index + 1}`)
        onError()
      }
    } catch (err) {
      console.error(err)
      setContextError(true)
      toast.error(`Failed to generate context for paper ${index + 1}`)
      onError()
    } finally {
      setContextLoading(false)
    }
  }

  const generatePaperCitation = async () => {
    setCitationLoading(true)
    setCitationError(false)
    try {
      const response = await generateCitation(paper.url)
      if (response.results) {
        setCitation(response.results)
        setAuthors(response.authors || [])
      } else {
        setCitationError(true)
        toast.error(`Error generating citation for paper ${index + 1}`)
        onError()
      }
    } catch (err) {
      console.error(err)
      setCitationError(true)
      toast.error(`Failed to generate citation for paper ${index + 1}`)
      onError()
    } finally {
      setCitationLoading(false)
    }
  }

  const generatePaperReview = async () => {
    setReviewLoading(true)
    setReviewError(false)
    try {
      const response = await finalReview({
        titleLR: title,
        citationLR: citation,
        graphragLR: context,
        openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY
      })
      
      if (response.results) {
        setResult(response.results)
        updatePaperData({ title, authors, result: response.results, isComplete: true, hasError: false })
        onComplete()
      } else {
        setReviewError(true)
        toast.error(`Error generating review for paper ${index + 1}`)
        updatePaperData({ hasError: true })
        onError()
      }
    } catch (err) {
      console.error(err)
      setReviewError(true)
      toast.error(`Failed to generate review for paper ${index + 1}`)
      updatePaperData({ hasError: true })
      onError()
    } finally {
      setReviewLoading(false)
    }
  }

  const summarizePaper = async () => {
    setSummaryLoading(true)
    setSummaryError(false)
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
      } else {
        setSummaryError(true)
        toast.error(`Error summarizing paper ${index + 1}`)
        onError()
      }
    } catch (err) {
      console.error(err)
      setSummaryError(true)
      toast.error(`Error summarizing paper ${index + 1}`)
      onError()
    } finally {
      setSummaryLoading(false)
    }
  }

  const isComplete = result && !reviewLoading && !reviewError
  const hasError = titleError || contextError || citationError || reviewError || summaryError

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Paper {index + 1}: {paper.name || `Paper ${index + 1}`}
        </h3>
        <div className="flex gap-2">
          {isComplete && (
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
              Complete
            </span>
          )}
          {hasError && (
            <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
              Error
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <LoadingCard
          icon={FileText}
          title="Title"
          subtitle="Generated title for the paper"
          isLoading={titleLoading}
          hasError={titleError}
        >
          {title && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-gray-800 font-medium">{title}</p>
            </div>
          )}
        </LoadingCard>

    
      </div>

      <div className="mt-6">
        <LoadingCard
          icon={BookAIcon}
          title="Literature Review"
          subtitle="Comprehensive analysis of the paper"
          isLoading={reviewLoading}
          hasError={reviewError}
        >
          {result && (
            <div className="w-full bg-white px-4 py-6 font-serif text-gray-800 leading-relaxed tracking-wide">
              <article className="max-w-none space-y-8">
                <header className="text-center">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 font-sans mb-3">
                    {title}
                  </h1>
                  {authors.length > 0 && <p className="text-base sm:text-lg text-gray-500 italic">{authors.join(', ')}</p>}
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
              </article>
            </div>
          )}
        </LoadingCard>
      </div>

      {isComplete && (
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
    </div>
  )
}

const Page = () => {
  const params = useSearchParams()
  const [papers, setPapers] = useState([])
  const [completedPapers, setCompletedPapers] = useState(0)
  const [loadingPapers, setLoadingPapers] = useState(0)
  const [errorPapers, setErrorPapers] = useState(0)
  const [paperData, setPaperData] = useState([])
  const [loadingCosolidated,setLoadingConsolidated]=useState(false)
    const [consolidatedReview,setConsolidated]=useState(null)


  useEffect(() => {
    const initializePapers = () => {
      const paperParam = params.get("paper")
      const namesParam = params.get("names")
      
      if (paperParam && namesParam) {
        const baseUrl = paperParam.split('/').slice(0, -1).join('/') + '/'
        const paperNames = namesParam.split(',')
        
        const paperList = paperNames.map(name => ({
          name: name.trim(),
          url: baseUrl + name.trim()
        }))
        
        setPapers(paperList)
        setPaperData(paperList.map(() => ({})))
        setLoadingPapers(paperList.length)
      }
    }
    
    initializePapers()
  }, [params])

  const handleConsolidatedReview=async()=>{
    setLoadingConsolidated(true)
    try{
const response=await consolidatedReport(paperData)
   //console.log(response)
   if(response.results){
    console.log(response.results)
    setConsolidated(response.results)
    setLoadingConsolidated(false)
   }
    }
    catch(err){
 console.log(err);
     setLoadingConsolidated(false)
toast.error("Error in generating Consolidated Review.")
    }
}
  const handlePaperComplete = (index) => {
    setCompletedPapers(prev => prev + 1)
    setLoadingPapers(prev => prev - 1)
  }

  const handlePaperError = (index) => {
    setErrorPapers(prev => prev + 1)
    setLoadingPapers(prev => prev - 1)
  }

  const updatePaperData = (index, data) => {
    setPaperData(prev => {
      const newData = [...prev]
      newData[index] = { ...newData[index], ...data }
      return newData
    })
  }

  const totalPapers = papers.length
  const allComplete = completedPapers === totalPapers
  const anyErrors = errorPapers > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mt-12 mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Literature Review Generator
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Generating comprehensive analysis for multiple research papers
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
              <StatusBadge status="completed" count={completedPapers} />
              <StatusBadge status="loading" count={loadingPapers} />
              <StatusBadge status="error" count={errorPapers} />
            </div>
          </div>
          <ProgressBar completed={completedPapers} total={totalPapers} />
          <p className="text-sm text-gray-500 mt-2">
            Processing {totalPapers} paper(s) - {completedPapers} completed, {loadingPapers} in progress
          </p>
        </div>
        
        {/* Review Table */}
        <ReviewTable papers={papers} paperData={paperData} handleConsolidatedReview={handleConsolidatedReview} consolidatedReview={consolidatedReview} loadingConsolidated={loadingCosolidated} />
     

        {/* Papers List */}
        <div className="space-y-8">
          {papers.map((paper, index) => (
            <PaperCard 
              key={index}
              paper={paper}
              index={index}
              onComplete={() => handlePaperComplete(index)}
              onError={() => handlePaperError(index)}
              updatePaperData={(data) => updatePaperData(index, data)}
            />
          ))}
        </div>
        
        {/* Completion Message */}
        {allComplete && !anyErrors && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">All Papers Processed Successfully!</h3>
            </div>
            <p className="text-gray-700">
              All literature reviews have been successfully generated. You can now use them for your research work.
            </p>
          </div>
        )}
        
        {/* Error Message */}
        {anyErrors && (
          <div className="mt-8 bg-red-50 rounded-xl p-6 border border-red-200 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800">Some Papers Failed to Process</h3>
            </div>
            <p className="text-red-700 mb-4">
              {errorPapers} paper(s) failed to process completely. You can try refreshing the page to retry.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Failed Papers
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page