import { useMemo } from 'react';
import { SavingsProduct } from '../types';
import {
  calculateExpectedProfit,
  calculateRecommendedMonthlyAmount,
  filterSavingsProducts,
  getRecommendedProducts,
} from '../utils';

interface UseSavingsCalculatorParams {
  savingsProducts: SavingsProduct[];
  monthlyAmount: number;
  savingsPeriod: number;
  goalAmount: number;
  selectedProductId: string | null;
}

export const useSavingsCalculator = ({
  savingsProducts,
  monthlyAmount,
  savingsPeriod,
  goalAmount,
  selectedProductId,
}: UseSavingsCalculatorParams) => {
  // 필터링된 상품 목록
  const filteredSavingsProducts = useMemo(() => {
    return filterSavingsProducts(savingsProducts, monthlyAmount, savingsPeriod);
  }, [savingsProducts, monthlyAmount, savingsPeriod]);

  // 추천 상품: 사용자 조건에 맞는 상품 중 연 이자율이 가장 높은 N개
  const recommendedProducts = useMemo(() => {
    return getRecommendedProducts(filteredSavingsProducts);
  }, [filteredSavingsProducts]);

  // 선택된 상품
  const selectedProduct = useMemo(() => {
    if (!selectedProductId) {
      return null;
    }
    return savingsProducts.find(product => product.id === selectedProductId) || null;
  }, [savingsProducts, selectedProductId]);

  // 추천 월 납입액
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(selectedProduct, goalAmount, savingsPeriod);

  // 예상 수익
  const expectedProfitAmount = calculateExpectedProfit(selectedProduct, monthlyAmount, savingsPeriod);

  // 목표 금액과의 차이
  const differenceFromGoal = !selectedProductId || goalAmount === 0 ? 0 : goalAmount - expectedProfitAmount;

  // 목표 달성률 계산 (0 ~ 1)
  const goalProgress = goalAmount <= 0 || !selectedProductId ? 0 : Math.min(expectedProfitAmount / goalAmount, 1);

  // 사용 가능한 저축 기간 목록
  const availableTerms = useMemo(() => {
    return Array.from(new Set(savingsProducts.map(product => product.availableTerms))).sort((a, b) => a - b);
  }, [savingsProducts]);

  return {
    filteredSavingsProducts,
    recommendedProducts,
    selectedProduct,
    recommendedMonthlyAmount,
    expectedProfitAmount,
    differenceFromGoal,
    goalProgress,
    availableTerms,
  };
};
