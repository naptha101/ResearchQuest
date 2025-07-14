"use client"
import ResearchInputComponent from '@/app/Component/features/title-generation/GenerateTitle'
import { useAuth } from '@/app/Context/UserAuth'
import { AuthenticateProfile } from '@/app/Services/Auth'
import { getPreviousResearch } from '@/app/Services/Literation-Review'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
  const { user, setUser } = useAuth()
    const [loading, setLoading] = useState(true)
    const [showInsufficientTokenPopup, setShowInsufficientTokenPopup] = useState(false)
  const router=useRouter()
 useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const res = await AuthenticateProfile()
    //    console.log(res)
        
        if (!res.data) {
          router.push('/auth/login')
          return
        }

        setUser(res.data)

        if (!res.data.tokenAccount || res.data.tokenAccount.balance <= 1) {
           setShowInsufficientTokenPopup(true)
        }
      } catch (err) {
        console.log(err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }
    const checkHistory=async()=>{
      try{
        const res=await getPreviousResearch();
     //   console.group(res)
      }

      catch(err){
        console.log(err)

      }
    }

checkHistory()
    checkUserAccess()
  }, [])



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full mb-4 animate-pulse">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Verifying Access...
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='min-h-screen  py-3 ' >
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
      <ResearchInputComponent></ResearchInputComponent>


    </div>
  )
}

export default page