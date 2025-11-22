import { Assets, Badge, Border, colors, Flex, ListHeader, Spacing, Text } from 'tosslib';
import { SavingsProduct } from '../types';
import { SavingsProductItem } from './SavingsProductItem';

interface RecommendedProductListProps {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onProductSelect: (id: string) => void;
}

export const RecommendedProductList = ({
  products,
  selectedProductId,
  onProductSelect,
}: RecommendedProductListProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {products.map(product => (
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
                {selectedProductId === product.id && <Assets.Icon name="icon-check-circle-green" />}
              </Flex>
            }
            onClick={() => onProductSelect(product.id)}
          />
          <Spacing size={8} />
        </div>
      ))}

      <Spacing size={40} />
    </>
  );
};
