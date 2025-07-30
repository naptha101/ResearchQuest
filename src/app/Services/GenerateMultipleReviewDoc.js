import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  VerticalAlign, // Added this import
} from "docx";
import { saveAs } from "file-saver";

// Utility to truncate long text in table (no changes needed)
const truncate = (text, max = 100) =>
  text && text.length > max ? text.substring(0, max) + "..." : text || "-";

// Styled table cell - Corrected verticalAlign
const createStyledCell = (text, isHeader = false) =>
  new TableCell({
    shading: isHeader ? { fill: "e0e7ff" } : undefined,
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: isHeader, size: 18 })],
      }),
    ],
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER, // Corrected this from "center"
  });

// ⭐️ Added the missing createListCell function
const createListCell = (items) => {
  const paragraphs = (items || []).map(
    (itemText) =>
      new Paragraph({
        children: [new TextRun({ text: itemText, size: 18 })],
        bullet: {
          level: 0,
        },
      }),
  );

  return new TableCell({
    children: paragraphs.length > 0 ? paragraphs : [new Paragraph("")],
    verticalAlign: VerticalAlign.TOP,
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
  });
};

// Summary Table (no changes needed here as it now correctly calls the functions)
const createTable = (papers) => {
  const headers = [
    "No", "Title", "Authors", "Findings", "Research Summary", "Methodology", "Novelty",
    "Data Source Of Methodology", "Relationship With Study", "Statistical Tools", "Research Gaps", "Study Objectives",
  ];

  const rows = [
    new TableRow({
      tableHeader: true,
      children: headers.map((h) => createStyledCell(h, true)),
    }),
    ...papers.map((p, idx) => {
      const r = p.result || {};
      return new TableRow({
        children: [
          createStyledCell(`${idx + 1}`),
          createStyledCell(p.title),
          createStyledCell(p.authors?.join(", ")),
          createStyledCell(r.Findings),
          createStyledCell(r.ResearchSummary),
          createStyledCell(r.Methodology),
          createStyledCell(r.Novelty),
          createStyledCell(r.DataSourceOfMethodology),
          createStyledCell(r.RelationshipWithStudy),
          createStyledCell(r.StatisticalTools),
          createListCell((r.ResearchGaps || []).map((g) => g.gap)),
          createListCell((r.StudyObjectives || []).map((o) => o.objective)),
        ],
      });
    }),
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    },
  });
};

// Helper functions (no changes needed)
const heading = (text) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 100 },
  });

const paragraph = (text, size = 24) =>
  new Paragraph({
    spacing: { before: 200, after: 100 },
    // 👇 Ensure 'text' is always a string by adding a fallback
    children: [new TextRun({ text: text || "", size })],
  });
// Main generation function (no changes needed)
export async function generateCompleteReviewDoc(
  paperData,
  summaryList,
  finalReviewText,
) {
  const docContent = [];

  docContent.push(
    new Paragraph({
      text: "📝 Individual Paper Summaries",
      heading: HeadingLevel.HEADING_1,
    }),
  );
  summaryList.forEach((item, idx) => {
    docContent.push(heading(item.title));
    docContent.push(paragraph(item.summary?.results?.cite || ""));
    docContent.push(paragraph(item.summary?.results?.summary || ""));
  });

  docContent.push(
    new Paragraph({
      text: "📊 Consolidated Paper Review Table",
      heading: HeadingLevel.HEADING_1,
    }),
  );
  docContent.push(createTable(paperData));
  docContent.push(new Paragraph(""));

  docContent.push(
    new Paragraph({
      text: "📚 Final Consolidated Literature Review",
      heading: HeadingLevel.HEADING_1,
    }),
  );
  docContent.push(paragraph(finalReviewText));

  docContent.push(
    new Paragraph({ text: "Citations:", heading: HeadingLevel.HEADING_1 }),
  );
  paperData.forEach((item, idx) => {
    docContent.push(heading(`Paper ${idx + 1}`));
    docContent.push(heading(item.title));
    docContent.push(paragraph(item.citation || ""));
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { orientation: "landscape" },
          },
        },
        children: docContent,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Complete_Literature_Review.docx`);
}