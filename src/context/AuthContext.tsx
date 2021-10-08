import React, {createContext, useEffect, useReducer} from 'react';
import {AxiosResponse} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import cafeApi from '../api/cafeApi';
import {LoginData, LoginResponse, Usuario} from '../interfaces/appInterfaces';
import {authReducer, AuthState} from './authReducer';

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  signUp: () => void;
  signIn: (loginData: LoginData) => void;
  logOut: () => void;
  removeError: () => void;
};

const AuthInitialState: AuthState = {
  status: 'checking',
  user: null,
  token: null,
  errorMessage: '',
};

export const AuthContext = createContext({} as AuthContextProps);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, AuthInitialState);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      // Token no autenticado
      if (!token) {
        return dispatch({type: 'notAuthenticated'});
      }
      // Hay token
      console.log(token);
    } catch (error) {
      console.log({error});
    }
  };

  const signIn = async ({correo, password}: LoginData) => {
    try {
      const {data} = await cafeApi.post<
        LoginData,
        AxiosResponse<LoginResponse>
      >('/auth/login', {
        correo,
        password,
      });

      dispatch({
        type: 'signUp',
        payload: {
          token: data.token,
          user: data.usuario,
        },
      });

      await AsyncStorage.setItem('token', JSON.stringify(data.token));
    } catch (error: any) {
      console.log(error.response.data.msg);
      dispatch({
        type: 'addError',
        payload: error.response.data.msg || 'Información incorrecta',
      });
    }
  };
  const signUp = () => {};
  const logOut = () => {};
  const removeError = () => dispatch({type: 'removeError'});

  return (
    <AuthContext.Provider
      value={{...state, signUp, signIn, logOut, removeError}}>
      {children}
    </AuthContext.Provider>
  );
};
