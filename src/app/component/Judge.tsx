"use client";


import React, { useEffect, useState } from "react";
import Location from "../featurs/InputFied/location";
import Age from "../featurs/InputFied/age"; 
import Button from "../featurs/Button/Button";
import { Timestamp, addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAppContext } from "../context/Appcontext";
import ImageUpload from "../featurs/InputFied/ImageUploader"; // ImageUploadコンポーネントのインポート
import { useRouter } from "next/navigation"; // useRouterの使用
import Parts from "../featurs/InputFied/parts";

const Judge = () => {
  const { selectedRoom } = useAppContext();  //ルーム選択の際、ユーザ情報を参照する
  const [selectedAge, setSelectedAge] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [parts, setParts] = useState<string>("");
  const [recognitionResult, setRecognitionResult] = useState<number | null>(
    null
  );
  const router = useRouter(); 

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const messageData = {
      Age: selectedAge,
      Location: selectedLocation,
      Parts: parts,
      Severity: recognitionResult, // 画像認識結果を含める
      timestamp: Timestamp.now(),
    };

    const roomDocRef = doc(db, "rooms", "PeGTHlBbhMJC2wIRtzfM");
    const messageCollectionRef = collection(roomDocRef, "Input");
    await addDoc(messageCollectionRef, messageData);
    console.log("Data sent to Firestore:", messageData);

    // Pythonスクリプトを呼び出す
    const response = await fetch("http://localhost:3000/api/run-python", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (response.ok) {
      const result = await response.json();
      const queryParams = new URLSearchParams({ diagnosisResult: JSON.stringify(result) }).toString();
      router.push(`/auth/Result?${queryParams}`);
    } else {
      const errorText = await response.text();  // 追加
      console.error("Error executing Python script:", errorText); 
    }
  };

  const handleSelectAge = (age: number) => setSelectedAge(age); 
  const handleSelectLocation = (location: string) =>
    setSelectedLocation(location);
  const handlePartsChange = (parts: string) => setParts(parts);

  // 画像認識結果を受け取るコールバック関数
  const handleRecognitionResult = (result: number) => {
    setRecognitionResult(result);
  };

  return (
    <div className="bg-white h-full p-4 flex flex-col">
      <h1 className="text-2xl font-semibold mb-1">Room1</h1>
      <div className="max-w-sm-auto mt-36">
        <form onSubmit={sendMessage}>
          <h2 className="text-center mb-5 text-2xl font-medium">
            医師を探す為の情報を入力してください
          </h2>
          <Location id="location" onSelectLocation={handleSelectLocation} />
          <Age id="age" label="年齢" onSelectAge={handleSelectAge} />
          <Parts id="parts" onChange={handlePartsChange}/>
          <ImageUpload onRecognitionResult={handleRecognitionResult} />{" "}
          {/* 画像アップロードコンポーネント */}
          <div className="flex justify-end">
            <Button type="submit" textColor="text-white" bgColor="bg-blue-500">
              医師を探す
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Judge;
