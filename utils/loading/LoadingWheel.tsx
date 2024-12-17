import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

export const LoadingWheel = () => {
  return (
    <View style={[[styles.container, styles.horizontal]]}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginTop: 100,
  },
});
export default LoadingWheel;
