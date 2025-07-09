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