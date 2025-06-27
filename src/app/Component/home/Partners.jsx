"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const Partners = () => {
  const [isVisible, setIsVisible] = useState(false);

  const partners = [
    { name: "StuValley", logo: "/images/home/stuvalley.webp" },
    { name: "StuIntern", logo: "/images/home/stuintern.webp" },
    { name: "Sudakshta", logo: "/images/home/sudakshta_logo.webp" },
    { name: "Prayug", logo: "/images/home/prayug_logo.webp" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative px-6 py-20 bg-gradient-to-br from-orange-50 via-amber-25 to-yellow-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200/50 mb-6">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-orange-700">Our Partners</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-4">
            Trusted by Leading
            <span className="block bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Institutions
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Partnering with innovative organizations to drive excellence and create meaningful impact
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className={`group relative transition-all duration-700 transform ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ 
                transitionDelay: isVisible ? `${index * 150}ms` : '0ms' 
              }}
            >
              {/* Card */}
              <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 h-32 flex items-center justify-center border border-white/40 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/90">
                {/* Hover gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div className="absolute inset-0.5 rounded-2xl bg-white/90 group-hover:bg-white transition-colors duration-500"></div>
                
                {/* Logo */}
                <div className="relative z-10">
                  <Image 
                    src={partner.logo} 
                    height={80} 
                    width={120} 
                    alt={`${partner.name} logo`} 
                    className="max-h-12 md:max-h-16 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" 
                  />
                </div>

                {/* Floating particles effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-2 right-2 w-1 h-1 bg-orange-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-3 left-3 w-1 h-1 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>

              {/* Partner name tooltip */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
                {partner.name}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 text-gray-600 text-sm">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full border-2 border-white shadow-md"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
            <span className="font-medium">Join our growing network of partners</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;