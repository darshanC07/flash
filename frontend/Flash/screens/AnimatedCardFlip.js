import React, { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

const AnimatedCardFlip = () => {
  const [isFlipped, setIsFlipped] = useState(false); // state of card
  const flipAnimation = useRef(new Animated.Value(0)).current // animated value for flip animation

  // front card rotation
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const flipToFrontStyle = {
    transform: [{rotateY: frontInterpolate}]
  };

  // back card rotation
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipToBackStyle = {
    transform: [{rotateY: backInterpolate}]
  };

  // card flip animation
  const flipCard = () => {
    if(isFlipped) {
      // animate back to the front side
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      // animate to the back side
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  // card ui
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={flipCard}>
        <View style={styles.cardContainer}>
          <Animated.View style={[styles.front, styles.card, flipToFrontStyle]}>
            <Text style={styles.text}>Front Side</Text>
          </Animated.View>
          <Animated.View style={[styles.back, styles.card, flipToBackStyle]}>
            <Text style={styles.text}>Back Side</Text>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 25,
  },
  cardContainer: {
    width: width - 50,
    height: height / 4,
  },
  front: {
    backgroundColor: '#092635',
  },
  back: {
    backgroundColor: '#5C8374',
  },
  card: {
    width: width - 50,
    height: height / 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  text: {
    color: '#FFFFDD',
    fontSize: 18,
  },
});

export default AnimatedCardFlip;