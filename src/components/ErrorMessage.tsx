import { colors, Flex, Spacing, Text } from 'tosslib';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <>
      <Flex direction="column" alignItems="center" justifyContent="center" gap={8}>
        <Spacing size={8} />
        <Text color={colors.red600} fontSize={14} fontWeight="medium">
          {message}
        </Text>
        <Spacing size={8} />
      </Flex>
      <Spacing size={16} />
    </>
  );
};
