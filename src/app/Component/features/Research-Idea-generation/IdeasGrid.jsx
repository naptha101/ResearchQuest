// components/IdeasGrid.js
import { generateFlowChart } from '@/app/Services/Idea-Generation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectTimelineChart from './MethologyChart';

const subjects = [
  "Management",
  "Engineering",
  "Social Sciences",
  "Natural Sciences",
  "Medicine",
  "Computer Science",
  "Education",
  "Law",
  "Arts and Humanities",
  "Marketing",
  "Psychology",
  "Biology",
  "Chemistry"
];

const IdeasGrid = ({ ideasData }) => {
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isGeneratingFlowChart, setIsGeneratingFlowChart] = useState(false);
  const [flowChartData, setFlowChartData] = useState(null);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  const handleSelectIdea = (index) => {
    setSelectedIdeaIndex(prevIndex => (prevIndex === index ? null : index));
    setFlowChartData(null); // Reset flow chart when selecting new idea
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setShowSubjectDropdown(false);
  };

  const handleFlowChart = async () => {
    if (!selectedIdeaIndex !== null && !selectedSubject) return;
    
    try {
      setIsGeneratingFlowChart(true);
      
      const flowChart = await generateFlowChart({
        research_idea: ideasData[selectedIdeaIndex].idea,
        subject: selectedSubject,
        openapikey:process.env.NEXT_PUBLIC_OPEN_API_KEY
      });
//console.log(flowChart)
     setFlowChartData(flowChart.results);
    } catch (err) {
      console.error("Error generating flow chart:", err);
    } finally {
      setIsGeneratingFlowChart(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Choose a Research Idea</h2>
        <p className="text-gray-600 mt-2">Please review the generated ideas and select one to proceed.</p>
        
        {selectedIdeaIndex !== null && (
          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="inline-block p-3 bg-indigo-100 text-indigo-800 rounded-lg shadow-sm">
              You have selected: <strong>Research Idea #{selectedIdeaIndex + 1}</strong>
            </div>

            {/* Subject Selection */}
            <div className="relative w-full max-w-xs">
              <button
                onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                className="w-full flex justify-between items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <span>{selectedSubject || "Select Subject"}</span>
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <AnimatePresence>
                {showSubjectDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
                  >
                    <ul className="py-1">
                      {subjects.map((subject, index) => (
                        <li
                          key={index}
                          onClick={() => handleSubjectSelect(subject)}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 cursor-pointer"
                        >
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generate Flow Chart Button */}
            {selectedSubject && (
              <button
                onClick={handleFlowChart}
                disabled={isGeneratingFlowChart}
                className={`px-6 py-3 rounded-xl font-medium text-white transition-all ${
                  isGeneratingFlowChart
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
                }`}
              >
                {isGeneratingFlowChart ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Flow Chart...
                  </>
                ) : (
                  'Generate Flow Chart'
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {ideasData.map((item, index) => (
          <div
            key={index}
            onClick={() => handleSelectIdea(index)}
            className={`
              bg-white rounded-xl shadow-lg overflow-hidden 
              transform hover:-translate-y-2 transition-all duration-300 ease-in-out
              cursor-pointer
              ${selectedIdeaIndex === index 
                ? 'ring-4 ring-offset-2 ring-blue-500'
                : 'ring-1 ring-gray-200'
              }
            `}
          >
            <div className="p-6">
              <p className="text-gray-700 text-base leading-relaxed">
                {item.idea}
              </p>
            </div>
            <div className={`
              px-6 py-4 transition-colors duration-300
              ${selectedIdeaIndex === index ? 'bg-blue-600' : 'bg-gray-50'}
            `}>
              <span className={`
                text-sm font-semibold 
                ${selectedIdeaIndex === index ? 'text-white' : 'text-gray-600'}
              `}>
                Research Idea #{index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Flow Chart Display */}
      {flowChartData && (
       <ProjectTimelineChart
       chartData={flowChartData}
       ></ProjectTimelineChart>

      )}
    </div>
  );
};

export default IdeasGrid;