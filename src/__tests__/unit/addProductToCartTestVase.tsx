import { act, renderHook } from '@testing-library/react-hooks';
import AxiosMock from 'axios-mock-adapter';
import { CartProvider, useCart } from '../../hooks/useCart';
import { api } from '../../services/api';

const mockedSetItemLocalStorage = jest.spyOn(Storage.prototype, 'setItem');

const apiMock = new AxiosMock(api);

describe('', () => {
    it('deve adicionar um produto no carrinho', async () => {
        const productId = 1;

        apiMock.onGet(`stock/${productId}`).reply(200, {
            id: 1,
            amount: 3,
        });
        apiMock.onGet(`products/${productId}`).reply(200, {
            id: 1,
            image:
                'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
            price: 179.9,
            title: 'Tênis de Caminhada Leve Confortável',
        });

        const { result, waitForNextUpdate } = renderHook(useCart, {
            wrapper: CartProvider,
        });

        act(() => {
            result.current.addProduct(productId);
        });

        await waitForNextUpdate({ timeout: 200 });

        expect(result.current.cart).toEqual(
            [
                {
                    id: 1,
                    image: 'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
                    price: 179.9,
                    title: 'Tênis de Caminhada Leve Confortável',
                    amount: 1
                },
            ])
    });
})