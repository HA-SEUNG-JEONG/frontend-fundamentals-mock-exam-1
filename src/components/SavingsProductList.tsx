import { Assets, Spacing } from 'tosslib';
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
        <div key={product.id}>
          <SavingsProductItem
            product={product}
            right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
            onClick={() => onProductSelect(product.id)}
          />
          <Spacing size={8} />
        </div>
      ))}
    </>
  );
};
