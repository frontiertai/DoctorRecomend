"use client"

import React, { useState } from 'react';
import History from "@/app/component/History";
import Judge from "@/app/component/Judge";
import Result from '../Result/page'; 


const Register = () => {
    
    return (
        <div className="flex h-screen justify-center items-center" style={{ width: "1280px" }}>
            <div className="w-1/5 h-full border-right">
                <History />
            </div>
            <div className="w-4/5 h-full">
                <Judge/>
            </div>
        </div>
    );
};

export default Register;
