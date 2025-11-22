import { useState } from 'react';
import { Border, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { CalculationResults } from '../components/CalculationResults';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { GoalProgressBar } from '../components/GoalProgressBar';
import { RecommendedProductList } from '../components/RecommendedProductList';
import { SavingsProductList } from '../components/SavingsProductList';
import { useAmountInput } from '../hooks/useAmountInput';
import { useSavingsCalculator } from '../hooks/useSavingsCalculator';
import { useSavingsProducts } from '../hooks/useSavingsProducts';
import { TabType } from 'constants';

export function SavingsCalculatorPage() {
  const { savingsProducts, error: productsError } = useSavingsProducts();
  const { amount: goalAmount, displayValue: goalAmountDisplay, onChange: handleGoalAmountChange } = useAmountInput();
  const {
    amount: monthlyAmount,
    displayValue: monthlyAmountDisplay,
    onChange: handleMonthlyAmountChange,
  } = useAmountInput();
  const [savingsPeriod, setSavingsPeriod] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('products');

  const {
    filteredSavingsProducts,
    recommendedProducts,
    recommendedMonthlyAmount,
    expectedProfitAmount,
    differenceFromGoal,
    goalProgress,
    availableTerms,
  } = useSavingsCalculator({
    savingsProducts,
    monthlyAmount,
    savingsPeriod,
    goalAmount,
    selectedProductId,
  });

  const handleSavingsPeriodChange = (value: number) => {
    setSavingsPeriod(value);
  };

  const handleProductSelect = (id: string) => {
    setSelectedProductId(prev => (prev === id ? null : id));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      {productsError && <ErrorMessage message={productsError} />}

      <TextField
        value={goalAmountDisplay}
        onChange={handleGoalAmountChange}
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
      />
      <Spacing size={16} />
      <TextField
        value={monthlyAmountDisplay}
        onChange={handleMonthlyAmountChange}
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsPeriod}
        onChange={value => handleSavingsPeriodChange(value)}
      >
        {availableTerms.map(term => (
          <SelectBottomSheet.Option key={term} value={term}>
            {term}개월
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={handleTabChange}>
        <Tab.Item value="products" selected={activeTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {activeTab === 'products' && (
        <SavingsProductList
          filteredProducts={filteredSavingsProducts}
          allProducts={savingsProducts}
          selectedProductId={selectedProductId}
          onProductSelect={handleProductSelect}
        />
      )}

      {activeTab === 'results' && selectedProductId && (
        <>
          <Spacing size={8} />

          <GoalProgressBar goalAmount={goalAmount} goalProgress={goalProgress} />

          <CalculationResults
            expectedProfitAmount={expectedProfitAmount}
            differenceFromGoal={differenceFromGoal}
            recommendedMonthlyAmount={recommendedMonthlyAmount}
          />

          <RecommendedProductList
            products={recommendedProducts}
            selectedProductId={selectedProductId}
            onProductSelect={handleProductSelect}
          />
        </>
      )}

      {activeTab === 'results' && !selectedProductId && <EmptyState message="상품을 선택해주세요." />}
    </>
  );
}
