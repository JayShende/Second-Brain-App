
interface ButtonProps{
    
    variant:"primary" | "secondary";
    size:"sm" | "md" | "lg";
    text:string;
    startIcon?:any;
    endIcon?:any;

    // we have made the starticon and endicon optional by adding ? telling that it can be null or unidentified
    // ie even if we dont give any start or end icons the component will work however the ther props are an compulsion

    onClick?:()=>void;
}


const variantStyles={
    "primary":"bg-[#5046e4] text-white ",
    "secondary":"bg-[#dee8fe] text-[#5046e4] "
}

const sizeStyle={
    "sm":"px-3 py-2",
    "md":"px-4 py-2",
    "lg":"px-5 py-2"
}

const defaultStyles="rounded-md m-2 flex font-medium"


export const Button=(props:ButtonProps)=>{
    
    return(
         <button className={ `${variantStyles[props.variant]} ${defaultStyles} ${sizeStyle[props.size]}` } onClick={props.onClick}>
            {props.startIcon}{props.text}{props.endIcon}
         </button>
    )
}