import axios from "axios";
import { CardShare, DeleteBin, XIcon, YoutubeIcon } from "../icons/Share-icon";
import { BACKEND_URL } from "../../config";
import { useContent } from "../../hooks/useContent";

interface LinkInterface {
  link: string;
}

const TweetComponent = (prop: LinkInterface) => {
  return (
    <blockquote className="twitter-tweet">
      <a href={prop.link.replace("x.com", "twitter.com")}></a>
    </blockquote>
  );
};

const YoutubeComponent = (prop: LinkInterface) => {
  return (
    <iframe
      className="w-full p-2  "
      src={prop.link.replace("youtu.be", "youtube.com/embed/")}
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
  );
};

interface CardCompo {
  title: string;
  link: string;
  type: "twitter" | "youtube";
  contnetId: string;
}

export const CardComponenet = (prop: CardCompo) => {
  const {contents,funCall}=useContent();
  async function deleteFunction() {
    const response = await axios({
      method: "delete",
      url: BACKEND_URL + "api/v1/remove",
      data: {
        deleteId: prop.contnetId,
      },
      headers: {
        authorization: localStorage.getItem("token"),
      },
    });

    console.log(response.data);
    alert("Content Deleted")
    funCall();
  }
  return (
    <div className="w-80  bg-white shadow-lg rounded-md outline outline-4  outline-slate-100">
      <div className="flex justify-between p-3">
        <div>
          {prop.type == "twitter" ? <XIcon /> : <YoutubeIcon />}
          <span className="font-[poppins] text-md font-normal text-gray-500 ">
            {prop.title}
          </span>
        </div>
        <div className="flex justify-end">
          <CardShare link={prop.link} />
          <DeleteBin onClick={deleteFunction} />
        </div>
      </div>
      <div className="px-4 h-auto">
        {prop.type == "twitter" ? (
          <TweetComponent link={prop.link} />
        ) : (
          <YoutubeComponent link={prop.link} />
        )}
      </div>
    </div>
  );
};
