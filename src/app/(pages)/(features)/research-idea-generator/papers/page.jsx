"use client"
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, File, X, Check, FileText, Image, Archive, Music, Video, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/Context/UserAuth';
import { finalReview, generateCitation, generateContext, generateTitle, uploadFile } from '@/app/Services/Literature_Review';
import { toast } from 'react-toastify';
import { GenerateIdea } from '@/app/Services/Idea-Generation';
import IdeasGrid from '@/app/Component/features/Research-Idea-generation/IdeasGrid';

export default function FileUploadComponent() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMode, setUploadMode] = useState('multiple'); // 'single' or 'multiple'
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
    const [Ideas,setIdeas]=useState(null)
  

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
  const {user,setUser}=useAuth()



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
  const router=useRouter()
const handleProceed = async () => {
  if (!selectedFiles || selectedFiles.length === 0) return;

  setIsProcessing(true);

  try {
    
 let response=null;
    // Append each selected file (if multiple)
    for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        console.log(selectedFiles[i])
    formData.append("file", selectedFiles[i]);
    formData.append("s3_file_name", selectedFiles[i].name);
    formData.append("user_id", user._id);
    formData.append("bucket_name", process.env.NEXT_PUBLIC_BUCKET);
    formData.append("aws_access_key_id", process.env.NEXT_PUBLIC_AWS_ID);
    formData.append("aws_secret_access_key", process.env.NEXT_PUBLIC_ACCESS_KEY);

     response = await uploadFile(formData);
}

    if(response.s3_url){
    toast.success("Your paper uploaded succesfully");

      const [respTitle, respContext, respCitation] = await Promise.all([
            generateTitle(response.s3_url),
            generateContext(response.s3_url),
            generateCitation(response.s3_url)
          ]);
 
     const val= {
          titleLR: respTitle.results.title,
          graphragLR: respContext.results,
          citationLR: respCitation.results,
          openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY
        }
 
             const resp=await finalReview(val)
                               // console.log(resp)
                    if(resp.results){
                        
                       const response=await GenerateIdea({
                         combinedLR:resp,
                         openapikey:process.env.NEXT_PUBLIC_OPEN_API_KEY
                       })
                       if(response.results.Research_Ideas){
                         setIdeas(response.results.Research_Ideas)
                       }else{
                         toast.error("Can't generate ideas.")
                       }
                    }else{
                        toast.error("Error in Generating Literature Review");
                    }
//     const params = new URLSearchParams();
//     params.set('paper', response.s3_url);
    
//     let names=selectedFiles[0].name;
//     for (let i = 1; i < selectedFiles.length; i++) {
//   //  console.log(selectedFiles[i].name)
//   names+=(","+selectedFiles[i].name)
//     }
    
//      params.set('names',names)
//     const newUrl = `${window.location.pathname}/review?${params.toString()}`;
//     router.push(newUrl)
    }else{
        toast.error("Error occured while uploading File")
    }

  } catch (err) {
    console.error("Upload failed:", err);
  }

  setIsProcessing(false);
  alert(`Processing ${selectedFiles.length} file(s)...`);
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
        <div className="text-center mb-12">
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

        {/* Upload Mode Toggle */}
        {/* <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg border border-slate-200">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setUploadMode('single');
                  setSelectedFiles([]);
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  uploadMode === 'single'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                Single File
              </button>
              <button
                onClick={() => {
                  setUploadMode('multiple');
                  setSelectedFiles([]);
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  uploadMode === 'multiple'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                Multiple Files
              </button>
            </div>
          </div>
        </div> */}

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
              accept=".pdf"
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
                PDF, DOC, DOCX
              </p>
              <p className="text-blue-700 text-sm mt-2">
                Maximum file size: 50MB per file
              </p>
            </div>
          </div>
        </div>
        {
  Ideas&&
  <IdeasGrid ideasData={Ideas}></IdeasGrid>
}
      </div>
    </div>
  );
}