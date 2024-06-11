
import React from "react";
import NextLink from "../../elements/Link";

const Header=()=>{
    return (
    <header>
        <div className="flex items-center justify-between px-4 py-2.5 bg-white border-gray=200">
            <div className="font-semibold text-xl">
                <a href="/" className="text-blue-500 hover:underline">
                    DoctoreRecomend
                    </a>
            </div>
            <div className="flex justify-end">
                <NextLink    
                href="/auth/Login" 
                bgColor="bg-blue-500"
                textColor="text-white"
                >
                    ログイン
                </NextLink> 
            </div>  
        </div>

    </header>
    );
};


export default Header;