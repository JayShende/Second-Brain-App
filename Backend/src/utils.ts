export const random=(size:number)=>{
    const options="qwertyuiopasdfghjklzxcvbnm123456789";
    let ans="";
    const len=options.length;

    for(let i=0;i<size;i++)
    {
        ans=ans+options[Math.floor(Math.random()*len)];
    }
    return(ans);
}