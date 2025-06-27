"use client";

import { useAuth } from '@/app/Context/UserAuth';
import { AuthenticateProfile } from '@/app/Services/Auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        if (!user) {
          const response = await AuthenticateProfile();
          if (response?.data) {
            setUser(response.data);
            setProfile(response.data);
          } else {
            toast.error('User not authenticated');
            router.push('/');
          }
        } else {
          setProfile(user);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error in Fetching User Details");
      } finally {
        setIsLoading(false);
        setTimeout(() => setIsVisible(true), 200);
      }
    };

    fetchUser();
  }, [user, setUser, router]);

  const uniqueInterests = Array.isArray(profile.interests)
    ? [...new Set(profile.interests)]
    : [];

  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-amber-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <div className="absolute inset-2 w-16 h-16 border-2 border-orange-300/50 border-b-orange-400 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-200/20 to-amber-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-orange-300/40 rounded rotate-45 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-amber-300/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-32 left-20 w-5 h-5 bg-orange-400/40 rotate-12 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-amber-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
      </div>

      <div className="relative mt-16 z-10 min-h-screen">
        {/* Header */}
        <div className="pt-8 pb-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent mb-2">
                Profile Dashboard
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>

        {profile?.id ? (
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-6xl mx-auto">
              <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                
                {/* Main Profile Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-orange-200/50 shadow-2xl hover:shadow-orange-300/30 transition-all duration-500 mb-8 overflow-hidden">
                  {/* Profile Header */}
                  <div className="relative p-6 sm:p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-2xl hover:scale-105 transition-all duration-500 border-4 border-orange-200/50">
                          <span className="drop-shadow-lg">
                            {profile.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                      </div>

                      {/* Basic Info */}
                      <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-900 mb-3">
                          {profile.name}
                        </h2>
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                          </div>
                          <span className="text-orange-700 text-lg">{profile.email}</span>
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
                            <div className="text-orange-800 font-semibold text-sm">Member Since</div>
                            <div className="text-orange-600 text-xs">
                              {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                            </div>
                          </div>
                          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                            <div className="text-amber-800 font-semibold text-sm">Interests</div>
                            <div className="text-amber-600 text-xs">{uniqueInterests.length} Topics</div>
                          </div>
                          {profile.tokenAccount && (
                            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                              <div className="text-green-800 font-semibold text-sm">Token Balance</div>
                              <div className="text-green-600 text-xs">{profile.tokenAccount.balance} Tokens</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Education Section */}
                    <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-200/50 shadow-lg p-6 sm:p-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-orange-900">Education</h3>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-6 border border-orange-200 hover:scale-105 hover:shadow-lg transition-all duration-300">
                            <div className="text-orange-600 text-sm font-medium mb-2">Highest Qualification</div>
                            <div className="text-orange-900 text-xl font-bold">{profile.highestQualification}</div>
                          </div>
                          <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-6 border border-amber-200 hover:scale-105 hover:shadow-lg transition-all duration-300">
                            <div className="text-amber-600 text-sm font-medium mb-2">Specialization</div>
                            <div className="text-amber-900 text-xl font-bold">{profile.specialization}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Career Goals Section */}
                    <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-200/50 shadow-lg p-6 sm:p-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-3 bg-gradient-to-br from-orange-600 to-red-500 rounded-xl shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-orange-900">Career Goals</h3>
                        </div>
                        
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                          <div className="relative">
                            <svg className="absolute top-0 left-0 w-8 h-8 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.424-.687-.92-.912-1.405-.225-.485-.225-1.025 0-1.51.225-.485.586-.98.912-1.405C10.962 8.62 11.192 7.88 11.192 7s-.23-1.618-.69-2.217c-.326-.424-.687-.92-.912-1.405-.225-.485-.225-1.025 0-1.51C9.815 1.368 10.177.872 10.503.448 10.962-.151 11.192-.889 11.192-1.768"/>
                            </svg>
                            <p className="text-orange-800 text-lg leading-relaxed pl-10 italic">
                              "{profile.careerGoals}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Token Account Section */}
                    {profile.tokenAccount && (
                      <div className={`transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-200/50 shadow-lg p-6 sm:p-8">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-green-900">Token Account</h3>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl p-6 border border-green-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-green-600 text-sm font-medium mb-1">Current Balance</div>
                                  <div className="text-green-900 text-3xl font-bold">{profile.tokenAccount.balance} Tokens</div>
                                </div>
                                <div className="bg-green-500/10 p-3 rounded-full">
                                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-xl border border-green-200/70 shadow-sm overflow-hidden">
                              <div className="px-6 py-4 border-b border-green-200/70 bg-green-50/50">
                                <h4 className="text-green-800 font-semibold">Transaction History</h4>
                              </div>
                              <div className="divide-y divide-green-200/50">
                                {profile.tokenAccount.transactions.map((txn, index) => (
                                  <div key={index} className="px-6 py-4 hover:bg-green-50/30 transition-colors duration-200">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <div className={`w-2 h-2 rounded-full ${txn.type === 'credit' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                          <span className="text-sm font-medium text-green-900 capitalize">{txn.type}</span>
                                        </div>
                                        <p className="text-sm text-green-700">{txn.description}</p>
                                      </div>
                                      <div className="text-right">
                                        <div className={`text-sm font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-orange-600'}`}>
                                          {txn.type === 'credit' ? '+' : '-'}{txn.amount}
                                        </div>
                                        <div className="text-xs text-green-500 mt-1">
                                          {new Date(txn.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Interests */}
                  <div className="space-y-8">
                    <div className={`transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-200/50 shadow-lg p-6 sticky top-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-orange-900">Interests</h3>
                        </div>
                        
                        <div className="space-y-3">
                          {uniqueInterests.map((interest, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-xl px-4 py-3 hover:scale-105 hover:from-orange-200 hover:to-amber-200 hover:shadow-md transition-all duration-300 cursor-default group"
                              style={{
                                animationDelay: `${800 + index * 100}ms`,
                                animation: isVisible ? 'slideInRight 0.6s ease-out forwards' : 'none'
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full group-hover:scale-150 transition-all duration-300"></div>
                                <span className="text-orange-800 font-medium">{interest}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Activity Timeline */}
                        <div className="mt-8 pt-6 border-t border-orange-200">
                          <h4 className="text-orange-900 font-semibold mb-4">Activity</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-orange-700">Profile updated</span>
                              <span className="text-orange-500 ml-auto">
                                {new Date(profile.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                              <span className="text-orange-700">Account created</span>
                              <span className="text-orange-500 ml-auto">
                                {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Page;