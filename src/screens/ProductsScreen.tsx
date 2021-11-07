import React, {useContext} from 'react';
import {Text, View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';

import {ProductsContext} from '../context/ProductsContext';

export const ProductsScreen = () => {
  const {products} = useContext(ProductsContext);

  // Pull to refresh

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={p => p._id}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.productName}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  productName: {
    color: 'black',
    fontSize: 20,
  },
  itemSeparator: {
    marginVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
});
