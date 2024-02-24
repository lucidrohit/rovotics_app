import { useEffect } from 'react';
import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
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
                position.value = { x, y }
                runOnJS(props.onMove)(position.value);

            } else {
                position.value = { x: translationX, y: translationY }
                runOnJS(props.onMove)(position.value);

            }

        });

    const panMoveStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: position.value.x },
            { translateY: position.value.y },
        ],
    }))


    return (
        <View style={{ width: JOYSTICK_RADIUS, height: JOYSTICK_RADIUS }} className='bg-black rounded-full items-center justify-center ' >
            <GestureDetector gesture={pan} >
                <Animated.View style={[{ width: BALL_RADIUS, height: BALL_RADIUS }, panMoveStyle]} className='bg-red-500 z-10 rounded-full' />
            </GestureDetector>
        </View>
    )
}


type JoyStickProps = {
    onMove: (position:JoyStickPosition) => void;
    steeringMode: boolean;
}