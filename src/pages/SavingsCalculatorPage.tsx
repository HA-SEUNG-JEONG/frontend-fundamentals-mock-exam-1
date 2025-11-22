import { useState } from 'react';
import {
  Border,
  Checkbox,
  colors,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import { SavingsProductItem } from '../components/SavingsProductItem';
import { useAmountInput } from '../hooks/useAmountInput';
import { useSavingsProducts } from '../hooks/useSavingsProducts';

import { SavingsProduct } from '../types';
import { calculateExpectedProfit, calculateRecommendedMonthlyAmount } from 'utils';

const RECOMMENDED_PRODUCTS: SavingsProduct[] = [
  {
    id: 'basic',
    name: '기본 정기적금',
    annualRate: 3.2,
    minMonthlyAmount: 100000,
    maxMonthlyAmount: 500000,
    availableTerms: 12,
  },
  {
    id: 'advanced',
    name: '고급 정기적금',
    annualRate: 2.8,
    minMonthlyAmount: 50000,
    maxMonthlyAmount: 1000000,
    availableTerms: 24,
  },
];

export function SavingsCalculatorPage() {
  const { savingsProducts } = useSavingsProducts();
  const { amount: goalAmount, displayValue: goalAmountDisplay, onChange: handleGoalAmountChange } = useAmountInput();
  const {
    amount: monthlyAmount,
    displayValue: monthlyAmountDisplay,
    onChange: handleMonthlyAmountChange,
  } = useAmountInput();
  const [savingsPeriod, setSavingsPeriod] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'results'>('products');

  const handleSavingsPeriodChange = (value: number) => {
    setSavingsPeriod(value);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedProductId(prev => (prev === id ? null : id));
  };

  const filteredSavingsProducts = savingsProducts.filter(product => {
    const matchesMonthlyAmount =
      monthlyAmount === 0 || (product.minMonthlyAmount <= monthlyAmount && product.maxMonthlyAmount >= monthlyAmount);
    const matchesSavingsPeriod = savingsPeriod === 0 || product.availableTerms === savingsPeriod;
    return matchesMonthlyAmount && matchesSavingsPeriod;
  });

  // 선택된 상품
  const selectedProduct = selectedProductId
    ? savingsProducts.find(product => product.id === selectedProductId) || null
    : null;

  // 추천 월 납입액
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(selectedProduct, goalAmount, savingsPeriod);

  // 예상 수익
  const expectedProfitAmount = calculateExpectedProfit(selectedProduct, monthlyAmount, savingsPeriod);

  const differenceFromGoal = !selectedProductId || goalAmount === 0 ? 0 : goalAmount - expectedProfitAmount;

  const availableTerms = Array.from(new Set(savingsProducts.map(product => product.availableTerms))).sort(
    (a, b) => a - b
  );

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

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

      <Tab onChange={value => setActiveTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={activeTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {activeTab === 'products' && (
        <>
          {filteredSavingsProducts && filteredSavingsProducts.length > 0
            ? filteredSavingsProducts.map(product => (
                <div key={product.id}>
                  <SavingsProductItem
                    product={product}
                    right={
                      <Checkbox.Circle
                        checked={selectedProductId === product.id}
                        onChange={() => handleCheckboxChange(product.id)}
                        color={selectedProductId === product.id ? colors.green500 : undefined}
                      />
                    }
                  />
                  <Spacing size={8} />
                </div>
              ))
            : savingsProducts.map(product => (
                <div key={product.id}>
                  <SavingsProductItem
                    product={product}
                    right={
                      <Checkbox.Circle
                        checked={selectedProductId === product.id}
                        onChange={() => handleCheckboxChange(product.id)}
                        color={selectedProductId === product.id ? colors.green500 : undefined}
                      />
                    }
                  />
                  <Spacing size={8} />
                </div>
              ))}
        </>
      )}

      {activeTab === 'results' && selectedProductId && (
        <>
          <Spacing size={8} />

          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${expectedProfitAmount.toLocaleString('ko-KR')}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600, fontSize: 24 }}
              />
            }
          />
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="목표 금액과의 차이"
                topProps={{ color: colors.grey600 }}
                bottom={`${differenceFromGoal >= 0 ? '+' : ''}${differenceFromGoal.toLocaleString('ko-KR')}원`}
                bottomProps={{
                  fontWeight: 'bold',
                  color: differenceFromGoal >= 0 ? colors.blue600 : colors.red600,
                }}
              />
            }
          />
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="추천 월 납입 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${recommendedMonthlyAmount.toLocaleString('ko-KR')}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {RECOMMENDED_PRODUCTS.map(product => (
            <div key={product.id}>
              <SavingsProductItem product={product} />
            </div>
          ))}

          <Spacing size={40} />
        </>
      )}

      {activeTab === 'results' && !selectedProductId && (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <ListRow
            contents={
              <ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." topProps={{ color: colors.grey500 }} />
            }
          />
        </div>
      )}
    </>
  );
}
