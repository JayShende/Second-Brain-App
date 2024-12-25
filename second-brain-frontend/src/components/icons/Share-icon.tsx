
export const ShareIcon =()=>{
    return(
        <i className="ri-share-line text-lg mr-2 font-bold text-[#5046e4]"></i>
    )

}

export const PlusIcon=()=>{
    return(
        <i className="ri-add-line text-lg mr-2 font-bold"></i>
    )
}


interface LinkInterface{
    link:string;
}

export const CardShare=(prop:LinkInterface)=>{
    return(
       <span onClick={()=>{
        navigator.clipboard.writeText(prop.link)
       }} className=" cursor-pointer">
         <i className="ri-share-line text-lg mr-2 font-medium text-gray-400 pl-1"></i>
       </span>
    )
}

interface deleteInterface{
    onClick:()=>void
}

export const DeleteBin=(props:deleteInterface)=>{
    return(
        <div onClick={props.onClick} className="cursor-pointer">
            <i className="ri-delete-bin-line text-lg mr-2 font-medium text-gray-400 "></i>
        </div>
    )
}

export const FileIcon=()=>{
    return(
        <i className="ri-file-text-line text-lg mr-2 font-medium text-gray-400 "></i>
    )
}

export const XIcon=()=>{
    return(
        <i className="ri-twitter-x-fill text-lg mr-2 font-medium text-gray-400"></i>
    )
}

export const YoutubeIcon=()=>{
    return(
        <i className="ri-youtube-fill text-lg mr-2 font-medium text-gray-400"></i>
    )
}

export const CloseIcon=()=>{
    return(
        <i className="ri-close-line text-xl mr-2 font-bold text-gray-600"></i>
    )
}

export const BrainIcon=()=>{
    return(
        <i className="ri-brain-line text-5xl  font-mediun text-[#5046e4] "></i>
    )
}

export const XIconBig=()=>{
    return(
        <i className="ri-twitter-x-fill text-2xl mr-2 font-medium text-gray-600"></i>
    )
}

export const YoutubeIconBig=()=>{
    return(
        <i className="ri-youtube-fill text-2xl mr-2 font-medium text-gray-600"></i>
    )
}

export const LogoutIcon=()=>{
    return(
        <i className="ri-logout-box-r-line  text-2xl mr-2 font-medium text-gray-600"></i>
    )
}