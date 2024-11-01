import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const MapIcon = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('MapScreen');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Svg width="37" height="34" viewBox="0 0 37 34" fill="none">
        <G clipPath="url(#clip0_93_205)">
          <Path
            d="M12.3334 25.5L1.54169 31.1667V8.49999L12.3334 2.83333M12.3334 25.5L24.6667 31.1667M12.3334 25.5V2.83333M24.6667 31.1667L35.4584 25.5V2.83333L24.6667 8.49999M24.6667 31.1667V8.49999M24.6667 8.49999L12.3334 2.83333"
            stroke="#F3F3F3"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_93_205">
            <Rect width="37" height="34" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: '5.87%',
    top: '5%',
    width: '10.86%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapIcon;