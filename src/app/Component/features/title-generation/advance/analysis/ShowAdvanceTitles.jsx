import React from 'react';

const ResearchTitlesDisplay = ({ data }) => {
  const { time_taken, titles, token_usage } = data;

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto space-y-6">
      {/* Header: Metadata */}
      <div className="bg-orange-50 border-l-4 border-amber-500 p-4 rounded-md shadow-sm">
        <p className="text-sm text-gray-700">
          <strong>Time Taken:</strong> {parseFloat(time_taken).toFixed(2)} sec
        </p>
        <p className="text-sm text-gray-700 mt-1">
          <strong>Token Usage:</strong> Input: {token_usage.input_tokens} tokens (${token_usage.input_cost}), Output: {token_usage.output_tokens} tokens (${token_usage.output_cost}), Total: {token_usage.total_cost}
        </p>
      </div>

      {/* Paper List */}
      {titles.map((paper) => (
        <div
          key={paper.paper_no}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-md transition"
        >
          <div className="mb-2 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              #{paper.paper_no}. {paper.title}
            </h3>
          </div>
          <p className="text-gray-700 text-sm mb-4">{paper.title_explanation}</p>

          <div className="mb-2">
            <p className="font-medium text-gray-800 mb-1">Research Gaps Covered:</p>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {paper.research_gaps_covered.map((gap, index) => (
                <li key={index}>{gap}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResearchTitlesDisplay;
