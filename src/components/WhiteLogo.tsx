import React, {useRef} from 'react';
import {Animated, Image, StyleSheet, TouchableOpacity} from 'react-native';

export const WhiteLogo = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleTap = () => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => rotateAnim.setValue(0));
  };

  const interpolateRotating = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={handleTap} activeOpacity={0.9}>
      <Animated.View
        style={{
          ...styles.container,
          transform: [{rotate: interpolateRotating}],
        }}>
        <Image
          style={styles.image}
          source={require('../assets/react-logo-white.png')}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 110,
    height: 100,
  },
});
