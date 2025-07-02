import { useState } from 'react';
import { Search, Sparkles, Plus, X, Key, Play } from 'lucide-react';
import ResearchResults from './ResearchResult';
import { useRouter } from 'next/navigation';
import { getTitle } from '@/app/Services/Literation-Review';
import ResearchPaperGenerator from './advance/HowWeGenerate';
import { toast } from 'react-toastify';

export default function ResearchInputComponent() {
  const [formData, setFormData] = useState({
    subject: 'Special Education for Children with Disabilities',
    specialization: 'Education',
    openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY ,
    keywords: ['Hearing-Impaired STUDENTS', 'parental involvement', 'self concept'],
  });
const [researchData,setResearchData]=useState(null) 

  const [newKeyword, setNewKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const router=useRouter()
  const [showResult,setShowResult]=useState(false)

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const handleTitleGeneration = async () => {
    setIsGenerating(true);
 const res= await getTitle(formData)
 if(res){
  if(res.results){
setResearchData(res)
  setIsGenerating(false);
       setShowResult(true)}
       else{
        toast("Error Generating Titles")
          setIsGenerating(false);

       }
 }
 
  };

  const handleAdvancedSearch = async () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
       const params = new URLSearchParams();

    params.set('subject', formData.subject);
    params.set('specialization', formData.specialization);
    params.set('keywords', formData.keywords.join(',')); // array to comma string

    const newUrl = `${window.location.pathname}/advance?${params.toString()}`;
    router.push(newUrl)
     /// router.push('/title-generation/advance')
      
    }, 2000);
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50 flex flex-col items-center justify-center ">
  {/* Hero Section */}

  {/* <div className="top-0 mt-10 w-full bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300 py-12 px-4 text-center">
    <h1 className="text-4xl font-bold text-white mb-2">Research Quest</h1>
    <p className="text-xl text-orange-100 mb-6">AI Powered Research Title Generator</p>
    <p className="text-orange-100/90 max-w-2xl mx-auto mb-8">
      Supercharge every step—from brainstorming ideas to data analysis and flawless papers.
    </p>
    <div className="flex gap-4 justify-center">
      <button className="px-6 py-3 bg-white text-orange-700 font-medium rounded-lg hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-lg">
        Start Research Journey
      </button>
      <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
        <Play className="w-4 h-4" /> Watch Demo
      </button>
    </div>


  </div> */}
   <ResearchPaperGenerator ></ResearchPaperGenerator>


  {/* Main Form Container */}
  <div className="relative w-full p-5 ">
    <div className="backdrop-blur-sm bg-white/80 border border-orange-200 rounded-3xl p-8 shadow-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-red-500 rounded-2xl mb-4 shadow-md">
          <Search className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-orange-800 mb-2">
          ResearchQuest
        </h1>
        <p className="text-orange-600">Craft your perfect research query with AI-powered assistance</p>
      </div>
      {/* Form */}
      <div className="space-y-6">
        {/* Subject Field */}
        <div className="group">
          <label className="block text-sm font-medium text-orange-800 mb-2">Research Subject</label>
          <div className="relative">
            <textarea
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none hover:border-orange-300"
              rows="3"
              placeholder="Enter your research subject..."
            />
          </div>
        </div>
        {/* Specialization Field */}
        <div className="group">
          <label className="block text-sm font-medium text-orange-800 mb-2">Specialization</label>
          <div className="relative">
            <select
              value={formData.specialization}
              onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl text-orange-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:border-orange-300 appearance-none cursor-pointer"
            >
              <option value="Education">Education</option>
              <option value="Psychology">Psychology</option>
              <option value="Medicine">Medicine</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Social Sciences">Social Sciences</option>
            </select>
          </div>
        </div>
      
        {/* Keywords Section */}
        <div>
          <label className="block text-sm font-medium text-orange-800 mb-3">Research Keywords</label>

          {/* Existing Keywords */}
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.keywords.map((keyword, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3 py-2 bg-amber-100 border border-amber-200 rounded-lg text-sm text-orange-800 hover:bg-amber-200 transition-all duration-300 group"
              >
                <span>{keyword}</span>
                <button
                  onClick={() => removeKeyword(index)}
                  className="p-0.5 hover:bg-orange-500/20 rounded-full transition-colors duration-200"
                >
                  <X className="w-3 h-3 text-orange-600" />
                </button>
              </div>
            ))}
          </div>
          {/* Add New Keyword */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              className="flex-1 px-4 py-2 bg-white border border-orange-200 rounded-lg text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
              placeholder="Add a keyword..."
            />
            <button
              onClick={addKeyword}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-red-500 text-white rounded-lg hover:from-amber-600 hover:to-red-600 transition-all duration-300 flex items-center gap-2 hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handleTitleGeneration}
          disabled={isGenerating}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-12'} transition-transform duration-300`} />
          <span className="font-semibold">
            {isGenerating ? 'Generating...' : 'Title Generation'}
          </span>
        </button>
        <button
          onClick={handleAdvancedSearch}
          disabled={isSearching}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Search className={`w-5 h-5 ${isSearching ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`} />
          <span className="font-semibold">
            {isSearching ? 'Searching...' : 'Advanced Search'}
          </span>
        </button>
      </div>
      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-orange-600/70">
          Powered by AI • Secure & Private • Research Made Simple
        </p>
      </div>
    </div>
  </div>{showResult&&researchData&&
  <ResearchResults data={researchData}></ResearchResults>}
</div>


  );
}