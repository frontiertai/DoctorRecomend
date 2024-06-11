'use client';
import Link from "next/link";
import React, { ReactNode } from "react";
interface NextLinkProps{
    children:ReactNode;
    href:string;
    bgColor:string
    textColor:string
}


const NextLink=({children,href,bgColor,textColor}:NextLinkProps)=>{
    const defaultClassName="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center border border-gray-300 rounded-lg "
    return(
    <Link
    href={href}

     className={`${defaultClassName} ${bgColor} ${textColor}`}
     >
        
        {children}
     
     </Link>
    );
};

export default NextLink;