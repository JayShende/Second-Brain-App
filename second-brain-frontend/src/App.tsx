import axios from "axios";
import { DashBoard } from "./pages/Dashboard";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { BACKEND_URL } from "./config";
import { SharePublic } from "./pages/SharePublic";
function App()
{ 
  const [auth,setAuth]=useState(false);
  async function verify()
  {
    const res=await axios({
      method:"post",
      url:BACKEND_URL+"api/v1/verify",
      headers:{
        authorization:localStorage.getItem("token")
      }
    })
     console.log(res.data);
    setAuth(res.data.status);
  }
  // verify();
 
  console.log(auth);
  return(
    <div className="w-screen h-screen">
      <BrowserRouter>
        <Routes>
          
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signin" element={ <Signin/>}/>
          <Route path="/dashboard" element={  <DashBoard/>}/>
          <Route path="" element={<DefaultRouter/>}/>
          <Route path="*" element={auth? <DashBoard/> :<Signup/>}/>
          <Route path="/share/:shareLink" element={<SharePublic/>}/>

        </Routes>
      </BrowserRouter>

    </div>
  )
}

const DefaultRouter=()=>{
  return(
    <div className="flex justify-center items-center w-full h-full bg-[#f9fbfc]">
      <div className="min-w-[250px] h-[300px]">
        <span className="font-[poppins] text-[50px] font-bold text-red-600">404 Source Not Found</span>
      </div>
    </div>
  )
}

export default App;