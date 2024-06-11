// src/app/component/hooks/useLatestDiagnosisResult.tsx

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../../../firebase';

const useInput = (roomId: string) => {
  const [latestInput, setLatestInput] = useState<any>(null);


  useEffect(() => {
    const fetchLatestInput = async () => {
      try {
        const q = query(
          collection(db, 'rooms', roomId, 'Input'),
          orderBy('Time_Stamp', 'desc'),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setLatestInput(doc.data());
        }
        
      }finally{
        
      }
    

    fetchLatestInput();
}}, [roomId]);

  return { latestInput};
};

export default useInput;
