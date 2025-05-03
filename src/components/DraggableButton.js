import { useRef, useEffect, useCallback } from 'react';
import { Dimensions } from 'react-native';
import { PanResponder } from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  ReduceMotion,
} from 'react-native-reanimated';

const INITIAL_POSITION = "initial-position";
const NONE = "none";
const CLOSEST_AXIS_X = "closest-axis-x";
const CLOSEST_AXIS_Y = "closest-axis-y";
const CLOSEST_AXIS = "closest-axis";

export const DraggableButton = ({
  onArrangeEnd = null,
  onArrangeInit = null,
  gesture = null,
  scaleCustomConfig = null,
  dragCustomConfig = null,
  returnCustomSpringConfig = null,
  returnMode = INITIAL_POSITION,
  initialPosition,
  children,
  canMove = true,
  blockDragX = false,
  blockDragY = false,
  animateButton = false,
  maxDistance = 0,
  minDistance = 0,
  style = {},
}) => {

  const { width, height } = Dimensions.get('window');

  const initialPositionRef = useRef({ x: initialPosition.x, y: initialPosition.y });

  const position = {
    x: useSharedValue(initialPosition.x),
    y: useSharedValue(initialPosition.y)
  };

  // Sync the internal position with the initial position prop
  useEffect(() => {
    initialPositionRef.current = { x: initialPosition.x, y: initialPosition.y };
    position.x.value = withSpring(initialPosition.x, dragSpringConfig);
    position.y.value = withSpring(initialPosition.y, dragSpringConfig);
  }, [initialPosition]);

  const scale = useSharedValue(1);

  const dimensions = useRef({ width: 0, height: 0 });

  const returnSpringConfig = returnCustomSpringConfig || {
    duration: 1000,
    dampingRatio: 0.7,
    stiffness: 100,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
    reduceMotion: ReduceMotion.System,
  };

  const dragSpringConfig = dragCustomConfig || {
    duration: 150,
    dampingRatio: 0.7,
    stiffness: 100,
  };

  const scaleSpringConfig = scaleCustomConfig || {
    duration: 150,
    dampingRatio: 0.7,
    stiffness: 100,
  };

  /* Pan responder and drag handlers */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderStart: (_, gestureState) => {
        if (!!onArrangeInit)
          onArrangeInit();
      },
      onPanResponderMove: (_, gestureState) => {
        if (canMove)
          onDrag(gestureState);
      },
      onPanResponderRelease: (_, gestureState) => {
        onDragRelease(gestureState);
      },
    })
  ).current;

  const getNewPosition = useCallback((gestureState) => {
    const { moveX, moveY, dx, dy } = gestureState;
    const { width, height } = dimensions.current;
    let result = { x: moveX - (width * scale.value) / 2, y: moveY - (height * scale.value) / 2 };

    if (maxDistance !== 0) {
      // Calculate the distance from the initial position
      const distanceX = result.x - initialPositionRef.current.x;
      const distanceY = result.y - initialPositionRef.current.y;

      // Limit the movement in the x direction
      if (Math.abs(distanceX) > maxDistance) {
        result.x = initialPositionRef.current.x + (distanceX > 0 ? maxDistance : -maxDistance);
      }

      // Limit the movement in the y direction
      if (Math.abs(distanceY) > maxDistance) {
        result.y = initialPositionRef.current.y + (distanceY > 0 ? maxDistance : -maxDistance);
      }
    }

    return result;
  }, [dimensions, maxDistance, scale]);

  // handle drag function
  const onDrag = useCallback((gestureState) => {
    if (scale.value === 1.0 && animateButton)
      scale.value = withSpring(1.5, scaleSpringConfig);

    const newPos = getNewPosition(gestureState);
    if (!blockDragX)
      position.x.value = withSpring(newPos.x, dragSpringConfig);
    if (!blockDragY)
      position.y.value = withSpring(newPos.y, dragSpringConfig);
  }, [position, getNewPosition, scale, animateButton, blockDragX, blockDragY, scaleSpringConfig]);

  // end drag function
  const onDragRelease = useCallback((gestureState) => {
    // send signal to create new object in panel
    const newPos = getNewPosition(gestureState);

    let movedEnough = minDistance == 0;

    // Check if the new position is different enough from the initial position
    if (minDistance !== 0) {
      // Calculate the distance from the initial position
      const distanceX = Math.abs(position.x.value) - Math.abs(initialPositionRef.current.x);
      const distanceY = Math.abs(position.y.value) - Math.abs(initialPositionRef.current.y);
      // Limit the movement in the direction
      // console.log("DistanceX", distanceX, "DistanceY", distanceY, "MinLimitDistance", minLimitDistance);
      movedEnough = Math.abs(distanceX) > minDistance || Math.abs(distanceY) > minDistance;
    }

    // if moved enough, call onArrangeEnd function
    if (!!onArrangeEnd && movedEnough)
      onArrangeEnd(newPos.x, newPos.y);

    // Reset position
    if (returnMode === INITIAL_POSITION) {
      position.x.value = withSpring(initialPositionRef.current.x, returnSpringConfig);
      position.y.value = withSpring(initialPositionRef.current.y, returnSpringConfig);
    }
    else if (returnMode === NONE) {
      // do nothing
    }
    if (returnMode === CLOSEST_AXIS_X) {
      // return to the closes border window in x axis and preserve y axis
      // calc the distance to check if the button is closer to 0 or width
      if (position.x.value > width / 2) {
        position.x.value = withSpring(width - dimensions.current.width, returnSpringConfig);
      }
      else {
        position.x.value = withSpring(0, returnSpringConfig);
      }
    }
    if (returnMode === CLOSEST_AXIS_Y) {
      // return to the closes border window in y axis and preserve x axis
      // calc the distance to check if the button is closer to 0 or height
      if (position.y.value > height / 2) {
        position.y.value = withSpring(height - dimensions.current.height, returnSpringConfig);
      }
      else {
        position.y.value = withSpring(0, returnSpringConfig);
      }
    }
    if (returnMode === CLOSEST_AXIS) {
      // return the closest border window in x or y axis, will go only to the closest axis
      // calc the distance to check if the button is closer to 0 or width
      // calc diff among 0 and position x
      let x0 = Math.abs(position.x.value);
      let x1 = Math.abs(width - dimensions.current.width - position.x.value);
      let y0 = Math.abs(position.y.value);
      let y1 = Math.abs(height - dimensions.current.height - position.y.value);
      // the lowest distance will be the closest axis
      let xDistance = Math.min(x0, x1);
      let yDistance = Math.min(y0, y1);
      if (xDistance < yDistance) {
        // return to the closes border window in x axis and preserve y axis
        if (position.x.value > width / 2) {
          position.x.value = withSpring(width - dimensions.current.width, returnSpringConfig);
        }
        else {
          position.x.value = withSpring(0, returnSpringConfig);
        }
      }
      else {
        // return to the closes border window in y axis and preserve x axis
        if (position.y.value > height / 2) {
          position.y.value = withSpring(height - dimensions.current.height, returnSpringConfig);
        }
        else {
          position.y.value = withSpring(0, returnSpringConfig);
        }
      }
    }
    // Reset scale
    if (animateButton)
      scale.value = withSpring(1, scaleSpringConfig);
  }, [position, getNewPosition, initialPositionRef, maxDistance, onArrangeEnd, animateButton, returnSpringConfig, scaleSpringConfig]);

  // animated style
  const dragAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position?.x.value },
      { translateY: position?.y.value },
      { scaleX: scale.value },
      { scaleY: scale.value },
    ],
    position: 'absolute',
  }));

  return (
    <Animated.View
      style={[dragAnimatedStyle, style]}
      {...panResponder.panHandlers}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        dimensions.current = { width, height };
      }}>
      {/* tap gesture */}
      {!!gesture && (
        <GestureHandlerRootView>
          <GestureDetector
            gesture={gesture}
            style={[{ position: "absolute" }]}>
            {children}
          </GestureDetector>
        </GestureHandlerRootView>
      )}
      {/* non tap gesture */}
      {!gesture && children}
    </Animated.View>
  );
};
