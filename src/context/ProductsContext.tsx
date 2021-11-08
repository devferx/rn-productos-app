import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {AxiosResponse} from 'axios';

import {Producto, ProductsResponse} from '../interfaces/appInterfaces';
import cafeApi from '../api/cafeApi';
import {Asset} from 'react-native-image-picker';

type ProductsContextProps = {
  products: Producto[];
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<Producto>;
  updateProduct: (
    categoryId: string,
    productName: string,
    productId: string,
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loadProductById: (id: string) => Promise<Producto>;
  uploadImage: (data: Asset, id: string) => Promise<void>; //TODO: Cambiar ANY
};

export const ProductsContext = createContext({} as ProductsContextProps);

interface ProductsProvider {
  children: ReactNode;
}

interface MutateProductI {
  nombre: string;
  categoria: string;
}

export const ProductsProvider = ({children}: ProductsProvider) => {
  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
    // setProducts([...products, ...resp.data.productos]);
    setProducts([...resp.data.productos]);
  };

  const addProduct = async (
    categoryId: string,
    productName: string,
  ): Promise<Producto> => {
    const resp = await cafeApi.post<MutateProductI, AxiosResponse<Producto>>(
      '/productos',
      {
        nombre: productName,
        categoria: categoryId,
      },
    );
    setProducts([...products, resp.data]);
    return resp.data;
  };

  const updateProduct = async (
    categoryId: string,
    productName: string,
    productId: string,
  ) => {
    const resp = await cafeApi.put<MutateProductI, AxiosResponse<Producto>>(
      `/productos/${productId}`,
      {
        nombre: productName,
        categoria: categoryId,
      },
    );
    setProducts(
      products.map(prod => (prod._id === productId ? resp.data : prod)),
    );
  };

  const deleteProduct = async (id: string) => {
    const resp = await cafeApi.delete<Producto>(`/productos/${id}`);
    setProducts(products.filter(prod => prod._id !== resp.data._id));
  };

  const loadProductById = async (id: string): Promise<Producto> => {
    const resp = await cafeApi.get<Producto>(`/productos/${id}`);
    return resp.data;
  };

  const uploadImage = async (data: Asset, id: string) => {
    const fileToUpload = {
      uri: data.uri,
      type: data.type,
      name: data.fileName,
    };

    const formData = new FormData();
    formData.append('archivo', fileToUpload);
    try {
      await cafeApi.put(`/uploads/productos/${id}`, formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        loadProductById,
        uploadImage,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};
