import { BrainIcon, LogoutIcon, XIcon, XIconBig, YoutubeIconBig } from "../icons/Share-icon"

import { useContent } from "../../hooks/useContent"

export const SideBar=()=>{
    const {contents,funCall}=useContent();
    return(
        <div className="white w-0 md:w-80  md:visible h-screen shadow-lg border-r-2 pl-3 pt-3 pr-3 flex flex-col fixed top-0 left-0">

            <div className="flex  items-center w-full h-16">
            <BrainIcon/>
                <div className="font-[Poppins] text-2xl font-bold ml-5">Second Brain</div>
            </div>
            <span className="pl-16 font-[Poppins] text-xl font-bold ml-5">Hello {contents[0]?.userId?.username} !</span>
            <SideBarItems/>

            <div className="mb-10 ml-3 cursor-pointer " onClick={()=>{
                localStorage.removeItem("token");
                location.reload()
            }}>
                <LogoutIcon/>
                <span className="font-[Poppins] text-xxl font-medium ">Logout</span>
            </div>
        </div>
    )
}

const SideBarItems=()=>{
    return(
        <div className="h-full w-full mt-10">
            <div className=" h-10 mx-2 my-4">
            <XIconBig/>
            <span className="font-[Poppins] text-xl font-medium text-gray-600">Twitter</span>
            </div>

            <div className=" h-10 mx-2 my-4">
            <YoutubeIconBig/>
            <span className="font-[Poppins] text-xl font-medium text-gray-600">YouTube</span>
            </div>
        </div>
    )
}