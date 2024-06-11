'use client';
import React, { useState } from "react";

interface AgeProps {
    id: string;
    label: string;
    onSelectAge: (age: number) => void; // 数値型の年齢を親コンポーネントに伝えるためのコールバック関数
}

const Age = ({ id, label, onSelectAge }: AgeProps) => {
    const [selectedAge, setSelectedAge] = useState<number | "">(0); // 選択された年齢をstateで管理。初期値は0

    // セレクトボックスの値が変更されたときに呼ばれる関数
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = parseInt(event.target.value); // 選択された値を数値型に変換
        setSelectedAge(selectedValue); // stateを更新
        onSelectAge(selectedValue); // 親コンポーネントに選択された年齢を数値型で伝える
    };

    return (
        <div className="mt-5 justify-center items-center h-full">
            <label className="mb-1 block" htmlFor={id}>{label}</label>
            <select id={id} name="age" value={selectedAge} onChange={handleSelectChange}>
                <option value={0}>選択してください</option>
                <option value={1}>0〜9</option>
                <option value={10}>10〜19</option>
                <option value={20}>20〜29</option>
                <option value={30}>30〜39</option>
                <option value={40}>40〜49</option>
                <option value={50}>50〜59</option>
                <option value={60}>60〜69</option>
                <option value={70}>70〜79</option>
                <option value={80}>80〜89</option>
                <option value={90}>90〜99</option>
                <option value={100}>100〜</option>
            </select>
        </div>
    );
};

export default Age;
