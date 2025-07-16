import { BookAIcon, ChevronRight, FileText, RefreshCw } from "lucide-react"
import { LoadingCard } from "./LoadingCard"
import { Section } from "./Section"
import { toast } from "react-toastify"

const { generateTitle, generateContext, generateCitation, finalReview, summarizeReview } = require("@/app/Services/Literature_Review")
const { useState, useEffect } = require("react")

export const PaperCard = ({ paper, index, onComplete, onError, updatePaperData }) => {
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
          isLoading={reviewLoading||contextLoading||titleLoading}
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