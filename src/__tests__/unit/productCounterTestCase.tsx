import { api } from '../../services/api';

describe('Produxt counter', async () => {
  it('ahsduashdasi', async () => {
    const response = await api.get('products')
    const products = response.data
    expect(products.length).toEqual(6)
  })
});