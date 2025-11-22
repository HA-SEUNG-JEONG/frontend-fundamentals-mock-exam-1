import { useEffect, useState } from 'react';
import { http, isHttpError } from 'tosslib';
import { SavingsProduct } from '../types';

export const useSavingsProducts = () => {
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavingsProducts = async () => {
      try {
        setError(null);
        const response = await http.get<SavingsProduct[]>('/api/savings-products');
        setSavingsProducts(response);
      } catch (error) {
        if (isHttpError(error)) {
          setError(`상품 정보를 불러오는데 실패했습니다. (상태 코드: ${error.status})`);
        } else {
          setError('상품 정보를 불러오는데 실패했습니다.');
        }
      }
    };
    fetchSavingsProducts();
  }, []);

  return { savingsProducts, error };
};
