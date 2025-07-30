"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Upload, File, X, Check, FileText, Image, Archive, Music, Video, Plus, ArrowRight, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '@/app/Context/UserAuth';
import { uploadFile } from '@/app/Services/Literature_Review';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import DocPreviewSection from '@/app/Component/features/Research-Idea-generation/PreviewSection';
import { GenerateIdea, reviewDocInsight } from '@/app/Services/Idea-Generation';
import IdeasGrid from '@/app/Component/features/Research-Idea-generation/IdeasGrid';

export default function FileUploadComponent() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMode, setUploadMode] = useState('single'); // 'single' or 'multiple'
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    if (fileType.startsWith('audio/')) return Music;
    if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
    if (fileType.includes('zip') || fileType.includes('rar')) return Archive;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = useCallback((files) => {
    const fileArray = Array.from(files);
    
    if (uploadMode === 'single') {
      setSelectedFiles(fileArray.slice(0, 1));
    } else {
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
  }, [uploadMode]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
  };

  const [ideas,setIdeas]=useState([])
  
  const handleIdeaGeneration=async()=>{
setIsProcessing(true);
    try
    {

const data={
  combinedLR:insights.map((insight)=>{
    return insight.literature_review
  }),
  openapikey:process.env.NEXT_PUBLIC_OPEN_API_KEY

}

 
      const response=await GenerateIdea(data)
      console.log(response)
if(response.results){
  setIdeas(response.results.Research_Ideas)
}else{
  toast.error("Can't generate Ideas.")
}
    }
    catch(err){
      console.log(err)
      toast.error("Error in Idea Generation")
    }
    setIsProcessing(false)
  }

const [insights,setInsights]=useState([])

  const handleProceed = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();

      // Append each selected file (if multiple)
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("file", selectedFiles[i]);
      }

      formData.append("user_id", user._id);
      formData.append("bucket_name", process.env.NEXT_PUBLIC_BUCKET);
      formData.append("aws_access_key_id", process.env.NEXT_PUBLIC_AWS_ID);
      formData.append("aws_secret_access_key", process.env.NEXT_PUBLIC_ACCESS_KEY);
      formData.append("s3_file_name", "New file " + Math.random());

      const response = await uploadFile(formData);

      if (response.s3_url) {
        toast.success("Your paper uploaded successfully");
        const respInsight = await reviewDocInsight(response.s3_url);  
        console.log(respInsight);
        
if(respInsight.length>0){
  setInsights(respInsight)
}else{
  toast.error("Error in fetching ")
}

      } else {
        toast.error("Error occurred while uploading File");
      }
      console.log(response);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed. Please try again.");
    }

    setIsProcessing(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-20 px-4 md:px-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-full mb-6 shadow-sm">
            <Upload className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-semibold text-sm">File Upload</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4">
            Upload Your Files
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select single or multiple files from your device to begin processing
          </p>
        </div>

        <DocPreviewSection />

        {/* Upload Area */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
          <div
            className={`
              relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer
              ${isDragging 
                ? 'border-blue-500 bg-blue-50 scale-105' 
                : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/50'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            {/* Upload Icon */}
            <div className="text-center">
              <div className={`
                w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300
                ${isDragging 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 scale-110' 
                  : 'bg-gradient-to-r from-slate-400 to-slate-500 hover:from-blue-500 hover:to-indigo-600'
                }
              `}>
                <Upload className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {isDragging ? 'Drop files here' : 'Upload your files'}
              </h3>
              <p className="text-slate-600 mb-4">
                Drag and drop files here, or click to browse
              </p>
              <div className="text-sm text-slate-500">
                {uploadMode === 'single' ? 'Select 1 file' : 'Select multiple files'}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple={uploadMode === 'multiple'}
              onChange={handleFileInputChange}
              className="hidden"
              accept=".doc,.docx"
            />
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                Selected Files ({selectedFiles.length})
              </h3>
              <button
                onClick={clearAllFiles}
                className="text-slate-500 hover:text-red-500 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedFiles.map((file, index) => {
                const FileIconComponent = getFileIcon(file.type);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileIconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFile(index)}
                      className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {selectedFiles.length === 0 ? (
            <button
              onClick={openFileDialog}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Choose Files
            </button>
          ) : (
            <>
              <button
                onClick={openFileDialog}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add More Files
              </button>
              
              <button
                onClick={handleProceed}
                disabled={isProcessing}
                className={`
                  inline-flex items-center gap-3 px-8 py-4 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95
                  ${isProcessing 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                  }
                `}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Proceed with Files
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Supported File Types</h4>
              <p className="text-blue-800 text-sm">
                Docx, Doc
              </p>
              <p className="text-blue-700 text-sm mt-2">
                Maximum file size: 50MB per file
              </p>
            </div>
          </div>
        </div>
      
{insights.length>0&&<div className=' grid grid-cols-1 gap-1 md:grid-cols-2 p-4 rounded-2xl m-2 bg-gray-100 '>

{insights.length>0&&
  insights.map((insight,idx)=>{
    return (
<div
key={idx}
className='py-3 px-2 rounded-2xl m-2 bg-white'
>
<p className='text-blue-700 italic '>
  #{idx} Paper
</p>

<h2 className='text-2xl font-bold text-black'>
  Title:<br></br>
  {
insight.
individual_title.length>0?
insight.individual_title:
"Trading strategies in the Italian interbank market"

  }
</h2>

  </div>


    )

  })
}


<button
onClick={()=>handleIdeaGeneration()}
disabled={isProcessing}
className='px-3 bg-blue-600 mt-5 w-fit hover:scale-105 cursor-pointer flex items-center justify-between font-bold py-2 rounded-2xl text-white'
>
<span>Generate Ideas</span>
{isProcessing&&<Loader className=' h-10 w-10 animate-spin mx-2'></Loader>}
</button>


</div>
}
      </div>

{ideas.length>0&&<IdeasGrid ideasData={ideas}></IdeasGrid>}


    </div>
  );
}