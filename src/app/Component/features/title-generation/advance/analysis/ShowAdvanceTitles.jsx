import jsPDF from 'jspdf';
import { Download } from 'lucide-react';
import React from 'react';

const ResearchTitlesDisplay = ({ data }) => {
  const { time_taken, titles, token_usage } = data;
 const generateResearchPDF = (data) => {
  const doc = new jsPDF();
const pageWidth = doc.internal.pageSize.getWidth();
const margin = 12; // Consistent margin on both sides
let y = 15; // Initial Y position

// Set document-wide styles
doc.setFont('helvetica', 'bold');
doc.setFontSize(20);
doc.setTextColor(40, 53, 147);
doc.text('Research Paper Summaries', pageWidth / 2, y, { align: 'center' });
y += 20;

data.forEach((paper, index) => {
    // Paper Header Section - Handle long titles
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(margin - 2, y, pageWidth - (margin * 2) + 4, 10, 2, 2, 'F');
    doc.setTextColor(33, 37, 41);
    doc.setFontSize(13);
    
    // Split long titles into multiple lines
    const titleText = `${paper.paper_no}. ${paper.title}`;
    const titleLines = doc.splitTextToSize(titleText, pageWidth - (margin * 2) - 4);
    const titleHeight = titleLines.length * 6;
    
    // Adjust the box height based on title length
    doc.roundedRect(margin - 2, y, pageWidth - (margin * 2) + 4, titleHeight + 4, 2, 2, 'F');
    doc.text(titleLines, margin, y + 7);
    y += titleHeight + 10;

    // Title Explanation Section
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 53, 147);
    doc.text('Title Explanation:', margin, y + 6);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(66, 66, 66);
    const explanationLines = doc.splitTextToSize(paper.title_explanation, pageWidth - (margin * 2));
    const explanationHeight = explanationLines.length * 6;
    doc.text(explanationLines, margin, y + 12);
    y += explanationHeight + 15;

    // Research Gaps Section
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 53, 147);
    doc.text('Research Gaps Covered:', margin, y + 6);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const formattedGaps = paper.research_gaps_covered.map((gap, i) => `${i + 1}. ${gap}`);
    const gapLines = doc.splitTextToSize(formattedGaps.join('\n'), pageWidth - (margin * 2));
    const gapHeight = gapLines.length * 6;
    doc.text(gapLines, margin, y + 12);
    y += gapHeight + 20;

    // Add subtle separator between papers if not last paper
    if (index < data.length - 1) {
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;
        
        // Page break check (with larger buffer space)
        if (y > 270) {
            doc.addPage();
            y = 15;
        }
    }
});

// Footer with page numbers
const pageCount = doc.internal.getNumberOfPages();
doc.setFontSize(10);
doc.setTextColor(150);

for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
}

doc.save('Research_Paper_Summaries.pdf');
};
  return (
    <div className="px-4 py-8 max-w-6xl mx-auto space-y-6">
      {/* Header: Metadata */}
      <div className="bg-orange-50 border-l-4 border-amber-500 p-4 rounded-md shadow-sm">
        {time_taken&&<p className="text-sm text-gray-700">
          <strong>Time Taken:</strong> {parseFloat(time_taken).toFixed(2)} sec
        </p>}
        {/* <p className="text-sm text-gray-700 mt-1">
          <strong>Token Usage:</strong> Input: {token_usage.input_tokens} tokens (${token_usage.input_cost}), Output: {token_usage.output_tokens} tokens (${token_usage.output_cost}), Total: {token_usage.total_cost}
        </p> */}
      </div>

      {/* Paper List */}
      {titles.map((paper,index) => (
        <div
          key={index}
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

      <button className='px-10 py-3 flex gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-400' onClick={()=>{generateResearchPDF(titles)}}>
        Generate Pdf 
        <Download></Download>
      </button>
    </div>
  );
};

export default ResearchTitlesDisplay;
