// utils/generateDocument.js
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

export async function generateDocxFromResult(title, authors, result, citation) {
  const createParagraph = (text, bold = false, spacingBefore = 200) =>
    new Paragraph({
      spacing: { before: spacingBefore, after: 100 },
      children: [new TextRun({ text, bold, size: 24 })],
    });

  const createHeading = (text) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    });

  const doc = new Document({
    sections: [
      {
        children: [
          // Title
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Authors
          ...(authors && authors.length
            ? [
                new Paragraph({
                  text: authors.join(", "),
                  alignment: AlignmentType.CENTER,
                  italics: true,
                  spacing: { after: 300 },
                }),
              ]
            : []),

          createHeading("Key Findings"),
          createParagraph(result.Findings),

          createHeading("Methodology"),
          createParagraph(result.Methodology),

          createHeading("Data Source of Methodology"),
          createParagraph(result.DataSourceOfMethodology),

          createHeading("Novelty of the Study"),
          createParagraph(result.Novelty),

          createHeading("Relationship with Study"),
          createParagraph(result.RelationshipWithStudy),

          ...(result.ResearchGaps && result.ResearchGaps.length
            ? [
                createHeading("Research Gaps"),
                ...result.ResearchGaps.map((item, i) =>
                  new Paragraph({
                    text: `${i + 1}. ${item.gap}`,
                    bullet: { level: 0 },
                  })
                ),
              ]
            : []),

          ...(result.StudyObjectives && result.StudyObjectives.length
            ? [
                createHeading("Study Objectives"),
                ...result.StudyObjectives.map((item, i) =>
                  new Paragraph({
                    text: `${i + 1}. ${item.objective}`,
                    bullet: { level: 0 },
                  })
                ),
              ]
            : []),

          createHeading("Statistical Tools"),
          createParagraph(result.StatisticalTools),

          createHeading("Research Summary"),
          createParagraph(result.ResearchSummary),

          ...(citation
            ? [createHeading("Citation"), createParagraph(citation)]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title}.docx`);
}
