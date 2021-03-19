import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });


  const addProduct = async (productId: number) => {
    try {
      let ProductFounded = cart.find(product=> product.id === productId )
      const {data: stock} = await  api.get(`stock/${productId}`);
      console.log(stock)
      if (!ProductFounded){
       
        const {data} = await  api.get(`products/${productId}`)
        
        data.amount = 1
        setCart([...cart,data])
        localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart,data]))
        
      }else{
        if(stock.amount <= ProductFounded.amount){
          toast.error('Quantidade solicitada fora de estoque')
          return
        }
        const newCart = cart.map((cart)=>{
          if(cart.id === productId){
            cart.amount += 1
          }
          return cart
        })
        setCart(newCart)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
        
      }
      
     
    } catch(e) {
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const ProductFounded = cart.find(product=> product.id === productId )

      if (ProductFounded){
        const newCarts = cart.filter((product) => product.id !== productId )
      

        setCart(newCarts)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCarts))
      }else{
        toast.error("Erro na remoção do produto")
      }
    } catch {
      toast.error("Erro na remoção do produto")
    }
    
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const {data: stock} = await  api.get(`stock/${productId}`);
      if (amount <= stock.amount  && amount > 0){
        const newCart = cart.map((cart)=>{
          if(cart.id === productId ){
            cart.amount =amount
          }
          return cart
        })
        
        setCart(newCart)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
      }else{
        toast.error('Quantidade solicitada fora de estoque')
      }
    } catch {
      toast.error('Erro na alteração de quantidade do produto')
      return
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
