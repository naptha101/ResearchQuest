import axios from "axios"




export const handleLogin=async (data)=>{
    try{
        const response= await axios.post(process.env.NEXT_PUBLIC_API+'user/login',data,{
            withCredentials:true
        })
        //console.log(response)
        return response
    }catch(err){
        console.log(err)
        return err.message
    }
}
export const handleRegister=async (data)=>{
    try{
        console.log(data)
        const response= await axios.post(process.env.NEXT_PUBLIC_API+'user/register',data)
     //   console.log(response)
        return response
    }catch(err){
        console.log(err)
        return err.message
    }
}
export const AuthenticateProfile=async ()=>{
    try{
        const response= await axios.get(process.env.NEXT_PUBLIC_API+'user/profile',{
            withCredentials:true
            })
           
      
            return response
            }catch(err){
                console.log(err)
                return err.message
                }
}
export const handleLogoutService=async ()=>
    {
        try{
            const response= await axios.post(process.env.NEXT_PUBLIC_API+'user/logout',{},{
                withCredentials:true
            })
            return response
        }
        catch(err){
            console.log(err)
            return err.message
        }


    }
    