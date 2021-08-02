import { fireEvent, render } from '@testing-library/react';
import { useCart } from '../../hooks/useCart';
import Cart from '../../pages/Cart';


const mockedRemoveProduct = jest.fn();
const mockedUpdateProductAmount = jest.fn();
const mockedUseCartHook = useCart as jest.Mock;

jest.mock('../../hooks/useCart');

describe('', () => {
    it('deve remover um produto do carrinho', () => {
        mockedUseCartHook.mockReturnValue({
            cart: [
                {
                    amount: 1,
                    id: 1,
                    image:
                        'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
                    price: 179.9,
                    title: 'Tênis de Caminhada Leve Confortável',
                },
                {
                    amount: 2,
                    id: 2,
                    image:
                        'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
                    price: 139.9,
                    title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
                },
            ],
            removeProduct: mockedRemoveProduct,
            updateProductAmount: mockedUpdateProductAmount,
        });
        const { getAllByTestId, rerender } = render(<Cart />);

        const [removeFirstProduct] = getAllByTestId('remove-product');
        const [firstProduct, secondProduct] = getAllByTestId('product');

        expect(firstProduct).toBeInTheDocument();
        expect(secondProduct).toBeInTheDocument();

        fireEvent.click(removeFirstProduct);

        expect(mockedRemoveProduct).toHaveBeenCalledWith(1);

        mockedUseCartHook.mockReturnValueOnce({
            cart: [
                {
                    amount: 1,
                    id: 2,
                    image:
                        'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
                    price: 139.9,
                    title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
                },
            ],
        });

        rerender(<Cart />);

        expect(firstProduct).not.toBeInTheDocument();
        expect(secondProduct).toBeInTheDocument();
    });
})