"use client";
import React from "react";

interface PartsProps {
  id: string;
  onChange: (parts: string) => void;
}

const Parts = ({ id, onChange }: PartsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mt-5 justify-center items-center h-full">
      <label className="mb-1 block" >症状を選んでください</label>
      <select id={id} name="parts" onChange={handleChange}>
        <option value="">近い症状を選択してください</option>
        <option value="脳神経外科">頭に違和感がある</option>
        <option value="小児科">子供の体調が悪い</option>
        <option value="内科">怪我をした</option>
        <option value="外科">体の中に違和感がある</option>
        <option value="産婦人科">子供が産まれそう</option>
        <option value="整形外科">猫背が気になる</option>
      </select>
    </div>
  );
};

export default Parts;
