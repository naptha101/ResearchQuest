'use client'
import { useEffect, useRef, useState } from 'react'
import { AlertCircle, BarChart, BookOpen, ChevronDown, ChevronUp, Database, Download, FileText, Lightbulb, Loader, Search, Sparkles, Target, Users } from 'lucide-react'
import { generateMultiPaperDocx } from '@/app/Services/GenerateMultipleReviewDoc'

export const ReviewTable = ({ papers, paperData, handleConsolidatedReview, consolidatedReview, loadingConsolidated }) => {
  const [expandedRow, setExpandedRow] = useState(null)
  const dropdownRef = useRef(null)
  const truncateText = (text, maxLength = 20) => {
    if (!text) return '-'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExpandedRow(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getStatusColor = (index) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-green-500',
      'from-pink-500 to-rose-500',
      'from-cyan-500 to-blue-500'
    ]
    return colors[index % colors.length]
  }


//  const summarizePaper = async () => {
//       setSummaryLoading(true)
//       setSummaryError(false)
//       try {
//         const response = await summarizeReview({
//           summarized_json: {
//             individual_title: title,
//             literature_review: result,
//             citation: citation
//           },
//           openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY
//         })
        
//         if (response.results) {
//           setSummary(response.results.results)
//         } else {
//           setSummaryError(true)
//           toast.error(`Error summarizing paper ${index + 1}`)
//           onError()
//         }
//       } catch (err) {
//         console.error(err)
//         setSummaryError(true)
//         toast.error(`Error summarizing paper ${index + 1}`)
//         onError()
//       } finally {
//         setSummaryLoading(false)
//       }
//     }

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8 font-sans" ref={dropdownRef}>
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Research Review Dashboard
          </h2>
        </div>
        <p className="text-gray-600 text-lg">Analysis of {papers.length} research papers</p>
      </div>

      {/* Desktop Table View */}
      {paperData && (
        <div className="hidden lg:block">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 min-w-[80px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        Sr. No
                      </div>
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 min-w-[200px]">Title</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 min-w-[150px]">Authors</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 min-w-[180px]">Findings</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 min-w-[180px]">Research Summary</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 min-w-[150px]">Methodology</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 min-w-[150px]">Novelty</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 min-w-[200px]">Data Source Of Methodology</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 min-w-[200px]">Relationship With Study</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 min-w-[180px]">Statistical Tools</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 min-w-[180px]">Research Gaps</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 min-w-[180px]">Study Objectives</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-900 min-w-[80px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {papers.map((paper, index) => {
                    const data = paperData[index] || {}
                    const isExpanded = expandedRow === index

                    return (
                      <tr
                        key={index}
                        className={`group hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 ${
                          isExpanded ? 'bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-r ${getStatusColor(index)} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                            >
                              {index + 1}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-gray-900 leading-relaxed">
                          {isExpanded ? data.title || paper.name : truncateText(data.title || paper.name, 30)}
                        </td>
                        <td className="p-4 text-gray-700">
                          {isExpanded ? (
                            data.authors?.length > 0 ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {data.authors.map((author, idx) => (
                                  <li key={idx} className="text-sm">{author}</li>
                                ))}
                              </ul>
                            ) : '-'
                          ) : truncateText(data.authors?.join(', ') || '-', 25)}
                        </td>
                        <td className="p-4 text-gray-700 leading-relaxed">
                          {isExpanded ? data.result?.Findings || '-' : truncateText(data.result?.Findings, 30)}
                        </td>
                        <td className="p-4 text-gray-700 leading-relaxed">
                          {isExpanded ? data.result?.ResearchSummary || '-' : truncateText(data.result?.ResearchSummary, 30)}
                        </td>
                        <td className="p-4 text-gray-700 leading-relaxed">
                          {isExpanded ? data.result?.Methodology || '-' : truncateText(data.result?.Methodology, 25)}
                        </td>
                        <td className="p-4 text-gray-700 leading-relaxed">
                          {isExpanded ? data.result?.Novelty || '-' : truncateText(data.result?.Novelty, 25)}
                        </td>
                        <td className="p-4 text-gray-700 leading-relaxed">
                          {isExpanded ? data.result?.DataSourceOfMethodology || '-' : truncateText(data.result?.DataSourceOfMethodology, 25)}
                        </td>
                        <td className="p-4 text-gray-700 leading-relaxed">
                          {isExpanded ? data.result?.RelationshipWithStudy || '-' : truncateText(data.result?.RelationshipWithStudy, 25)}
                        </td>
                        <td className="p-4 text-gray-700 leading-relaxed">
                          {isExpanded ? data.result?.StatisticalTools || '-' : truncateText(data.result?.StatisticalTools, 25)}
                        </td>
                        <td className="p-4 text-gray-700 leading-relaxed">
                          {isExpanded ? (
                            data.result?.ResearchGaps?.length > 0 ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {data.result.ResearchGaps.map((gap, idx) => (
                                  <li key={idx} className="text-sm">{gap.gap}</li>
                                ))}
                              </ul>
                            ) : '-'
                          ) : truncateText(data.result?.ResearchGaps?.map(g => g.gap).join(', ') || '-', 30)}
                        </td>
                        <td className="p-4 text-gray-700 leading-relaxed">
                          {isExpanded ? (
                            data.result?.StudyObjectives?.length > 0 ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {data.result.StudyObjectives.map((obj, idx) => (
                                  <li key={idx} className="text-sm">{obj.objective}</li>
                                ))}
                              </ul>
                            ) : '-'
                          ) : truncateText(data.result?.StudyObjectives?.map(o => o.objective).join(', ') || '-', 30)}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setExpandedRow(isExpanded ? null : index)}
                            className="inline-flex items-center justify-center w-10 h-10 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-all duration-200 group-hover:scale-110"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      {paperData && (
        <div className="lg:hidden space-y-4">
          {papers.map((paper, index) => {
            const data = paperData[index] || {}
            const isExpanded = expandedRow === index

            return (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getStatusColor(index)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{truncateText(data.title || paper.name, 25)}</h3>
                        <p className="text-gray-600 text-xs">{truncateText(data.authors?.join(', ') || '-', 30)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedRow(isExpanded ? null : index)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-all duration-200"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="p-4 space-y-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Target className="w-4 h-4 text-indigo-600" />
                          Findings
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{data.result?.Findings || '-'}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <FileText className="w-4 h-4 text-green-600" />
                          ResearchSummary
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{data.result?.ResearchSummary || '-'}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Search className="w-4 h-4 text-purple-600" />
                          Methodology
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{data.result?.Methodology || '-'}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Lightbulb className="w-4 h-4 text-orange-600" />
                          Novelty
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{data.result?.Novelty || '-'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Database className="w-4 h-4 text-pink-600" />
                        DataSourceOfMethodology
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{data.result?.DataSourceOfMethodology || '-'}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        RelationshipWithStudy
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{data.result?.RelationshipWithStudy || '-'}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <BarChart className="w-4 h-4 text-fuchsia-600" />
                        StatisticalTools
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{data.result?.StatisticalTools || '-'}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Users className="w-4 h-4 text-red-600" />
                        Authors
                      </div>
                      {data.authors?.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                          {data.authors.map((author, idx) => (
                            <li key={idx}>{author}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 text-sm">-</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Users className="w-4 h-4 text-red-600" />
                        ResearchGaps
                      </div>
                      {data.result?.ResearchGaps?.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                          {data.result.ResearchGaps.map((gap, idx) => (
                            <li key={idx}>{gap.gap}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 text-sm">-</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Target className="w-4 h-4 text-teal-600" />
                        StudyObjectives
                      </div>
                      {data.result?.StudyObjectives?.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                          {data.result.StudyObjectives.map((obj, idx) => (
                            <li key={idx}>{obj.objective}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 text-sm">-</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Loading State */}
      {!paperData && (
        <div className="w-full py-3 text-center">
          <p className="text-gray-400 text-lg animate-pulse">---Your request is under process---</p>
        </div>
      )}




      {/* Consolidated Review Button */}
      {papers.length > 0 && paperData && (
        <div className="mt-8 flex justify-center animate-slide-up">
          <button
            disabled={loadingConsolidated}
            onClick={handleConsolidatedReview}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              <span>Generate Consolidated Review</span>
              {loadingConsolidated && <Loader className="w-5 h-5 animate-spin" />}
            </div>
          </button>
        </div>
      )}

      {/* Consolidated Review Display */}
      {consolidatedReview && (
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-dashed border-indigo-200 p-6 shadow-lg animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Consolidated Review</h3>
          </div>
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{consolidatedReview}</div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}