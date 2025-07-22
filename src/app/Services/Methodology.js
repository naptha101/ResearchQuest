import axios from "axios";

export const deepSearch=async(data)=>{
try{
const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_ANU+"phase1/papersapi/basepapers",data)
return response.data

}
catch(err){
    console.log(err);
    return err.message
}
}
export const paperChoose=async(data)=>{
    try{
        const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_API+"methodology_research/generate_gaps_resources",data)
  return response.data
    }
    catch(err){
        console.log(err);
        return err.message
    }
}
export const researchScopeGeneration=async(data)=>{
    try{
const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_API+"methodology_research/generate_scope_objectives",data)
return response.data


    }
    catch(err){
        console.log(err);
        return err.message
    }
}
export const researchDesign=async(data)=>{
    try{
const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_API+"methodology_research/research_design_mapping",data)
return response.data
    }
    catch(err){
        console.log(err);
        return err.message
    }
}
export const statsToolsSuggestions=async(data)=>{
try{
    const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_API+"methodology_research/stats_tools_suggestions",data)

    return response.data

}
catch(err){
console.log(err)
return err.data
}

}

export const getValidationSummary=async(data)=>{
try{
    const response=await axios.post(process.env.NEXT_PUBLIC_OPEN_API+"methodology_research/research_validation_summary",data)

    return response.data

}
catch(err){
console.log(err)
return err.data
}

}

