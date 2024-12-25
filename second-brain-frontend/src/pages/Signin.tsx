import { useRef } from "react";
import { Button } from "../components/ui/Button";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signin=()=>{
    const usernameRef=useRef<HTMLInputElement>();
    const passwordRef=useRef<HTMLInputElement>();
    const navigate=useNavigate();
    async function funSignin()
    {
        const username = usernameRef.current?.value;
        console.log(usernameRef.current)
        const password = passwordRef.current?.value;
       const res=await axios({
        method:"post",
        url:BACKEND_URL + "api/v1/signin",
        data:{
            username:username,
            password:password
        }
       })

       const token=res.data.token
       console.log(token);
       localStorage.setItem("token",token);
        console.log(res.data);
        alert("Signed in");
        navigate("/dashboard")
    }
    return(
        <div className="w-full h-full bg-slate-200 flex justify-center items-center">
            <div className="w-[450px] h-[300px] bg-gray-100 rounded-xl shadow-2xl">
                
                <div className="flex justify-center pt-6">
                    <span className="font-[poppins] text-2xl font-medium text-[#5046e4]">Sign In</span>
                </div>
                
                <div className="flex items-center flex-col mt-8">
                <Input placeholder="Email" refernce={usernameRef}/>
                <Input placeholder="password" refernce={passwordRef}/>
                <Button variant="primary" text="Sign In" size="sm" onClick={funSignin}/>
                </div>
            </div>
        </div>
    )
}

interface InputProps{
    placeholder:string;
    refernce:any;
}

function Input(props:InputProps){
    
    return(
        <input type="text" ref={props.refernce} className="w-96 h-10 bg-gray-300 my-3 rounded-md placeholder:text-gray-500 pl-3 font-mono "  placeholder={props.placeholder}/>
    )
}