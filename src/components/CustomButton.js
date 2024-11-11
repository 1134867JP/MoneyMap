import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: defaultWidth } = Dimensions.get('window');

const CustomButton = ({
  label,
  onPress,
  width = defaultWidth * 0.85,
  height = 50,
  style,
  gradientColors = ['#4960F9', '#4033FF'],
  textColor = '#FFF',
  iconColor = '#FFF',
  startGradient = { x: 0, y: 0 },
  endGradient = { x: 1, y: 1 },
}) => {
  return (
    <TouchableOpacity style={[styles.button, style, { width, height }]} onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        start={startGradient}
        end={endGradient}
        style={[styles.gradientButton, { borderRadius: height / 2 }]} // Aplica o borderRadius com base na altura
      >
        <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>

        {/* Elipses decorativas dentro do botão */}
        <View style={styles.shapesButton}>
          <LinearGradient
            colors={['#5264F9', '#3AF9EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ellipseButton, styles.ellipse7Button]}
          />
          <LinearGradient
            colors={['rgba(248, 47, 216, 0.52)', '#F82FD8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ellipseButton, styles.ellipse6Button]}
          />
        </View>

        {/* Ícone de seta */}
        <Icon name="arrow-forward" size={25} color={iconColor} style={styles.iconArrow} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    borderRadius: 30,  
    overflow: 'hidden',
  }, 
  gradientButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 15,
    width: '80%',
    zIndex: 2,
  },
  shapesButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  ellipseButton: {
    position: 'absolute',
    width: 144,
    height: 144,
    borderRadius: 72,
  },
  ellipse7Button: {
    top: -110,
    right: -40,
  },
  ellipse6Button: {
    top: -90,
    right: -80,
  },
  iconArrow: {
    marginLeft: 10,
  },
});