import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { JoyStickPosition } from '../screens/MainScreen';

const JOYSTICK_RADIUS = 170;
const BALL_RADIUS = 60;

export default function JoyStick(props: JoyStickProps) {
    const position = useSharedValue({ x: 0, y: 0 });

    const pan = Gesture.Pan()
        .onTouchesUp(() => {
            let transX = withSpring(0, { damping: 20, stiffness: 100 });
            let transY = withSpring(0, { damping: 20, stiffness: 100 });
            position.value = { x: transX, y: transY };
            runOnJS(props.onMove)({ x: 0, y: 0});
        })
        .onUpdate(({ translationX, translationY }) => {
            const distanceTravelledByBall = Math.sqrt(Math.pow(translationX, 2) + Math.pow(translationY, 2))

            if (distanceTravelledByBall > JOYSTICK_RADIUS / 2) {
                const angle = Math.atan2(translationY, translationX);
                const x = Math.cos(angle) * JOYSTICK_RADIUS / 2;
                const y = Math.sin(angle) * JOYSTICK_RADIUS / 2;
                position.value = { x:props.steeringMode?0:x, y }
                runOnJS(props.onMove)(position.value);

            } else {
                position.value = { x: props.steeringMode?0:translationX, y: translationY }
                runOnJS(props.onMove)(position.value);

            }

        });

    const panMoveStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: position.value.x },
            { translateY: position.value.y },
        ],
    }))

    const steeringModeStyle = useAnimatedStyle(() => ({
        height: props.steeringMode ? 1.5*JOYSTICK_RADIUS:JOYSTICK_RADIUS ,
        width: props.steeringMode ? 1.2*BALL_RADIUS:JOYSTICK_RADIUS ,
        backgroundColor: props.steeringMode ? 'black' : 'green',
    }))

    return (
       <View className='rounded-full items-center justify-center ' style={{width:JOYSTICK_RADIUS,height:JOYSTICK_RADIUS}}>
         <Animated.View style={[steeringModeStyle]} className=' rounded-full items-center justify-center ' >
            <GestureDetector gesture={pan} >
                <Animated.View style={[{ width: BALL_RADIUS, height: BALL_RADIUS }, panMoveStyle]} className='bg-red-500 z-10 rounded-full' />
            </GestureDetector>
        </Animated.View>
       </View>
    )
}


type JoyStickProps = {
    onMove: (position:JoyStickPosition) => void;
    steeringMode: boolean;
}