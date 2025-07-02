"use client"
import { useTitle } from '@/app/Context/TitleContext'
import React, { useEffect } from 'react'

const page = () => {

    const {papers,setPapers}=useTitle()
    useEffect(()=>{
  console.log(papers)
    },[]

)
  return (
    <div>page</div>
  )
}

export default page