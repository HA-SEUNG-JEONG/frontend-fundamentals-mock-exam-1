import { Checkbox, colors, Flex, Spacing } from 'tosslib';
import { SavingsProduct } from '../types';
import { SavingsProductItem } from './SavingsProductItem';

interface SavingsProductListProps {
  filteredProducts: SavingsProduct[];
  allProducts: SavingsProduct[];
  selectedProductId: string | null;
  onProductSelect: (id: string) => void;
}

export const SavingsProductList = ({
  filteredProducts,
  allProducts,
  selectedProductId,
  onProductSelect,
}: SavingsProductListProps) => {
  const productsToDisplay = filteredProducts && filteredProducts.length > 0 ? filteredProducts : allProducts;

  return (
    <>
      {productsToDisplay.map(product => (
        <Flex key={product.id}>
          <SavingsProductItem
            product={product}
            right={
              <Checkbox.Circle
                checked={selectedProductId === product.id}
                onChange={() => onProductSelect(product.id)}
                color={selectedProductId === product.id ? colors.green500 : undefined}
              />
            }
          />
          <Spacing size={8} />
        </Flex>
      ))}
    </>
  );
};
