import { colors, ListRow } from 'tosslib';

interface CalculationResultsProps {
  expectedProfitAmount: number;
  differenceFromGoal: number;
  recommendedMonthlyAmount: number;
}

export const CalculationResults = ({
  expectedProfitAmount,
  differenceFromGoal,
  recommendedMonthlyAmount,
}: CalculationResultsProps) => {
  return (
    <>
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
    </>
  );
};
