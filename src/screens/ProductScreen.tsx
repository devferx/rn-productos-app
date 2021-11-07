import React, {useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {StackScreenProps} from '@react-navigation/stack';

import {ProductsStackParams} from '../navigator/ProductsNavigator';
import {useCategories} from '../hooks/useCategories';
import {useForm} from '../hooks/useForm';
import {ProductsContext} from '../context/ProductsContext';
import {AuthContext} from '../context/AuthContext';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

export const ProductScreen = ({navigation, route}: Props) => {
  const {id = '', name = ''} = route.params;
  const {loadProductById, addProduct, updateProduct, deleteProduct} =
    useContext(ProductsContext);
  const {user} = useContext(AuthContext);

  const {categories, isLoading} = useCategories();
  const {_id, categoriaId, nombre, img, onChange, setFormValue} = useForm({
    _id: id,
    categoriaId: '',
    nombre: name,
    img: '',
  });

  useEffect(() => {
    navigation.setOptions({
      title: nombre || 'Sin nombre del Producto',
    });
  }, [nombre, navigation]);

  useEffect(() => {
    const loadProduct = async () => {
      if (id.length === 0) {
        return;
      }

      const product = await loadProductById(id);
      setFormValue({
        _id: id,
        nombre,
        categoriaId: product.categoria._id,
        img: product.img || '',
      });
    };

    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveOrUpdate = async () => {
    if (id.length > 0) {
      updateProduct(categoriaId, nombre, id);
    } else {
      const tempCategoriaId = categoriaId || categories[0]._id;
      const newProduct = await addProduct(tempCategoriaId, nombre);
      onChange(newProduct._id, '_id');
    }
  };

  const handleDelete = async () => {
    await deleteProduct(_id);
    navigation.navigate('ProductsScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del producto:</Text>
        <TextInput
          placeholder="Producto"
          style={styles.textInput}
          value={nombre}
          onChangeText={value => onChange(value, 'nombre')}
        />
        <Text style={styles.label}>Categoría:</Text>
        <Picker
          selectedValue={categoriaId}
          onValueChange={itemValue => onChange(itemValue, 'categoriaId')}>
          {isLoading && <Picker.Item label="------" value="" />}
          {categories.map(category => (
            <Picker.Item
              label={category.nombre}
              value={category._id}
              key={category._id}
            />
          ))}
        </Picker>
        <Button title="Guardar" onPress={saveOrUpdate} color="#5856D6" />
        {_id.length > 0 && user?.rol === 'ADMIN_ROLE' && (
          <View style={styles.deleteContainer}>
            <Button title="Eliminar" onPress={handleDelete} color="#d65656" />
          </View>
        )}
        {_id.length > 0 && (
          <View style={styles.actions}>
            <Button title="Cámara" onPress={() => {}} color="#5856D6" />
            <View style={styles.spaceButtons} />
            <Button title="Galería" onPress={() => {}} color="#5856D6" />
          </View>
        )}
        {img.length > 0 && <Image source={{uri: img}} style={styles.img} />}
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
  img: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
  deleteContainer: {
    marginTop: 12,
  },
});
