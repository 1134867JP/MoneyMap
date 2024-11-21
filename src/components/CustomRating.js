import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomRating = ({
  count = 5,
  defaultRating = 0,
  size = 20,
  onFinishRating = () => {},
  starContainerStyle = {},
}) => {
  const [rating, setRating] = useState(defaultRating);

  const handlePress = (newRating) => {
    setRating(newRating);
    onFinishRating(newRating);
  };

  return (
    <View style={[{ flexDirection: 'row' }, starContainerStyle]}>
      {[...Array(count)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <TouchableOpacity key={index} onPress={() => handlePress(starNumber)}>
            <Icon
              name={starNumber <= rating ? 'star' : 'star-border'}
              size={size}
              color="#FFD700"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomRating;