// src/app/component/hooks/useLatestDiagnosisResult.tsx

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../../../firebase';

const useLatestDiagnosisResult = (roomId: string) => {
  const [latestResult, setLatestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestResult = async () => {
      try {
        const q = query(
          collection(db, 'rooms', roomId, 'Output'),
          orderBy('Time_Stamp', 'desc'),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setLatestResult(doc.data());
        } else {
          setError('No diagnosis result found');
        }
      } catch (e) {
        setError('Error fetching diagnosis result');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestResult();
  }, [roomId]);

  return { latestResult, loading, error };
};

export default useLatestDiagnosisResult;
