"use client";
import React, { useState } from 'react';

interface ImageUploadProps {
  onRecognitionResult: (result: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onRecognitionResult }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const imageFile = files[0];
      setSelectedImage(imageFile);
      
      try {
        // 画像をPythonで作成したYOLOv5モデルに送信して結果を取得
        const result = await recognizeImage(imageFile);
        // 結果を親コンポーネントに渡す
        onRecognitionResult(result);
      } catch (error) {
        console.error("Error during image recognition:", error);  // エラーハンドリング
      }
    }
  };

  const recognizeImage = async (image: File): Promise<number> => {
    const formData = new FormData();
    formData.append('file', image);

    const response = await fetch('http://localhost:3000/api/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Recognition result:", data);  // デバッグ用ログ
    return data.result;
  };

  return (
    <div className="mt-5">
      <label htmlFor="imageInput">症状の画像を添付してください：</label>
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default ImageUpload;
