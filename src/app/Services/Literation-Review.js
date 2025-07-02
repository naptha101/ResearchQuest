import axios from "axios";


export const getLiteraturPosts = async (data) =>{
    try{
        console.log(data)

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

export const paperReviewAnalysis=async(data)=>{
try{
const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase1/titlesapi/LR_of_papers_by_papertitle",{papers:data,api_key:process.env.NEXT_PUBLIC_OPEN_API_KEY})
return response.data

}
catch(err){
    console.log(err);
    return err.message;
}


}
export const generateAdvanceTitles=async(data)=>{
try{
        const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase1/titlesapi/proposals_of_titles",data)
        
        return response
    
}
catch(err){
    console.log(err);
    return err.message;
    }
}