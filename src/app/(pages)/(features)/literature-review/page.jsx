"use client"
import React, { useEffect, useState } from 'react';
import { FileText, BookOpen, ArrowRight, Sparkles, Zap, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/Context/UserAuth';
import { useRouter } from 'next/navigation';
import { AuthenticateProfile } from '@/app/Services/Auth';
import { createFolder } from '@/app/Services/Literature_Review';
import { toast } from 'react-toastify';

export default function Page() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const sections = [
    {
      title: "Single Literature Reviews",
      iconBg: "from-orange-400 to-amber-500",
      heading: "Generated Research Papers",
      subtext: "Transform individual research papers into comprehensive literature reviews with AI-powered analysis",
      icon: FileText,
      gradient: "from-orange-50 to-amber-50",
      borderGradient: "from-orange-200 to-amber-200",
      type:"single",
      hoverGradient: "from-orange-100 to-amber-100",
      accentColor: "text-orange-600",
      features: ["Single paper analysis", "Quick Generation", "Summarized Review"]
    },
    {
      title: "Extended Literature Reviews",
      iconBg: "from-blue-500 to-[#1c7ea8]",
      heading: "Comprehensive Analysis",
      subtext: "Create extensive literature reviews from multiple sources with deep analytical insights",
      icon: BookOpen,
            type:"multiple",
      gradient: "from-purple-50 to-blue-50",
      borderGradient: "from-blue-200 to-[#1c7ea8]",
      hoverGradient: "from-violet-100 to-[#1c7ea8]",
      accentColor: "text-[#1c7ea8]",
      features: ["Multi-paper analysis", "Deep insights", "Consolidated Analysis"]
    },
  ];
    const { user, setUser } = useAuth()
    const router = useRouter()
  
    const [loading, setLoading] = useState(true)
    const [showInsufficientTokenPopup, setShowInsufficientTokenPopup] = useState(false)
  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const res = await AuthenticateProfile()
        console.log(res)
        
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
        console.log(res)
        if(res){
           type==='single'?router.push('/literature-review/single'):router.push('/literature-review/multiple')
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



  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 px-4 md:px-12 relative overflow-hidden">
      {/* Floating background elements */}
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full mb-6 shadow-sm">
            <Sparkles className="w-5 h-5 text-[#1c7ea8]" />
            <span className=" text-[#1c7ea8] font-semibold text-sm">AI-Powered Literature Analysis</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-text-[#1c7ea8] bg-clip-text text-transparent mb-4">
            Research Made Simple
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Transform your research workflow with intelligent literature review generation powered by cutting-edge AI
          </p>
        </div>

        {/* Cards grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <div 
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Category label */}
                <div className="mb-6">
                  <h2 className={`text-xl font-bold ${section.accentColor} mb-2 flex items-center gap-2`}>
                    <Zap className="w-5 h-5" />
                    {section.title}
                  </h2>
                  <div className={`h-1 w-16 bg-gradient-to-r ${section.iconBg} rounded-full`}></div>
                </div>

                {/* Main card */}
                <div className={`
                  relative bg-gradient-to-br ${isHovered ? section.hoverGradient : section.gradient} 
                  border-2 border-transparent bg-clip-padding
                  rounded-3xl shadow-lg hover:shadow-2xl 
                  transition-all duration-500 ease-out
                  p-8 md:p-10
                  transform hover:-translate-y-2 hover:scale-[1.02]
                  ${isHovered ? 'shadow-2xl' : ''}
                `}>
                  {/* Animated border */}
                  <div className={`
                    absolute inset-0 rounded-3xl p-[2px] 
                    bg-gradient-to-r ${section.borderGradient}
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500
                  `}>
                    <div className={`w-full h-full bg-gradient-to-br ${section.gradient} rounded-3xl`}></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`
                      w-20 h-20 mb-6 mx-auto
                      bg-gradient-to-br ${section.iconBg} 
                      rounded-2xl flex items-center justify-center
                      shadow-lg group-hover:shadow-xl
                      transition-all duration-300
                      group-hover:scale-110 group-hover:rotate-3
                    `}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 text-center group-hover:text-slate-900 transition-colors">
                      {section.heading}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-center mb-6 leading-relaxed text-sm md:text-base group-hover:text-slate-700 transition-colors">
                      {section.subtext}
                    </p>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {section.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${section.iconBg}`}></div>
                          <span className="text-slate-700 text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                      <button onClick={()=>{handleCreateFolder(section.type)}} className={`
                        inline-flex items-center gap-2 px-6 py-3 
                        bg-gradient-to-r ${section.iconBg} 
                        text-white font-semibold rounded-xl
                        shadow-lg hover:shadow-xl
                        transition-all duration-300
                        cursor-pointer
                        hover:scale-105 active:scale-95
                        group/btn
                      `}
                      disabled={loading}
                      >
                        <span>Get Started</span>
                        {!loading&&<ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />}
                        {loading&&<Loader2 className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 animate-spin"></Loader2>}
                      </button>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                    <div className={`w-24 h-24 bg-gradient-to-br ${section.iconBg} rounded-full blur-2xl`}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-slate-700 font-medium">Trusted by 10,000+ researchers worldwide</span>
          </div>
        </div>
      </div>
        {showInsufficientTokenPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full text-center overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-700 leading-relaxed text-sm">
                You're logged in, but your account doesn't have enough tokens to access this service.
              </p>
              <button
                onClick={() => {
                  setShowInsufficientTokenPopup(false)
                  router.push('/')
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-200"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}