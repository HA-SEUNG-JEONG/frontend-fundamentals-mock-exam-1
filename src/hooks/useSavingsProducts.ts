import { useEffect, useState } from 'react';
import { http } from 'tosslib';
import { SavingsProduct } from '../types';

export const useSavingsProducts = () => {
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);

  useEffect(() => {
    const fetchSavingsProducts = async () => {
      try {
        const response = await http.get<SavingsProduct[]>('/api/savings-products');
        setSavingsProducts(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSavingsProducts();
  }, []);

  return { savingsProducts };
};
