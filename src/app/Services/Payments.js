import axios from "axios"

export const getPayments=async()=>{
    const response=await axios.get(process.env.NEXT_PUBLIC_API+'order/user',{
        withCredentials:true
    })
    return response
}