import React, {useContext, useEffect} from 'react';
import {
  Platform,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';

import {Background} from '../components/Background';
import {WhiteLogo} from '../components/WhiteLogo';
import {useForm} from '../hooks/useForm';
import {loginStyles} from '../theme/loginTheme';
import {AuthContext} from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({navigation}: Props) => {
  const {signIn, errorMessage, removeError} = useContext(AuthContext);
  const {email, password, onChange} = useForm({
    email: '',
    password: '',
  });

  const onLogin = () => {
    Keyboard.dismiss();
    signIn({correo: email, password});
  };

  useEffect(() => {
    if (errorMessage.length === 0) {
      return;
    }

    Alert.alert('Login incorrecto', errorMessage, [
      {
        text: 'Ok',
        onPress: () => removeError(),
      },
    ]);
  }, [errorMessage, removeError]);

  return (
    <>
      {/* Background */}
      <Background />
      {/* Keyboard avoid view */}
      <KeyboardAvoidingView
        style={loginStyles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={loginStyles.formContainer}>
          <WhiteLogo />

          <Text style={loginStyles.title}>Login</Text>
          <Text style={loginStyles.label}>Email:</Text>
          <TextInput
            placeholder="Ingrese su email:"
            placeholderTextColor="rgba(255,255, 255, 0.4)"
            keyboardType="email-address"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIOS,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'email')}
            value={email}
            onSubmitEditing={onLogin}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={loginStyles.label}>Contraseña:</Text>
          <TextInput
            placeholder="*****"
            placeholderTextColor="rgba(255,255, 255, 0.4)"
            underlineColorAndroid="white"
            secureTextEntry
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIOS,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'password')}
            value={password}
            onSubmitEditing={onLogin}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {/* Boton Login */}
          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              style={loginStyles.button}
              activeOpacity={0.8}
              onPress={onLogin}>
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
          {/* Crear una nueva cuenta */}
          <View style={loginStyles.newUserContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('RegisterScreen')}>
              <Text style={loginStyles.buttonText}>Nueva cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
