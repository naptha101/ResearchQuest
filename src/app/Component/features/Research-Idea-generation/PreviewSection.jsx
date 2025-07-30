// components/DocPreviewSection.tsx

import Image from "next/image";
import { Download } from "lucide-react";

export default function DocPreviewSection() {
  return (
    <section className="w-full py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
        
        {/* Preview Image */}
        <div className="w-40 h-52 relative">
          <Image
            src="/images/ResearchIdea/previewDoc.png" // Replace with actual preview image path
            alt="Sample Doc Preview"
            fill
            className="rounded-md object-cover border border-gray-300"
          />
        </div>

        {/* Info + Button */}
        <div className="flex-1 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Upload Guidelines
          </h3>
          <p className="text-sm text-gray-600">
            Please ensure that your uploaded file strictly follows the format shown in this sample document. Files that do not match this format may be rejected.
          </p>
          <a
            href="/docs/LiteratureReviewsUploadFormat.docx" // Replace with actual path to sample doc
            download
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
          >
            <Download size={16} />
            Download Sample Doc
          </a>
        </div>
      </div>
    </section>
  );
}
