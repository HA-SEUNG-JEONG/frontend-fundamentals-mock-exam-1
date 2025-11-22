import { Button, colors, Flex, ListRow, Spacing, Text } from 'tosslib';

interface EmptyStateProps {
  message: string;
  onButtonClick?: () => void;
  buttonText?: string;
}

export const EmptyState = ({ message, onButtonClick, buttonText }: EmptyStateProps) => {
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
      {onButtonClick && (
        <>
          <Spacing size={16} />
          <Button theme="primary" onClick={onButtonClick} className="cursor-pointer">
            {buttonText}
          </Button>
        </>
      )}
      <Spacing size={24} />
    </Flex>
  );
};
