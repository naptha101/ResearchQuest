"use client"
import { useState } from "react"
import { Globe, FileText, BookOpen, Sparkles, ArrowRight, Check, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { finalCitatioGeneration, researchPaperUrl } from "@/app/Services/Citation-Service"

export default function CitationForm() {
  const [url, setUrl] = useState("")
  const [style, setStyle] = useState("")
  const [publisher, setPublisher] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [citation, setCitation] = useState("")
  const [jsonInput,setJsonInput]=useState(null)

  const citationStyles = [
    { value: "IEEE", label: "IEEE", description: "Institute of Electrical and Electronics Engineers" },
    { value: "APA", label: "APA", description: "American Psychological Association" },
    { value: "MLA", label: "MLA", description: "Modern Language Association" },
    { value: "Chicago/Turabian", label: "Chicago/Turabian", description: "Chicago Manual of Style" },
    { value: "Harvard", label: "Harvard", description: "Harvard Referencing System" },
    { value: "AMA", label: "AMA", description: "American Medical Association" },
    { value: "Vancouver", label: "Vancouver", description: "Vancouver Reference Style" },
    { value: "CSE", label: "CSE", description: "Council of Science Editors" },
    { value: "ASA", label: "ASA", description: "American Sociological Association" }
  ]

const publishers = [
  { value: "arxiv", label: "arXiv", icon: "📄" },
  { value: "pubmed", label: "PubMed", icon: "🧬" },
  { value: "springer", label: "Springer", icon: "🔬" },
  { value: "core", label: "Core", icon: "🌟" },
  { value: "ieee", label: "IEEE", icon: "⚡" },
  { value: "science direct", label: "Science Direct", icon: "🧪" },
  { value: "wiley", label: "Wiley", icon: "📖" },
  { value: "general try", label: "General Try", icon: "🌐" }
];


const handleSubmit = async () => {
    if (!isFormValid) return
    
    setIsSubmitting(true)
    
    try{
      const response=await researchPaperUrl({
           paper_url: url,
    publications: publisher.toLocaleLowerCase(),
    openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY
      })
      if(response.results){
setJsonInput(response.results)
handlefinalGeneration(response.results)
      }else{
        toast.error("Invalid URL or Publisher")
      }

    }
    catch(err){
      console.log(err)
      toast.error("Error in generating Citation.")
    }
    setIsSubmitting(false)

    
  }

const handlefinalGeneration=async(data)=>{
    try{

      const response=await finalCitatioGeneration({
        citation_format : style,
    final_json : jsonInput||data,
    openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY
      })
  if(response.results){
    setCitation(response.results)
  }
else{
  toast.error("Error in generating Citation.")
}

//      console.log(response)
    }
    catch(err){
      console.log(err)

      toast.error("Error Generating Citations.")

    }
  }

  const isFormValid = url && style && publisher

  return (
    <div className="min-h-screen mt-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-12 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-full mb-6 shadow-sm">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-semibold text-sm">AI-Powered Citation Generator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4">
            Research Paper Citation Tool
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Generate accurate citations from research paper URLs with professional formatting
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Citation Generator</h2>
                <p className="text-slate-600 text-sm">Fill in the details to generate your citation</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* URL Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <Globe className="w-4 h-4 text-blue-600" />
                  Research Paper URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://example.com/research-paper"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onFocus={() => setFocusedField('url')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-4 pl-12 rounded-2xl border-2 transition-all duration-300 bg-white/70 backdrop-blur-sm
                      ${focusedField === 'url' 
                        ? 'border-blue-400 shadow-lg shadow-blue-500/25 ring-4 ring-blue-100' 
                        : 'border-slate-200 hover:border-slate-300'
                      }
                      focus:outline-none placeholder-slate-400`}
                    required
                  />
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  {url && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Citation Style Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Citation Style
                </label>
                <div className="relative">
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    onFocus={() => setFocusedField('style')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-4 pl-12 rounded-2xl border-2 transition-all duration-300 bg-white/70 backdrop-blur-sm appearance-none cursor-pointer
                      ${focusedField === 'style' 
                        ? 'border-indigo-400 shadow-lg shadow-indigo-500/25 ring-4 ring-indigo-100' 
                        : 'border-slate-200 hover:border-slate-300'
                      }
                      focus:outline-none`}
                    required
                  >
                    <option value="" className="text-slate-400">Select a citation style</option>
                    {citationStyles.map((styleOption) => (
                      <option key={styleOption.value} value={styleOption.value} className="text-slate-700">
                        {styleOption.label} - {styleOption.description}
                      </option>
                    ))}
                  </select>
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {style && (
                    <Check className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Publisher Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Publisher
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {publishers.map((pub) => (
                    <button
                      key={pub.value}
                      type="button"
                      onClick={() => setPublisher(pub.value)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 active:scale-95
                        ${publisher === pub.value 
                          ? 'border-purple-400 bg-purple-50 shadow-lg shadow-purple-500/25 ring-4 ring-purple-100' 
                          : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white/90'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{pub.icon}</span>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm">{pub.label}</div>
                          {publisher === pub.value && (
                            <Check className="w-4 h-4 text-purple-600 mt-1" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 group
                    ${isFormValid && !isSubmitting
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gradient-to-r from-slate-400 to-slate-500 cursor-not-allowed'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Generating Citation...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Citation</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>

                <p className="p-1 text-gray-600 text-sm"> Search try for the users to analyse different publications, but chances of not able to perform</p>
              
              
              </div>
             

              {/* Form validation indicator */}
              {!isFormValid && (
                <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <AlertCircle className="w-4 h-4" />
                  <span>Please fill in all fields to generate your citation</span>
                </div>
              )}
            </div>
          </div>


          {citation&&jsonInput&&<div className="max-w-4xl mx-auto p-6 mt-8 bg-white rounded-3xl shadow-lg border border-gray-200 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-blue-700 mb-2">📌 Citation ({style})</h2>
        <p className="bg-gray-100 p-4 rounded-lg text-gray-800 text-base leading-relaxed shadow-sm">
          {citation}
        </p>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">📋 Citation Details</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium">Authors:</p>
            <ul className="list-disc list-inside">
              {jsonInput.authors.map((author, index) => (
                <li key={index}>{author}</li>
              ))}
            </ul>
          </div>
          <div>
            <p><span className="font-medium">Title:</span> {jsonInput.title}</p>
            <p><span className="font-medium">Source:</span> {jsonInput.source}</p>
            <p><span className="font-medium">Year:</span> {jsonInput.year}</p>
            <p><span className="font-medium">Pages:</span> {jsonInput.pages}</p>
            <p><span className="font-medium">Issue No.:</span> {jsonInput.issue_number}</p>
            <p><span className="font-medium">Volume:</span> {jsonInput.volume || "—"}</p>
            <p>
              <span className="font-medium">URL:</span>{" "}
              <a
                href={jsonInput.url}
                className="text-blue-600 underline hover:text-blue-800"
                target="_blank"
              >
                {jsonInput.url}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>}
        </div>

        {/* Feature highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "⚡", title: "Instant Generation", desc: "Get citations in seconds" },
            { icon: "🎯", title: "Multiple Styles", desc: "9 citation formats supported" },
            { icon: "🔒", title: "Accurate Results", desc: "AI-powered precision" }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}