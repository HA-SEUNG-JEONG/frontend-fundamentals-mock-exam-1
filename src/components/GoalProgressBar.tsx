import { colors, ProgressBar, Spacing, Text } from 'tosslib';

interface GoalProgressBarProps {
  goalAmount: number;
  goalProgress: number;
}

export const GoalProgressBar = ({ goalAmount, goalProgress }: GoalProgressBarProps) => {
  if (goalAmount <= 0) {
    return null;
  }

  return (
    <div className="px-4">
      <Spacing size={4} />
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
  );
};
