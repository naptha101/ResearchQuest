import axios from "axios";
export const createFolder=async(data)=>{
    try{
       // console.log(data)
        const res=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"uploadDocxPDF/create_folder_for_user",data)
console.log(res);
        return res.data
    }
    catch(err){
        console.log(err);
        return err.message
    }

}
export const uploadFile=async(data)=>{
    try{
        console.log(data)
        const res=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"uploadDocxPDF/upload_to_s3",data)
        console.log(res);
        return res.data
    }
    catch(err){
        console.log(err);
        return err.message
    }
}

export const generateTitle=async(data)=>{
try{
const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+'phase2/reviews/LRgeneration/title_extract',{
    urlLR:data,
    openapikey:process.env.NEXT_PUBLIC_OPEN_API_KEY
})
//console.log(response)
return response.data
}
catch(err){
    console.log(err)
    return err.message
}
}
export const generateContext=async(data)=>{
    try{
        const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase2/reviews/Graphrag/graphrag_paper",{
            urlLR:data
        })
  //console.log(response)
  return response.data
    }
    catch(err){
        console.log(err);
        return err.message
    }
}
export const generateCitation=async(data)=>{
    console.log(data)
    try{
 const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase2/citation/pdf_details",{
    pdf: data,
    openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY
})
 //console.log(response)

 if(response.data.results){
 const finalResponse=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase2/citation/cited_papers",{
    citation_format : "APA",
       final_json : response.data.results,
    openapikey: process.env.NEXT_PUBLIC_OPEN_API_KEY
 })
//console.log(finalResponse)
 return finalResponse.data;
}
else{
    return "Error Generating Citation"
}

    }
    catch(err){
console.log(err)
return err.message
    }
}
export const finalReview=async(data)=>{
    try{
       // console.log(data)
const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase2/reviews/LRgeneration/lr_json",data);
console.log(response.data)
return response.data  

return 
    }
    catch(err){
        console.log(err);
        return err.message
    }
}
