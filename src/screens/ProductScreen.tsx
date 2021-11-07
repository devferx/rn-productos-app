import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {StackScreenProps} from '@react-navigation/stack';

import {ProductsStackParams} from '../navigator/ProductsNavigator';
import {useCategories} from '../hooks/useCategories';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

export const ProductScreen = ({navigation, route}: Props) => {
  const {id, name = 'Nuevo Producto'} = route.params;
  const {categories, isLoading} = useCategories();
  const [selectedLanguage, setSelectedLanguage] = useState();

  useEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [name, navigation]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del producto:</Text>
        <TextInput
          placeholder="Producto"
          style={styles.textInput}
          // TODO: value, onChangeText
        />
        <Text style={styles.label}>Categoría:</Text>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={itemValue => setSelectedLanguage(itemValue)}>
          {isLoading && <Picker.Item label="------" value="" />}
          {categories.map(category => (
            <Picker.Item
              label={category.nombre}
              value={category._id}
              key={category._id}
            />
          ))}
        </Picker>
        <Button title="Guardar" onPress={() => {}} color="#5856D6" />
        <View style={styles.actions}>
          <Button title="Cámara" onPress={() => {}} color="#5856D6" />
          <View style={styles.spaceButtons} />
          <Button title="Galería" onPress={() => {}} color="#5856D6" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 18,
    color: 'black',
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
    marginTop: 5,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  spaceButtons: {
    width: 10,
  },
});
