import { SavingsProduct } from 'types';

export function calculateRecommendedMonthlyAmount(
  selectedProduct: SavingsProduct | null,
  goalAmount: number,
  savingsPeriod: number
) {
  if (!selectedProduct || goalAmount === 0 || savingsPeriod === 0) return 0;

  const annualRateDecimal = selectedProduct.annualRate / 100;
  const recommended = goalAmount / (savingsPeriod * (1 + annualRateDecimal * 0.5));

  return Math.round(recommended / 1000) * 1000;
}

export function calculateExpectedProfit(
  selectedProduct: SavingsProduct | null,
  monthlyAmount: number,
  savingsPeriod: number
) {
  if (!selectedProduct || monthlyAmount === 0 || savingsPeriod === 0) return 0;

  const annualRateDecimal = selectedProduct.annualRate / 100;
  const finalAmount = monthlyAmount * savingsPeriod * (1 + annualRateDecimal * 0.5);

  return Math.round(finalAmount);
}
