import jsPDF from 'jspdf';
import { Download } from 'lucide-react';
import React, { useState } from 'react';

const ResearchTitlesDisplay = ({ data, gaps, selectedPapers }) => {
  const { time_taken, titles } = data;
  const [selectedTitle, setSelectedTitle] = useState(null);
 console.log(gaps)
  const selectedPaperTitles = titles.filter((title) =>
    selectedPapers.some((sp) => sp.title === title.title)
  );

  const selectedGaps = selectedPaperTitles.map((paper) => {
    const matchingGap = gaps.find((gap) => gap.title === paper.title);
    return {
      ...paper,
      research_gaps_covered: matchingGap?.analysis?.gaps || [],
    };
  });

  const handleTitleClick = (title) => {
    setSelectedTitle(title);
  };

const generateResearchPDF = (selectedPapers, gaps, titles, selectedTitle) => {
  const doc = new jsPDF();
  let yOffset = 20; // Initial yOffset

  // =================================================================
  // STYLING AND CONFIGURATION
  // Centralized theme for easy customization
  // =================================================================
  const STYLE_GUIDE = {
    COLORS: {
      PRIMARY: [22, 160, 133],   // A modern teal
      SECONDARY: [44, 62, 80],    // A deep, dark blue for text
      ACCENT: [231, 76, 60],     // A vibrant red/orange for highlights
      LIGHT_GRAY: [248, 249, 250], // Very light gray for card backgrounds
      MEDIUM_GRAY: [170, 170, 170], // For footers and subtitles
      WHITE: [255, 255, 255],
    },
    FONTS: {
      TITLE: { family: 'helvetica', weight: 'bold', size: 24 },
      SUBTITLE: { family: 'helvetica', weight: 'normal', size: 12 },
      SECTION_HEADER: { family: 'helvetica', weight: 'bold', size: 16 },
      CARD_TITLE: { family: 'helvetica', weight: 'bold', size: 12 },
      BODY: { family: 'helvetica', weight: 'normal', size: 10 },
      BODY_BOLD: { family: 'helvetica', weight: 'bold', size: 10 },
      ITALIC: { family: 'helvetica', weight: 'italic', size: 9 },
      FOOTER: { family: 'helvetica', weight: 'normal', size: 8 },
    },
    SPACING: {
      MARGIN: 20,
      LINE_HEIGHT: 6,
      SECTION_GAP: 15,
      PARA_GAP: 4,
      CARD_PADDING: 10,
    },
  };

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const contentWidth = pageWidth - 2 * STYLE_GUIDE.SPACING.MARGIN;

  // =================================================================
  // HELPER FUNCTIONS
  // =================================================================

  // Helper to apply font styles from the guide
  const setFont = (fontStyle) => {
    doc.setFont(fontStyle.family, fontStyle.weight);
    doc.setFontSize(fontStyle.size);
  };

  // Helper to add justified body text
  const addBodyText = (text, x, y, maxWidth) => {
    setFont(STYLE_GUIDE.FONTS.BODY);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y, { align: 'justify' });
    return lines.length * STYLE_GUIDE.SPACING.LINE_HEIGHT;
  };
  
  // Helper to add text with an icon prefix
  const addIconText = (icon, text, x, y) => {
      setFont(STYLE_GUIDE.FONTS.SECTION_HEADER);
      doc.setTextColor(...STYLE_GUIDE.COLORS.PRIMARY);
      doc.text(icon, x, y);
      doc.text(text, x + 8, y);
      doc.setTextColor(...STYLE_GUIDE.COLORS.SECONDARY);
  }

  const checkPageBreak = (requiredHeight) => {
    if (yOffset + requiredHeight > pageHeight - STYLE_GUIDE.SPACING.MARGIN) {
      addFooter();
      doc.addPage();
      yOffset = STYLE_GUIDE.SPACING.MARGIN;
      addHeader();
      yOffset += 15; // Space below header
    }
  };

  const addHeader = () => {
    doc.setFillColor(...STYLE_GUIDE.COLORS.PRIMARY);
    doc.rect(0, 0, pageWidth, 12, 'F');
    setFont(STYLE_GUIDE.FONTS.SUBTITLE);
    doc.setTextColor(...STYLE_GUIDE.COLORS.WHITE);
    doc.text('Research Analysis Report', pageWidth / 2, 8, { align: 'center' });
    doc.setTextColor(...STYLE_GUIDE.COLORS.SECONDARY);
  };

  const addFooter = () => {
    const footerY = pageHeight - 8;
    setFont(STYLE_GUIDE.FONTS.FOOTER);
    doc.setTextColor(...STYLE_GUIDE.COLORS.MEDIUM_GRAY);
    doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - STYLE_GUIDE.SPACING.MARGIN, footerY, { align: 'right' });
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, STYLE_GUIDE.SPACING.MARGIN, footerY);
    doc.setTextColor(...STYLE_GUIDE.COLORS.SECONDARY);
  };

  const addSectionTitle = (title, icon) => {
    checkPageBreak(30);
    yOffset += STYLE_GUIDE.SPACING.SECTION_GAP;
    addIconText(icon, title, STYLE_GUIDE.SPACING.MARGIN, yOffset);
    yOffset += STYLE_GUIDE.SPACING.LINE_HEIGHT * 1.5;
    doc.setDrawColor(...STYLE_GUIDE.COLORS.PRIMARY);
    doc.setLineWidth(0.3);
    doc.line(STYLE_GUIDE.SPACING.MARGIN, yOffset, pageWidth - STYLE_GUIDE.SPACING.MARGIN, yOffset);
    yOffset += STYLE_GUIDE.SPACING.SECTION_GAP / 2;
  };

  

  const addCoverPage = () => {
    // Background
    doc.setFillColor(...STYLE_GUIDE.COLORS.PRIMARY);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setFillColor(...STYLE_GUIDE.COLORS.WHITE);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30, 'F');

    // Title Block
    doc.setTextColor(...STYLE_GUIDE.COLORS.SECONDARY);
    setFont(STYLE_GUIDE.FONTS.TITLE);
    doc.text('Research Papers Analysis', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
    
    // Subtitle
    setFont(STYLE_GUIDE.FONTS.SUBTITLE);
    doc.setTextColor(...STYLE_GUIDE.COLORS.MEDIUM_GRAY);
    doc.text('A comprehensive report on selected literature and identified research gaps.', pageWidth / 2, pageHeight / 2 - 5, { align: 'center' });

    // Decorative Line
    doc.setDrawColor(...STYLE_GUIDE.COLORS.PRIMARY);
    doc.setLineWidth(0.5);
    doc.line(pageWidth/2 - 50, pageHeight / 2, pageWidth/2 + 50, pageHeight / 2);

    // Footer Info
    setFont(STYLE_GUIDE.FONTS.BODY);
    doc.setTextColor(...STYLE_GUIDE.COLORS.SECONDARY);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 35, { align: 'center' });
    
    doc.addPage();
    yOffset = STYLE_GUIDE.SPACING.MARGIN;
    addHeader();
    yOffset += 15;
  };

  const addPaperCard = (paper, index, isGapSection = false) => {
    const cardContentX = STYLE_GUIDE.SPACING.MARGIN + STYLE_GUIDE.SPACING.CARD_PADDING;
    const cardContentWidth = contentWidth - (2 * STYLE_GUIDE.SPACING.CARD_PADDING);

    // --- 1. Pre-calculate the height needed for the card ---
    let requiredHeight = STYLE_GUIDE.SPACING.CARD_PADDING * 2; // Top and bottom padding

    const titleLines = doc.splitTextToSize(`${index + 1}. ${paper.title}`, cardContentWidth);
    requiredHeight += titleLines.length * STYLE_GUIDE.SPACING.LINE_HEIGHT;

    const authorsText = `By: ${paper.authors.join(', ')} (${paper.year})`;
    const authorsLines = doc.splitTextToSize(authorsText, cardContentWidth);
    requiredHeight += authorsLines.length * (STYLE_GUIDE.SPACING.LINE_HEIGHT - 1) + STYLE_GUIDE.SPACING.PARA_GAP;
    
    const summaryLabel = isGapSection ? 'Methodology Summary' : 'Abstract Summary';
    const summaryText = paper.analysis?.methodology || paper.summary || 'No summary available.';
    const summaryLines = doc.splitTextToSize(summaryText, cardContentWidth);
    requiredHeight += (summaryLines.length * STYLE_GUIDE.SPACING.LINE_HEIGHT) + STYLE_GUIDE.SPACING.PARA_GAP * 2 + STYLE_GUIDE.SPACING.LINE_HEIGHT; // Label + text
    
    let gapsLines = [];
    if (isGapSection && paper.analysis?.gaps?.length) {
        const gapsText = paper.analysis.gaps.map(g => `• ${g}`).join('\n');
        gapsLines = doc.splitTextToSize(gapsText, cardContentWidth);
        requiredHeight += (gapsLines.length * STYLE_GUIDE.SPACING.LINE_HEIGHT) + STYLE_GUIDE.SPACING.PARA_GAP * 2 + STYLE_GUIDE.SPACING.LINE_HEIGHT; // Label + text
    }
    
    requiredHeight += STYLE_GUIDE.SPACING.LINE_HEIGHT + STYLE_GUIDE.SPACING.PARA_GAP; // Link space

    // --- 2. Check for page break and draw the card ---
    checkPageBreak(requiredHeight + STYLE_GUIDE.SPACING.SECTION_GAP);

    const cardYStart = yOffset;
    doc.setDrawColor(...STYLE_GUIDE.COLORS.PRIMARY);
    doc.setFillColor(...STYLE_GUIDE.COLORS.LIGHT_GRAY);
    doc.setLineWidth(0.2);
    doc.roundedRect(STYLE_GUIDE.SPACING.MARGIN, cardYStart, contentWidth, requiredHeight, 3, 3, 'FD');
    
    yOffset += STYLE_GUIDE.SPACING.CARD_PADDING;

    // --- 3. Render the content inside the card ---
    // Title
    setFont(STYLE_GUIDE.FONTS.CARD_TITLE);
    doc.setTextColor(...STYLE_GUIDE.COLORS.SECONDARY);
    doc.text(titleLines, cardContentX, yOffset);
    yOffset += titleLines.length * STYLE_GUIDE.SPACING.LINE_HEIGHT + STYLE_GUIDE.SPACING.PARA_GAP;

    // Authors & Year
    setFont(STYLE_GUIDE.FONTS.ITALIC);
    doc.setTextColor(...STYLE_GUIDE.COLORS.MEDIUM_GRAY);
    doc.text(authorsLines, cardContentX, yOffset);
    yOffset += authorsLines.length * (STYLE_GUIDE.SPACING.LINE_HEIGHT - 1) + STYLE_GUIDE.SPACING.PARA_GAP;

    // Summary / Methodology
    setFont(STYLE_GUIDE.FONTS.BODY_BOLD);
    doc.setTextColor(...STYLE_GUIDE.COLORS.SECONDARY);
    doc.text(`${summaryLabel}:`, cardContentX, yOffset);
    yOffset += STYLE_GUIDE.SPACING.LINE_HEIGHT;
    yOffset += addBodyText(summaryText, cardContentX, yOffset, cardContentWidth) + STYLE_GUIDE.SPACING.PARA_GAP;

    // Gaps (if applicable)
    if (gapsLines.length > 0) {
        setFont(STYLE_GUIDE.FONTS.BODY_BOLD);
        doc.setTextColor(...STYLE_GUIDE.COLORS.ACCENT);
        doc.text('Identified Gaps:', cardContentX, yOffset);
        yOffset += STYLE_GUIDE.SPACING.LINE_HEIGHT;
        setFont(STYLE_GUIDE.FONTS.BODY);
        doc.setTextColor(...STYLE_GUIDE.COLORS.SECONDARY);
        doc.text(gapsLines, cardContentX, yOffset);
        yOffset += gapsLines.length * STYLE_GUIDE.SPACING.LINE_HEIGHT + STYLE_GUIDE.SPACING.PARA_GAP;
    }

    // Link
    setFont(STYLE_GUIDE.FONTS.BODY_BOLD);
    doc.setTextColor(...STYLE_GUIDE.COLORS.PRIMARY);
    doc.textWithLink('View Original Paper →', STYLE_GUIDE.SPACING.MARGIN + contentWidth - STYLE_GUIDE.SPACING.CARD_PADDING, cardYStart + requiredHeight - STYLE_GUIDE.SPACING.CARD_PADDING, { 
        url: paper.link,
        align: 'right'
    });
    doc.setTextColor(...STYLE_GUIDE.COLORS.SECONDARY);

    // Update global yOffset to be after the card
    yOffset = cardYStart + requiredHeight + STYLE_GUIDE.SPACING.SECTION_GAP;
  };

  const addSelectedTitleAnalysis = (paper) => {
    addSectionTitle('Proposed Research Title', '⭐');

    const cardContentX = STYLE_GUIDE.SPACING.MARGIN + STYLE_GUIDE.SPACING.CARD_PADDING;
    const cardContentWidth = contentWidth - (2 * STYLE_GUIDE.SPACING.CARD_PADDING);

    // Pre-calculate height
    let requiredHeight = STYLE_GUIDE.SPACING.CARD_PADDING * 2;
    const titleLines = doc.splitTextToSize(paper.title, cardContentWidth);
    const explanationLines = doc.splitTextToSize(paper.title_explanation, cardContentWidth);
    requiredHeight += (titleLines.length + explanationLines.length) * STYLE_GUIDE.SPACING.LINE_HEIGHT;
    requiredHeight += STYLE_GUIDE.SPACING.LINE_HEIGHT * 2; // For labels
    requiredHeight += STYLE_GUIDE.SPACING.PARA_GAP * 3;

    checkPageBreak(requiredHeight);

    // Draw container
    doc.setDrawColor(...STYLE_GUIDE.COLORS.ACCENT);
    doc.setFillColor(255, 245, 245); // A very light red
    doc.setLineWidth(0.3);
    doc.roundedRect(STYLE_GUIDE.SPACING.MARGIN, yOffset, contentWidth, requiredHeight, 3, 3, 'FD');

    let innerY = yOffset + STYLE_GUIDE.SPACING.CARD_PADDING;

    // Title
    setFont(STYLE_GUIDE.FONTS.BODY_BOLD);
    doc.setTextColor(...STYLE_GUIDE.COLORS.ACCENT);
    doc.text('Selected Title:', cardContentX, innerY);
    innerY += STYLE_GUIDE.SPACING.LINE_HEIGHT;
    setFont(STYLE_GUIDE.FONTS.CARD_TITLE);
    doc.setTextColor(...STYLE_GUIDE.COLORS.SECONDARY);
    doc.text(titleLines, cardContentX, innerY);
    innerY += titleLines.length * STYLE_GUIDE.SPACING.LINE_HEIGHT + STYLE_GUIDE.SPACING.PARA_GAP * 2;

    // Explanation
    setFont(STYLE_GUIDE.FONTS.BODY_BOLD);
    doc.setTextColor(...STYLE_GUIDE.COLORS.ACCENT);
    doc.text('Justification:', cardContentX, innerY);
    innerY += STYLE_GUIDE.SPACING.LINE_HEIGHT;
    innerY += addBodyText(paper.title_explanation, cardContentX, innerY, cardContentWidth);

    yOffset += requiredHeight + STYLE_GUIDE.SPACING.SECTION_GAP;
  };

  // =================================================================
  // PDF GENERATION FLOW
  // =================================================================
  
  // 1. Start with the cover page.
  addCoverPage();

  // 2. Add Selected Papers Section
  if (selectedPapers && selectedPapers.length > 0) {
    addSectionTitle('Selected Papers Summary', '📄');
    selectedPapers.forEach((paper, index) => {
      addPaperCard(paper, index, false);
    });
  }

  // 3. Add Research Gaps Section
  if (gaps && gaps.length > 0) {
    addSectionTitle('Identified Research Gaps', '🔎');
    gaps.forEach((paper, index) => {
      addPaperCard(paper, index, true);
    });
  }
  
  // 4. Add the final proposed title if it exists
  if (selectedTitle) {
    const selectedPaper = titles.find((paper) => paper.title === selectedTitle);
    if (selectedPaper) {
      addSelectedTitleAnalysis(selectedPaper);
    }
  }

  // 5. Add the footer to the last page.
  addFooter();

  // 6. Save the document.
  doc.save('Research_Analysis_Report_v2.pdf');
};
  return (
    <div className="px-4 py-8 max-w-6xl mx-auto space-y-6">
      {/* Metadata */}
      {/* <div className="bg-orange-50 border-l-4 border-amber-500 p-4 rounded-md shadow-sm">
        {time_taken && (
          <p className="text-sm text-gray-700">
            <strong>Time Taken:</strong> {parseFloat(time_taken).toFixed(2)} sec
          </p>
        )}
      </div> */}

      {/* Paper Cards */}
      {titles.map((paper, index) => (
        <div 
          key={index} 
          className={`bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-md transition cursor-pointer ${
            selectedTitle === paper.title ? 'border-blue-500' : ''
          }`}
          onClick={() => handleTitleClick(paper.title)}
        >
          <div className="mb-2 flex justify-between items-center">
            <h3 className={`text-xl font-semibold ${
              selectedTitle === paper.title ? 'text-blue-600' : 'text-gray-900'
            }`}>
              #{paper.paper_no}. {paper.title}
            </h3>
          </div>
          <p className="text-gray-700 text-sm mb-4">{paper.title_explanation}</p>
          {/* <div className="mb-2">
            <p className="font-medium text-gray-800 mb-1">Research Gaps Covered:</p>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {(gaps.find((g) => g.title === paper.title)?.analysis?.gaps || []).map((gap, i) => (
                <li key={i}>{gap}</li>
              ))}
            </ul>
          </div> */}
        </div>
      ))}

      <button
        className="px-10 py-3 flex gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-400 text-white font-semibold"
        onClick={generateResearchPDF}
      >
        Generate PDF of Research Analysis
        <Download />
      </button>
    </div>
  );
};

export default ResearchTitlesDisplay;