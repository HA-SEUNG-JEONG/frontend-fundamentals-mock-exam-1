import { useState } from 'react';
import {
  Badge,
  Border,
  Checkbox,
  colors,
  Flex,
  ListHeader,
  ListRow,
  NavigationBar,
  ProgressBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  Text,
  TextField,
} from 'tosslib';
import { SavingsProductItem } from '../components/SavingsProductItem';
import { useAmountInput } from '../hooks/useAmountInput';
import { useSavingsProducts } from '../hooks/useSavingsProducts';

import { calculateExpectedProfit, calculateRecommendedMonthlyAmount } from 'utils';

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

  // 추천 상품: 사용자 조건에 맞는 상품 중 연 이자율이 가장 높은 2개
  const recommendedProducts = filteredSavingsProducts
    .slice()
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);

  // 선택된 상품
  const selectedProduct = selectedProductId
    ? savingsProducts.find(product => product.id === selectedProductId) || null
    : null;

  // 추천 월 납입액
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(selectedProduct, goalAmount, savingsPeriod);

  // 예상 수익
  const expectedProfitAmount = calculateExpectedProfit(selectedProduct, monthlyAmount, savingsPeriod);

  const differenceFromGoal = !selectedProductId || goalAmount === 0 ? 0 : goalAmount - expectedProfitAmount;

  // 목표 달성률 계산 (0 ~ 1)
  const goalProgress = goalAmount > 0 && selectedProductId ? Math.min(expectedProfitAmount / goalAmount, 1) : 0;

  const availableTerms = Array.from(new Set(savingsProducts.map(product => product.availableTerms))).sort(
    (a, b) => a - b
  );

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      {productsError && (
        <>
          <Flex direction="column" alignItems="center" justifyContent="center" gap={8}>
            <Spacing size={8} />
            <Text color={colors.red600} fontSize={14} fontWeight="medium">
              {productsError}
            </Text>
            <Spacing size={8} />
          </Flex>
          <Spacing size={16} />
        </>
      )}

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

          {goalAmount > 0 && (
            <div className="w-full px-4 mt-1">
              <ProgressBar
                progress={goalProgress}
                size="normal"
                color={colors.blue600}
                animate={true}
                topAddon={
                  <ProgressBar.Row>
                    <ProgressBar.Label>
                      <Text color={colors.grey700} fontSize={14}>
                        목표 달성률
                      </Text>
                    </ProgressBar.Label>
                    <ProgressBar.Value>
                      <Text color={colors.grey900} fontSize={14} fontWeight="bold">
                        {Math.round(goalProgress * 100)}%
                      </Text>
                    </ProgressBar.Value>
                  </ProgressBar.Row>
                }
              />
              <Spacing size={16} />
            </div>
          )}

          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${expectedProfitAmount.toLocaleString('ko-KR')}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
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

          {recommendedProducts.map(product => (
            <div key={product.id}>
              <SavingsProductItem
                product={product}
                right={
                  <Flex direction="row" alignItems="center" gap={8}>
                    <Badge>
                      <Text fontSize={12} fontWeight="bold" color={colors.white}>
                        추천
                      </Text>
                    </Badge>
                    <Checkbox.Circle
                      checked={selectedProductId === product.id}
                      onChange={() => handleCheckboxChange(product.id)}
                      color={selectedProductId === product.id ? colors.green500 : undefined}
                    />
                  </Flex>
                }
              />
              <Spacing size={8} />
            </div>
          ))}

          <Spacing size={40} />
        </>
      )}

      {activeTab === 'results' && !selectedProductId && (
        <Flex direction="column" alignItems="center" justifyContent="center">
          <Spacing size={24} />
          <ListRow
            contents={
              <ListRow.Texts
                type="1RowTypeA"
                top={
                  <Text color={colors.grey500} fontSize={16}>
                    상품을 선택해주세요.
                  </Text>
                }
              />
            }
          />
          <Spacing size={24} />
        </Flex>
      )}
    </>
  );
}
