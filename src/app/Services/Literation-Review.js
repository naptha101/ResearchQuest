import axios from "axios";



export const getTitle=async (data)=>
    {
        try{
            console.log(data)
            const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_API+"direct_title_generator/title_gen",data)
        
        return response.data
        }
        catch(err){
            console.log(err);
            return err.message;
        }

    }
 export const getLiteraturPosts = async (data) =>{
    try{
       // console.log(data)

        const response=await axios.post(process.env.NEXT_PUBLIC_API+'researchquest/research-title-generation',data,{
            withCredentials:true
        })
        return response.data.data.data;
    }
    catch(err){
        console.log(err);
        return err.message;
    }
}
export const getSimpleLiteraturePosts=async (data)=>{
    try{
        const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+'phase1/papersapi/basepapers_simple_search',data)
    
        return response.data;
    
    }
    catch(err){
        console.log(err);
        return err.message;
    }
}

export const paperReviewAnalysis=async(data,id)=>{
try{
   console.log({papers:data,  tokensToDebit:1,
    description:"Research Title Generation TEST",
  id:id
})
const response=await axios.post(process.env.NEXT_PUBLIC_API+"researchquest/research-title-generation2",{papers:data,  tokensToDebit:1,
    description:"Research Title Generation TEST",
  id:id
},{withCredentials:true})
console.log(response)
return response.data.data

}
catch(err){
    console.log(err);
    return err.message;
}


}
export const generateAdvanceTitles=async(data)=>{
try{
    console.log(data)
        const response=await axios.post(process.env.NEXT_PUBLIC_API+"researchquest/research-title-generation3",data,{
            withCredentials:true
        })
   //  console.log(data)   
        return response
    
}
catch(err){
    console.log(err);
    return err.message;
    }
}
export const generateSimpleTitles=async(data)=>{
    try{
        const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase1/titlesapi/proposals_of_titles_simple_search",data)
//  console.log(response)
        return response.data

    }
    catch(err){
        console.log(err);
        return err.message;
    }
}
export const getPreviousResearch=async(id)=>{
    try{
        const response=await axios.get(process.env.NEXT_PUBLIC_API+"researchquest/research-title-generation/"+id,{
            withCredentials:true
        })
     //console.log(response)
        return response.data
    }
catch(err){
console.log(err)
return err.message
}
    }

