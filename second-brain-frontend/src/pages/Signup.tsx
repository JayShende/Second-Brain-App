import { useRef } from "react";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";


export const Signup=()=>{

    const usernameRef=useRef<HTMLInputElement>();
    const passwordRef=useRef<HTMLInputElement>();
    const navigate=useNavigate();
    async function funSignup()
    {
        const username = usernameRef.current?.value;
        console.log(usernameRef.current)
        const password = passwordRef.current?.value;
       const res=await axios({
        method:"post",
        url:BACKEND_URL + "api/v1/signup",
        data:{
            username:username,
            password:password
        }
       })
        console.log(res.data);
        alert(res);

        // redirect to the Signup
        navigate("/signin")
    }
    return(
        <div className="w-full h-full bg-slate-200 flex justify-center items-center">
            <div className="w-[450px] h-[300px] bg-gray-100 rounded-xl shadow-2xl">
                
                <div className="flex justify-center pt-6">
                    <span className="font-[poppins] text-2xl font-medium text-[#5046e4]">Sign Up</span>
                </div>
                
                <div className="flex items-center flex-col mt-8">
                <Input placeholder="Email" refrence={usernameRef}/>
                <Input placeholder="password" refrence={passwordRef}/>
                <Button variant="primary" text="Sign Up" size="sm" onClick={funSignup}/>
                </div>
            </div>
        </div>
    )
}

interface InputProps{
    placeholder:string;
    refrence:any;
}

function Input(props:InputProps){
    
    return(
        <input type="text" ref={props.refrence} className="w-96 h-10 bg-gray-300 my-3 rounded-md placeholder:text-gray-500 pl-3 font-mono "  placeholder={props.placeholder}/>
    )
}