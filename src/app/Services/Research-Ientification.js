import axios from "axios"


export const handelResearchAresEnquiry=async(data)=>{
try{

    const response=await axios.post('https://api.stuintern.in/v1/api/researchquest/research-identification',data,{
        withCredentials:true
    })
    console.log(response.data)
    return response.data

    


}
catch(err){
    console.log(err)
    return err.message
}



}