import axios from "axios";


export const getLiteraturPosts = async (data) =>{
    try{
        console.log(data)

        const response=await axios.post('https://api.anushram.in/phase1/papersapi/basepapers',data)
        return response.data;
    }
    catch(err){
        console.log(err);
        return err.message;
    }
}