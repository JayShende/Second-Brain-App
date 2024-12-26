import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

export const usePublic=(shareLink?:string)=>{
    const [content,setContent]=useState({});
    console.log(BACKEND_URL+"api/v1/brain/share/"+shareLink);
    async function FunCall()
    {
        const response=await axios({
            method:"get",
            url:BACKEND_URL+"api/v1/brain/share/"+shareLink,
            headers:{
                authorization:localStorage.getItem("token")
              }
        })
        console.log("Hello");
        console.log(response.data);
        setContent(response.data);
    }
    console.log(content);
    function test()
    {
        console.log("test2")
    }

    useEffect(()=>{
        console.log("test")
        const interval=setInterval(()=>{
            test()
        },1*1000)

        return()=>{
            clearInterval(interval);
        }
    },[])

    return content;
}