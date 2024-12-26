import { useState } from "react";
import "../App.css";
import { PlusIcon, ShareIcon } from "../components/icons/Share-icon";
import { Button } from "../components/ui/Button";
import { CardComponenet } from "../components/ui/card";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { SideBar } from "../components/ui/sidebar";
import { useContent } from "../hooks/useContent";
import axios from "axios";
import { BACKEND_URL, LocalUrl } from "../config";

export const DashBoard=()=> {
  const {contents,funCall}=useContent();
  const [modalopen, setModalopen] = useState(false);
  const [share,setShare]=useState(false);

  async function shareFun()
  {   
      setShare((previousValue)=>!previousValue);
      const response=await axios({
        method:"post",
        url:BACKEND_URL+"api/v1//brain/share",
        data:{
          share:share
        },
        headers:{
          authorization:localStorage.getItem("token")
        }
      })
      if(share)
      {
        navigator.clipboard.writeText(LocalUrl+response.data.hash);
        alert("Share Link Copied To Clipboard")
      }
      else{
        alert("Sharing Disabled");
      }
  }
  return (
    <div className="w-screen h-screen flex">

     <SideBar shareDelete={true}/>

      <div className="w-full ml-80">
        <div className="bg-[#f9fbfc] w-full min-h-screen m-0 p-0">
          <div className="mr-5 pt-10 flex justify-end mb-8">
            <Button
              variant="secondary"
              text="Share Brain"
              size="sm"
              startIcon={<ShareIcon />}
              onClick={shareFun}
            />
            <Button
              variant="primary"
              text="Add Content"
              size="sm"
              startIcon={<PlusIcon />}
              onClick={() => {
                setModalopen((currentValue) => !currentValue);
              }}
            />
          </div>
          <div className="ml-10 flex flex-wrap gap-10 items-start">

          {contents.map(({type, link, title,_id}) => <CardComponenet 
            type={type}
            link={link}
            title={title}
            contnetId={_id}
            shareDelete={true}
        />)}
        {/* {JSON.stringify(content)} */}
          </div>
          <CreateContentModal
            open={modalopen}
            onClose={() => {
              setModalopen((currentValue) => !currentValue);
            }}
          />
        </div>
      </div>
    </div>
  );
}

