import { SavingsProduct } from 'types';
import { INTEREST_RATE_MULTIPLIER, NO_FILTER_VALUE, RECOMMENDED_PRODUCTS_COUNT, ROUNDING_UNIT } from './constants';

export function calculateRecommendedMonthlyAmount(
  selectedProduct: SavingsProduct | null,
  goalAmount: number,
  savingsPeriod: number
) {
  if (!selectedProduct || goalAmount === 0 || savingsPeriod === 0) {
    return 0;
  }

  const annualRateDecimal = selectedProduct.annualRate / 100;
  const recommended = goalAmount / (savingsPeriod * (1 + annualRateDecimal * INTEREST_RATE_MULTIPLIER));

  return Math.round(recommended / ROUNDING_UNIT) * ROUNDING_UNIT;
}

export function calculateExpectedProfit(
  selectedProduct: SavingsProduct | null,
  monthlyAmount: number,
  savingsPeriod: number
) {
  if (!selectedProduct || monthlyAmount === 0 || savingsPeriod === 0) {
    return 0;
  }

  const annualRateDecimal = selectedProduct.annualRate / 100;
  const finalAmount = monthlyAmount * savingsPeriod * (1 + annualRateDecimal * INTEREST_RATE_MULTIPLIER);

  return Math.round(finalAmount);
}

export function filterSavingsProducts(
  products: SavingsProduct[],
  monthlyAmount: number,
  savingsPeriod: number
): SavingsProduct[] {
  return products.filter(product => {
    const matchesMonthlyAmount =
      monthlyAmount === NO_FILTER_VALUE ||
      (product.minMonthlyAmount <= monthlyAmount && product.maxMonthlyAmount >= monthlyAmount);
    const matchesSavingsPeriod = savingsPeriod === NO_FILTER_VALUE || product.availableTerms === savingsPeriod;
    return matchesMonthlyAmount && matchesSavingsPeriod;
  });
}

export function getRecommendedProducts(
  products: SavingsProduct[],
  count: number = RECOMMENDED_PRODUCTS_COUNT
): SavingsProduct[] {
  const copiedProducts = [...products];
  const soredProducts = copiedProducts.sort((a, b) => b.annualRate - a.annualRate);
  const slicedProducts = soredProducts.slice(0, count);
  return slicedProducts;
}
