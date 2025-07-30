"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { deepSearch, paperChoose } from "@/app/Services/Methodology";
import { Folder, Paperclip } from "lucide-react";
import PaperShow from "@/app/Component/features/Research-Idea-generation/PaperShow";
import { createFolder } from "@/app/Services/Literature_Review";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/Context/UserAuth";
import { AuthenticateProfile } from "@/app/Services/Auth";

// --- Sub-Component: Themed Input Field for Light Mode ---
const IconInput = ({ icon, ...props }) => {
  const InputComponent = props.type === "textarea" ? "textarea" : "input";
  return (
    <div className="relative flex flex-col w-full">
      <label className="mb-2 text-sm font-medium text-slate-700">{props.label}</label>
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          {icon}
        </div>
        <InputComponent
          {...props}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
        />
      </div>
    </div>
  );
};

// --- Sub-Component: Loading Indicator for Light Mode ---
const LoadingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="mt-16 flex flex-col items-center justify-center text-center"
  >
    <div className="relative h-20 w-20">
      <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      <div className="absolute inset-4 rounded-full border-4 border-orange-500 border-t-transparent animate-spin [animation-delay:200ms]"></div>
    </div>
    <h3 className="mt-6 text-xl font-semibold text-slate-800">Our AI is diving deep...</h3>
    <p className="mt-2 max-w-sm text-slate-600">Scanning thousands of papers to find the most relevant research just for you.</p>
  </motion.div>
);

// --- Main Component: ResearchSearchForm ---
export default function ResearchSearchForm() {
  const [formData, setFormData] = useState({
    subject: "",
    specialization: "",
    database: "arxiv",
    keywords: "",
    api_key: process.env.NEXT_PUBLIC_OPEN_API_KEY,
  });
  const [papers, setPapers] = useState(null);
  const [loading, setLoading] = useState(false);
   const [noPaper,setNoPaper]=useState(false)
   const {user,setUser}=useAuth()
  // (All your handler functions: handleChange, handleSearch, handleChoosePapers remain exactly the same)
const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
const handleSearch = async () => {
    setLoading(true);
    setNoPaper(false)
    setPapers(null); // Clear previous results
    try {
      const searchData = {
          ...formData,
          keywords: formData.keywords.split(',').map(k => k.trim())
      };
      const response = await deepSearch(searchData);
      if (response.papers) {
       // await handleChoosePapers(response.papers);
       console.log(response)
       setPapers(response)
      setLoading(false);

      } else {
        toast.error("Open access papers are not available please follow up with other two processes.");
        setNoPaper(true)
     }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during the search.");
      setLoading(false);
    }
        setLoading(false);

  };
const router=useRouter()
  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const res = await AuthenticateProfile()
       // console.log(res)
        
        if (!res.data) {
          router.push('/auth/login')
          return
        }

        setUser(res.data)

        if (!res.data.tokenAccount || res.data.tokenAccount.balance <= 1) {
          // setShowInsufficientTokenPopup(true)
        }
      } catch (err) {
        console.log(err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkUserAccess()
  }, [])


  const handleCreateFolder=async (type)=>{
    setLoading(true)
    try{
        const res=await createFolder({user_id:user._id,
            bucket_name:process.env.NEXT_PUBLIC_BUCKET,
            aws_access_key_id:process.env.NEXT_PUBLIC_AWS_ID,
            aws_secret_access_key:process.env.NEXT_PUBLIC_ACCESS_KEY
        })
      //  console.log(res)
        if(res){
           type==='reviews'?router.push('/research-idea-generator/reviews'):router.push('/research-idea-generator/papers')
        toast.success("Your folder is created successfully")
        }else{
        toast.error("Error in creating bucket")

        }
    }
    catch(err){
        console.log(err)
        toast.error("Error in creating bucket")
    }
    setLoading(false)
  }

const handleLiteratureReview=async(type)=>{
  try{
await handleCreateFolder(type)

  }
  catch(err){
    console.error(err)
    toast.error("Error in Literature Review ")
  }
}



  return (
    <div className="min-h-screen w-full bg-slate-50 py-16 sm:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* --- Hero Section --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Discover <span className="text-orange-500">Research Idea</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our advanced AI platform simplifies your research process, bringing the world's knowledge right to your fingertips.
          </p>
        </motion.div>

        {/* --- Main Card with Ambient Glow --- */}
        <div className="relative">
          {/* This div creates the soft, ambient glow that bleeds from behind the card */}
          <div className="absolute -z-10 -inset-4 bg-gradient-to-br from-orange-200 via-blue-100 to-transparent rounded-3xl opacity-25 blur-2xl"></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={clsx(
              "relative rounded-2xl border border-slate-200 bg-white/80 p-6 sm:p-8 shadow-xl backdrop-blur-sm",
              loading && "cursor-progress"
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <IconInput label="Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Computer Science" icon={<IconBook />} />
              <IconInput label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Machine Learning" icon={<IconSparkles />} />
            </div>
            <div className="space-y-6 mb-8">
              <IconInput label="Keywords" name="keywords" value={formData.keywords} onChange={handleChange} placeholder="neural, network, ai" icon={<IconKey />} />
              {/* <IconInput label="Your Research Idea" name="researchIdea" type="textarea" value={formData.researchIdea} onChange={handleChange} placeholder="Briefly describe your research idea..." icon={<IconLightBulb />} /> */}
            </div>

            <div className="flex justify-center">
              <button
                disabled={loading}
                onClick={handleSearch}
                className="group relative flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-orange-500/40 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                {loading ? "Searching..." : "Deep Search"}
              </button>
            </div>
            <div className="flex mt-4 gap-5 justify-center">
               <div
               onClick={()=>{
                handleLiteratureReview('reviews')
               }}
                className="group relative flex w-full max-w-xs   items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-300 to-amber-200 px-8 py-8 text-lg font-semibold shadow-lg transition-all text-black duration-300 hover:shadow-orange-500/40 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
             <Folder className="h-6 w-6"></Folder>
                Upload your Literature Reviews
              </div>
                <div
                 onClick={()=>{
                handleLiteratureReview('papers')
               }}
                className="group relative flex w-full max-w-xs   items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-300 to-amber-200 px-8 py-8 text-lg font-semibold shadow-lg transition-all text-black duration-300 hover:shadow-orange-500/40 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
               <Paperclip className="h-6 w-6"></Paperclip>
                Upload your research paper
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Loading & Results Area --- */}
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingIndicator key="loader" />
          ) : papers ? (
             
          <div className="mt-16 animate-fade-in">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Research Results</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
            </div>
            <PaperShow data={papers}  setData={setPapers}  />
          </div>
        
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Icon Components (can be in a separate file) ---
const IconBook = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 01-1.414 1.414L12 6.414l-2.293 2.293a1 1 0 01-1.414-1.414L10 5m0 14l2.293-2.293a1 1 0 011.414 1.414L12 17.586l2.293-2.293a1 1 0 011.414 1.414L14 19m-4-5l2.293 2.293a1 1 0 01-1.414 1.414L10 13.414l-2.293 2.293a1 1 0 01-1.414-1.414L8 12" /></svg>;
const IconKey = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" /></svg>;
const IconLightBulb = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;