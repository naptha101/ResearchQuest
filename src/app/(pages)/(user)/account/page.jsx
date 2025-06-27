"use client";

import { useAuth } from '@/app/Context/UserAuth';
import { AuthenticateProfile } from '@/app/Services/Auth';
import { getPayments } from '@/app/Services/Payments';
import { DollarSign, Mail, MapPin, Phone, User, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AccountContent = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const searchParams=useSearchParams()
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [payments,setPayments]=useState([]);
const [selectedTab,setTab]=useState("account")
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
    const fetchPayments = async () =>{
      try{
        const response=await getPayments()
        if(response.data){
          console.log(response)
          setPayments(response.data)
        }
      }
      catch(err){
        console.error(err)

      }
    }


       fetchPayments()
    fetchUser();

   
  }, [user, setUser, router]);


  useEffect(()=>{

      const payment= searchParams.get("payment")
      const status=searchParams.get("success")
     if(payment){
      if(payment&&status){
        toast.success("Payment is Successfull")
        }else{
          toast.error("Payment is Failed")
        }
      }else if(status===false){
                  toast.error("Payment is Failed")

      }

  },[])



  const uniqueInterests = Array.isArray(profile.interests)
    ? [...new Set(profile.interests)]
    : [];


     const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    email: "",
    contact: "",
    shippingAddress: "",
    redirectUrl: "http://localhost:4200/account",
     productName: "AI Features",
        productDescription: "produst Description",
        productPrice: 0,
        productDiscount: 0,
        productQuantity: 1
  });

  const toggleModal = () => setShowModal(!showModal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   if(user){
      console.log(user)
const data={...formData,userId:user._id,productPrice:formData.productPrice*100};
    // Convert to query string
    const queryString = new URLSearchParams(data).toString();
    const thirdPartyUrl = `https://anushram.com/payment/checkout?${queryString}`;
    
  // Redirect to the third-party URL
    window.location.href = thirdPartyUrl;
    toggleModal();
   }
  };


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
               Transactions Account
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
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-between">
                         <div className='w-fit flex gap-2 item-center'>
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
                          <button onClick={()=>setShowModal(!showModal)} className="bg-orange-50 cursor-pointer hover:scale-105 float-end border gap-4 flex justify-between items-center border-orange-200 rounded-xl px-4 py-2">
                              <p className="text-orange-800 font-semibold text-xl">Add Tokens</p>
                              <p className="text-orange-600 text-center mb-2 font-bold text-3xl">+</p>
                            </button>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Grid */}
                     <div className='w-full shadow-2xl  flex items-start justify-around rounded-2xl bg-white my-3'>
     <button onClick={()=>setTab('account')} className={'text-xl py-2 rounded-2xl text-bold w-full '+(selectedTab==='account'?'bg-orange-400 text-white':'')}>

    Account Transactions
     </button>
     
     <button onClick={()=>setTab('payment')} className={'text-xl py-2 rounded-2xl text-bold w-full '+(selectedTab==='payment'?'bg-orange-400 text-white':'')}>
  Payment Transaction
     </button>          

              </div>

                <div className="grid lg:grid-cols-3 gap-8">
          
          
                {selectedTab==='account'&&<div className="lg:col-span-3 space-y-8">
                 

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
                  </div>}
                  {
                    selectedTab==='payment'&&
                    <div className="lg:col-span-3 space-y-8">
                 

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
      <h3 className="text-2xl font-bold text-green-900">Payment History</h3>
  <p className='bg-orange-200 py-2 px-4 rounded-2xl text-red-600'>
  Total Transactions: 
  <span className='text-amber-700 mx-2 font-bold '>
    {payments.count}

  </span>
  </p>

    </div>

    <div className="space-y-6">
      {payments?.orders?.map((order, index) => (
        <div key={index} className="bg-white rounded-xl border border-green-200/70 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-green-200/70 bg-green-50/50 flex justify-between items-center">
            <h4 className="text-green-800 font-semibold">#{order?.razorpayOrderId} – {order?.product.name}</h4>
            <div className="text-sm text-green-600">{new Date(order?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div className="px-6 py-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Customer</span>
              <span className="text-green-900">{order?.user?.fullName} ({order?.user?.email})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Amount Paid</span>
              <span className="text-green-900 font-bold">
                ₹{(order?.amount_paid / 100).toFixed(2)} {order?.currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Payment Method</span>
              <span className="text-green-900 capitalize">{order?.user?.paymentMethod}</span>
            </div>
               <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Payment RefNo</span>
              <span 
              
              className="text-green-900 capitalize">{order?.refNo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Status</span>
              <span className={`font-bold ${order.status === 'captured' ? 'text-green-600' : 'text-orange-600'}`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-green-700 font-medium">Shipping Address</span>
              <span className="text-green-900 text-right">{order?.user?.shippingAddress}</span>
            </div>
            <div className="text-sm text-green-700 italic pt-2">{order?.product?.description}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
                    )}
                  </div>
                  }

                  {/* Right Column - Interests */}
                 
                </div>
              </div>
            </div>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>


 {showModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-orange-900/10 to-black/30 backdrop-blur-xl"></div>

      {/* Modal Container */}
      <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-md mx-4 border border-white/20 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-transparent to-orange-100/60 pointer-events-none"></div>

        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent">
                  User Details
                </h2>
              </div>
              <p className="text-gray-600 text-sm font-medium ml-12">
                Complete your information to continue
              </p>
            </div>

            <button
              onClick={toggleModal}
              className="group p-2 hover:bg-orange-100 rounded-full transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 group-focus-within:text-orange-600 transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-orange-400 rounded-2xl bg-white/80 backdrop-blur-sm placeholder-gray-400 text-gray-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:shadow-lg hover:border-orange-300"
                required
              />
            </div>

            {/* Email */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 group-focus-within:text-orange-600 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-orange-400 rounded-2xl bg-white/80 backdrop-blur-sm placeholder-gray-400 text-gray-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:shadow-lg hover:border-orange-300"
                required
              />
            </div>

            {/* Contact */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 group-focus-within:text-orange-600 transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-orange-400 rounded-2xl bg-white/80 backdrop-blur-sm placeholder-gray-400 text-gray-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:shadow-lg hover:border-orange-300"
                required
              />
            </div>

            {/* Shipping Address */}
            <div className="group relative">
              <div className="absolute left-4 top-6 text-orange-400 group-focus-within:text-orange-600 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <textarea
                name="shippingAddress"
                placeholder="Shipping Address"
                rows={3}
                value={formData.shippingAddress}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-orange-400 rounded-2xl bg-white/80 backdrop-blur-sm placeholder-gray-400 text-gray-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:shadow-lg hover:border-orange-300 resize-none"
                required
              />
            </div>

            {/* Amount */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 group-focus-within:text-orange-600 transition-colors">
                <DollarSign className="w-5 h-5" />
              </div>
              <input
                type="number"
                name="productPrice"
                placeholder="Amount"
                value={formData.productPrice}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-orange-400 rounded-2xl bg-white/80 backdrop-blur-sm placeholder-gray-400 text-gray-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:shadow-lg hover:border-orange-300"
                required
              />
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                onClick={handleSubmit}
                className="group w-full relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  Submit Information
                  <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom border gradient */}
      </div>
    </div>
      )}

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
  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-amber-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <div className="absolute inset-2 w-16 h-16 border-2 border-orange-300/50 border-b-orange-400 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
      </div>
    </div>
  );
const Page = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AccountContent />
    </Suspense>
  )
}

export default Page;
