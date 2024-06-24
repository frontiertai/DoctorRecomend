"use client";
import React from 'react';
import useLatestDiagnosisResult from '@/app/component/hooks/useLatsetDiagnosisResult/page';
import useInput from '@/app/component/hooks/useLatestInput/page';
import { useAppContext } from '@/app/context/Appcontext';

const Result = () => {
  const { selectedRoom} = useAppContext();

  if(!selectedRoom){
    return
  }
  
  const roomId = selectedRoom; // 固定のルームIDを使用
  const { latestResult, loading, error } = useLatestDiagnosisResult(roomId);
  const{latestInput}=useInput(roomId);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!latestResult) {
    return <div className="flex justify-center items-center h-screen">No diagnosis result found</div>;
  }

  return (
    <div className="bg-blue-50 h-full p-4 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-1 text-center text-blue-700">診断結果</h1>
        <div className="mt-8">
          <h2 className="text-xl font-medium text-blue-700">病院名: {latestResult.Hospital}</h2>
          <h2 className="text-xl font-medium text-blue-700">場所: {latestResult.Location}</h2>
          <h2 className="text-xl font-medium text-blue-700">医師名: {latestResult.Doctor_Name}</h2>
          <h2 className="text-xl font-medium text-blue-700">専門: {latestResult.Specialty}</h2>
          <h2 className="text-xl font-medium text-blue-700">専門レベル: {latestResult.Expertise_Level}</h2>
          
            <>
              <h2 className="text-xl font-medium text-blue-700 mt-4">YOLO解析結果:</h2>
              <img src={`/server/uploads/new/latest_result.jpg`} alt="YOLO解析結果" className="mt-2"/>
            </>
        </div>
      </div>
      
      
      

    </div>
    
   
  );
};

export default Result;
