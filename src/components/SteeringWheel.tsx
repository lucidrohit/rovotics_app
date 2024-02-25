import SteeringWheelIcon from "./../assets/wheel.svg";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const STEERINGWHEEL_RADIUS = 250;


export default function SteeringWheel(props: SteeringWheelProps) {
  const rotationValue = useSharedValue(0);
  const beginRotationValue = useSharedValue(0);


  const pan = Gesture.Pan()
    .onTouchesUp(() => {
      rotationValue.value = withSpring(0, { damping: 20, stiffness: 100 });
    })
    .onUpdate(({ y, x }) => {
      const coordX = x - STEERINGWHEEL_RADIUS / 2;
      const coordY = STEERINGWHEEL_RADIUS / 2 - y;

      function getAngle(coordY: number, coordX: number) {
        const angle = Math.atan(Math.abs(coordY / coordX));
        
        if (coordX > 0 && coordY > 0) {
          return angle
        } else if (coordX < 0 && coordY > 0) {
          return Math.PI - angle
        } else if (coordX < 0 && coordY < 0) {
          return Math.PI + angle
        } else {
          return 2 * Math.PI - angle
        }
      }

      const newRotationValue = getAngle(coordY, coordX);

      let delta = beginRotationValue.value - newRotationValue

      const isBeginingInFirstQuadrant = beginRotationValue.value>=0  && beginRotationValue.value<Math.PI/2
      const isRotationValueInFourthQuadrant = newRotationValue>3*Math.PI/2 && newRotationValue<2*Math.PI
      
      if( isBeginingInFirstQuadrant && isRotationValueInFourthQuadrant){
        delta = 2*Math.PI + delta
      }

      const isBeginingInFourthQuadrant = beginRotationValue.value>3*Math.PI/2  && beginRotationValue.value<2*Math.PI
      const isRotationValueInFirstQuadrant = newRotationValue>=0 && newRotationValue<Math.PI/2

      if( isBeginingInFourthQuadrant && isRotationValueInFirstQuadrant){
        delta = -2*Math.PI + delta
      }

      rotationValue.value = withSpring(delta, { damping: 20, stiffness: 100 })
      runOnJS(props.onMove)(delta);


    })
    .onBegin(({ y, x }) => {
      const coordX = x - STEERINGWHEEL_RADIUS / 2;
      const coordY = STEERINGWHEEL_RADIUS / 2 - y;

      function getAngle(coordY: number, coordX: number) {
        const angle = Math.atan(Math.abs(coordY / coordX));
        
        if (coordX > 0 && coordY > 0) {
          return angle
        } else if (coordX < 0 && coordY > 0) {
          return Math.PI - angle
        } else if (coordX < 0 && coordY < 0) {
          return Math.PI + angle
        } else {
          return 2 * Math.PI - angle
        }
      }

      beginRotationValue.value = getAngle(coordY, coordX);
    })


  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotationValue.value}rad` }],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[rotationStyle]}>
        <SteeringWheelIcon
          width={STEERINGWHEEL_RADIUS}
          height={STEERINGWHEEL_RADIUS}
        />
      </Animated.View>
    </GestureDetector>
  );
}

type SteeringWheelProps = {
  onMove: (angle: number) => void;
};
