"use client";


import { useAuth } from "@/app/Context/UserAuth";
import { AuthenticateProfile, handleLogout, handleLogoutService } from "@/app/Services/Auth";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Navbar() {

  const {user,setUser}=useAuth()
  useEffect(()=>{
  const checkAuth=async()=>{
       const res= await AuthenticateProfile()
       //console.log(res)
       if(res.data)setUser(res.data)
        }
checkAuth()

  },[])
const [showDropdown,setDropdown]=useState(false)  
const handleLogout= async ()=>{

const res=await handleLogoutService()
console.log(res)
if(res.data){
  
  setUser(null) 
  toast("User LoggedOut Succesfully")
}
  

}


  return (
    <header className="w-full fixed z-50 bg-orange-50 top-0 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo Section */}
        <div className="flex justify-center items-center space-x-2">
          
            <Image
              className="w-12 h-10 text-white"
             alt="Research Quest"
             height={100}
             width={100}
             src="/images/head_logo.png"
            >
            </Image>
          
          <span className="text-3xl font-bold text-[#1c7ea8]">
            Research Quest
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-black font-medium hover:text-[#1c7ea8]">
            Home
          </Link>
          <Link href="/pricing" className="text-[#1c7ea8] font-medium hover:underline">
            Pricing
          </Link>

{
!user?(
          <Link
            href="/get-access"
            className="bg-[#ff884d] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#f4633a] transition"
          >
            Get Access – Free
          </Link>):
          (
 <div className="relative inline-block">
      <button
        onClick={() => setDropdown(!showDropdown)}
        className="h-fit w-fit p-1 border rounded-full"
      >
        <User className="w-6 h-6 text-orange-500" />
      </button>

      {showDropdown && (
        <div className="absolute z-50 top-10 right-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
          <Link href="/profile" className="block py-2 px-4 hover:bg-gray-100">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left py-2 px-4 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>

          )
}
       </nav>
      </div>
    </header>
  );
}
