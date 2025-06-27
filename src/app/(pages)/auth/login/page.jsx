'use client';
import { useAuth } from '@/app/Context/UserAuth';
import { AuthenticateProfile, handleLogin, handleRegister } from '@/app/Services/Auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
  const [selectedTab, setSelected] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const router=useRouter()
  const {user,setUser}=useAuth()
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    highestQualification: '',
    specialization: '',
    careerGoals: '',
    interests: []
  });

  const interestOptions = [
    'Technology',
    'Business',
    'Science',
    'Arts',
    'Health',
    'Engineering',
    'Mathematics',
    'Social Sciences',
    'Education',
    'Sports'
  ];
  useEffect(()=>{
if(user){
    router.push('/')
}
  },[])

const handleLoginSubmit= async(e)=>{
    e.preventDefault();
   const response= await handleLogin(loginData)
if(response.data){
   // console.log(response.data);
    const res=await AuthenticateProfile()
    console.log(res)
    setUser(res.data)
    toast.success("Login Succesfull!")
     await AuthenticateProfile()
    router.push('/')
}else{
    toast.error("Invalid Credentials")
}
}
const handleRegisterSubmit= async(e)=>{
      e.preventDefault();
   const response= await handleRegister(registerData)
if(response.data){
    //console.log(response.data);
    toast.success("Register Succesfull!")
    router.push('/')
}else{
    toast.error("Invalid Credentials")
}
}

  const handleInterestChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
   // console.log(selectedOptions)
  for(let i of selectedOptions){
    if(!registerData.interests.includes(i)){
registerData.interests.push(i)}
else{
 registerData.interests=registerData.interests.filter((j)=>{
    if(j.toLowerCase()==i.toLowerCase()){return false;}
    return true;
 })
}
}


setRegisterData(registerData)
 
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-orange-100">
        {/* Tab Buttons */}
        <div className="flex mb-1">
          <button
            onClick={() => setSelected('login')}
            className={`w-1/2 py-3 rounded-t-lg font-semibold transition-all duration-300 ${
              selectedTab === 'login' 
                ? 'bg-orange-500 text-white shadow-inner' 
                : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setSelected('register')}
            className={`w-1/2 py-3 rounded-t-lg font-semibold transition-all duration-300 ${
              selectedTab === 'register' 
                ? 'bg-orange-500 text-white shadow-inner' 
                : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
            }`}
          >
            Register
          </button>
        </div>

        <div className='bg-orange-500 h-1 w-full mb-6 rounded-full'></div>

        <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
          {selectedTab === 'login' ? 'Welcome Back' : 'Join Our Community'}
        </h2>

        {/* Form */}
        <form onSubmit={(selectedTab==='login'?handleLoginSubmit:handleRegisterSubmit)} className="space-y-6">
          {selectedTab === 'register' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
                <select
                  value={registerData.highestQualification}
                  onChange={(e) => setRegisterData({ ...registerData, highestQualification: e.target.value })}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                >
                  <option value="">Select your highest qualification</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's">Bachelor's Degree</option>
                  <option value="Master's">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  placeholder="Computer Science, Business, etc."
                  value={registerData.specialization}
                  onChange={(e) => setRegisterData({ ...registerData, specialization: e.target.value })}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Career Goals</label>
                <textarea
                  placeholder="Describe your career aspirations"
                  value={registerData.careerGoals}
                  onChange={(e) => setRegisterData({ ...registerData, careerGoals: e.target.value })}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests (Select multiple)</label>
                <select
                  multiple
                  value={registerData.interests}
                  onChange={handleInterestChange}
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition h-24"
                >
                  {interestOptions.map((interest) => (
                    <option key={interest} value={interest}>{interest}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
                {registerData.interests.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-700">Selected: </span>
                    <span className="text-sm text-orange-600">
                      {registerData.interests.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={selectedTab === 'login' ? loginData.email : registerData.email}
              onChange={(e) =>
                selectedTab === 'login'
                  ? setLoginData({ ...loginData, email: e.target.value })
                  : setRegisterData({ ...registerData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-orange-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={selectedTab === 'login' ? loginData.password : registerData.password}
              onChange={(e) =>
                selectedTab === 'login'
                  ? setLoginData({ ...loginData, password: e.target.value })
                  : setRegisterData({ ...registerData, password: e.target.value })
              }
              className="w-full px-4 py-2 border border-orange-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          {selectedTab === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
              {registerData.password && registerData.confirmPassword && registerData.password !== registerData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords don't match!</p>
              )}
            </div>
          )}

          {selectedTab === 'login' && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-orange-500 hover:underline font-medium">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {selectedTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          {selectedTab === 'login' ? (
            <>
              New to our platform?{' '}
              <button
                onClick={() => setSelected('register')}
                className="text-orange-600 font-medium hover:underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setSelected('login')}
                className="text-orange-600 font-medium hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Page;