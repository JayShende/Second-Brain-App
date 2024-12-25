import { useRef, useState } from "react";
import { CloseIcon } from "../icons/Share-icon";
import { Button } from "./Button";
import axios from "axios";
import { BACKEND_URL } from "../../config";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}


enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter"
}


export const CreateContentModal = (props: ModalProps) => {

  const titleRef=useRef<HTMLInputElement>();
  const linkRef=useRef<HTMLInputElement>();

  const [type,setType]=useState(ContentType.Youtube)
  console.log(type);
  async function submitModal()
  {
    const title=titleRef.current?.value;
    const link=linkRef.current?.value;
    const response= await axios({
      method:"post",
      url:BACKEND_URL+"api/v1/content",
      data:{
        title:title,
        link:link,
        type:type
      },
      headers:{
        authorization:localStorage.getItem("token")
      }
    })

    console.log(response.data);
    alert("added");
    props.onClose();
  }
  return (
    <div>
      {props.open && (
        <div className="bg-slate-300 w-full h-full fixed top-0 left-0 opacity-90 flex justify-center items-center">
          <div className="bg-white w-64 h-80 rounded-lg opacity-100">
            <div
              className="flex items-start justify-end px-3 pt-4 cursor-pointer opacity-100"
              onClick={props.onClose}
            >
              <CloseIcon />
            </div>
            <div className="flex items-center flex-col ">
              <Input placeholder="Title" refrence={titleRef}/>
              <Input placeholder="Link" refrence={linkRef}/>

              <div className="flex mt-2">
                <Button variant={type === ContentType.Youtube ? "primary" : "secondary"} text="Youtube" size="sm" onClick={()=>{
                  setType(ContentType.Youtube)
                }}/>
                <Button variant={type === ContentType.Youtube ? "secondary" : "primary"} text="Twitter" size="sm" onClick={()=>{
                  setType(ContentType.Twitter)
                }}/>
              </div>

              <Button variant="primary" text="Submit" size="lg" onClick={submitModal}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface InputProps {
  refrence:any;
  placeholder: string;
}

function Input(props: InputProps) {
  return (
    <input
      type="text"
      className="w-52 h-10 bg-gray-400 mt-6 rounded-md placeholder:text-white pl-3 font-mono "
      ref={props.refrence}
      placeholder={props.placeholder}
    />
  );
}
