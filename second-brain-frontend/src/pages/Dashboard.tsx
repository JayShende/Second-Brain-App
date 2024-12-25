import { useState } from "react";
import "../App.css";
import { PlusIcon, ShareIcon } from "../components/icons/Share-icon";
import { Button } from "../components/ui/Button";
import { CardComponenet } from "../components/ui/card";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { SideBar } from "../components/ui/sidebar";
import { useContent } from "../hooks/useContent";

export const DashBoard=()=> {
  const {contents,funCall}=useContent();
  const [modalopen, setModalopen] = useState(false);
  return (
    <div className="w-screen h-screen flex">

     <SideBar/>

      <div className="w-full ml-80">
        <div className="bg-[#f9fbfc] w-full min-h-screen m-0 p-0">
          <div className="mr-5 pt-10 flex justify-end mb-8">
            <Button
              variant="secondary"
              text="Share Brain"
              size="sm"
              startIcon={<ShareIcon />}
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

