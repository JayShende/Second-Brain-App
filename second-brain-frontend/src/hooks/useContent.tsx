import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

export const useContent=()=>{
    const [contents,setContents]=useState([]);

    async function funCall()
    {
        const response=await axios({
            method:"get",
            url:BACKEND_URL+"api/v1/content",
            headers:{
                authorization:localStorage.getItem("token")
              }
        })
        console.log(response.data);
        setContents(response.data);
    }

    useEffect(()=>{
        funCall();
        let interval=setInterval(()=>{
            funCall()
        },10*1000)

        return()=>{
            clearInterval(interval);
        }
    },[])

    return {contents,funCall};
}