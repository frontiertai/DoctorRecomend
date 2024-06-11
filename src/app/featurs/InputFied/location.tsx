"use client";
import React from "react"

interface LocationProps{
    id:string;
    
    onSelectLocation:(location:string)=>void;
}



const Location=({id,onSelectLocation}:LocationProps)=>{
    const handleChange=(e:React.ChangeEvent<HTMLSelectElement>)=>{
        onSelectLocation(e.target.value)
    }
    return (
    <div className="mt-5 justify-center items-center h-full">
        <label className="mb-1 block" >現在地</label>
        <select name="pref"  onChange={handleChange}>
                <option value="">現在地を選択してください</option>
                <option value="A地区">A地区</option>
                <option value="B地区">B地区</option>
                <option value="C地区">C地区</option>
                <option value="D地区">D地区</option>
                <option value="E地区">E地区</option>
            
        </select>
    </div>


    );
};
export default Location;