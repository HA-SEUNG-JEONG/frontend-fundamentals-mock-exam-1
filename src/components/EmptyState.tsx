import { colors, Flex, ListRow, Spacing, Text } from 'tosslib';

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <Flex direction="column" alignItems="center" justifyContent="center">
      <Spacing size={24} />
      <ListRow
        contents={
          <ListRow.Texts
            type="1RowTypeA"
            top={
              <Text color={colors.grey500} fontSize={16}>
                {message}
              </Text>
            }
          />
        }
      />
      <Spacing size={24} />
    </Flex>
  );
};
