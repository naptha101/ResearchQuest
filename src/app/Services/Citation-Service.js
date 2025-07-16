const { default: axios } = require("axios");

export const researchPaperUrl=async(data)=>{
    try{
const response= await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase2/citation/links_details",data);
return response.data;

    }
    catch(err){
        console.log(err);
        return err.message
    }
}
export const finalCitatioGeneration=async(data)=>{
   try{
    //console.log(data)

       const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase2/citation/cited_papers",data)
  //console.log(response)

       return response.data;
   }
    catch(err){
        console.log(err);
        return err.message
    }
}
export const getPdfDetails=async(data)=>{
    try{
        const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase2/citation/pdf_details",data);
        return response.data;
        }
        catch(err){
            console.log(err);
            return err.message
        }

}
export const articleDetails=async (data)=>{
    try{
        const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase2/citation/article_details",data)
        return response.data;

    }
    catch(err){
        console.log(err);
        return err.message
    }
}
