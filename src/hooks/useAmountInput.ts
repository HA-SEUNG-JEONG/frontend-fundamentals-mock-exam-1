import { ChangeEvent, useState } from 'react';

export const useAmountInput = (initialValue: number = 0) => {
  const [amount, setAmount] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = Number(value.split(',').join(''));
    if (!isNaN(numericValue)) {
      setAmount(numericValue);
    }
  };

  const displayValue = amount === 0 ? '' : amount.toLocaleString('ko-KR');

  return {
    amount,
    onChange: handleChange,
    displayValue,
  };
};
