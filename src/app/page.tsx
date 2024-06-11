"use client"

import Image from "next/image";
import NextLink from "./component/elements/Link";
export default function Home() {
  return (
    <section className="bg-white dark:bg-gray-900 mt-20 lg mt-36">
    <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">DRシステム</h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">あなたにおすすめの医者を紹介します.</p>
            
            <NextLink 
            href="/auth/New" 
            bgColor="bg-blue-500"
            textColor="text-white"
            >
                始める
            </NextLink> 
        </div>
        <div className="lg:mt-0 lg:col-span-5 flex style={{widt:'500px' ,height:'500px'}}">
            
        </div>                
    </div>
</section>
  
  );
}
