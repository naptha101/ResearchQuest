const { default: axios } = require("axios")

export const GenerateIdea=async(data)=>{
    try{
        const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase3/ResearchIdea/gen_research_ideas",data)
    return response.data
    }
    catch(err){
        console.log(err)
        
        return err.message

    }
}
export const generateFlowChart=async(data)=>{
    try{
const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase3/ResearchIdea/methodology_flowchart",data)

return response.data
    }
    catch(err){
        console.log(err)
        return err.message
    }
}
export const reviewDocInsight=async(data)=>{
    try{
 const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase3/ResearchIdea/lr_upload",{
    LRdocx:data
 })
return response.data
    }
    catch(err){
       console.log(err)
        
return err.message
    }
}