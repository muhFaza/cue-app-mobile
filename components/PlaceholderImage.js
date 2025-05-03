import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderImage = ({ width, height, text = 'No Image' }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#999999',
    fontSize: 14,
  },
});

export default PlaceholderImage;