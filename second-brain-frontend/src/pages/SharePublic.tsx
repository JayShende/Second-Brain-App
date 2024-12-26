import { useState } from "react";
import "../App.css";
import { CardComponenet } from "../components/ui/card";
import { SideBar } from "../components/ui/sidebar";
import { useParams } from "react-router-dom";
import { usePublic } from "../hooks/useContentPublic";



export const SharePublic=()=> {
 
  const [share,setShare]=useState(false);
  const {shareLink}=useParams();
  const content=usePublic(shareLink);
//   console.log(shareLink);
// console.log("hello");
// console.log(content);
  return (
    <div className="w-screen h-screen flex">

<SideBar shareDelete={false}/>

      <div className="w-full ml-80">
        <div className="bg-[#f9fbfc] w-full min-h-screen m-0 p-0">
        
        <div className="ml-10 flex flex-wrap gap-10 items-start pt-20">
        {JSON.stringify(content)};
          {content.map(({type, link, title,_id}) => <CardComponenet 
            type={type}
            link={link}
            title={title}
            contnetId={_id}
            shareDelete={false}
        />)}
        {/* {JSON.stringify(content)} */}
          </div>
        </div>
      </div>
    </div>
  );
}

