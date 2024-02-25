import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { JoyStickPosition } from '../screens/MainScreen';
import { useEffect } from 'react';
import { BALL_RADIUS,  JOYSTICK_RADIUS} from '../utils/constants';


function JoyStick(props: JoyStickProps) {
    const position = useSharedValue({ x: 0, y: 0 });
    const sw = useSharedValue(props.steeringMode?{w:1.2*BALL_RADIUS,h:1.6*JOYSTICK_RADIUS}:{w:JOYSTICK_RADIUS,h:JOYSTICK_RADIUS});

    const pan = Gesture.Pan()
        .onTouchesUp(() => {
            position.value = withSpring({x:0,y:0}, { damping: 20, stiffness: 100 })
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

        })
    const panMoveStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: position.value.x },
            { translateY: position.value.y },
        ],
    }))

    const steeringModeStyle = useAnimatedStyle(() => ({
        height: sw.value.h,
        width: sw.value.w ,
    }))

    useEffect(()=>{
        if(props.steeringMode){
            sw.value = withTiming({w:1.2*BALL_RADIUS,h:1.6*JOYSTICK_RADIUS})
        }else{
            sw.value = withTiming({w:JOYSTICK_RADIUS,h:JOYSTICK_RADIUS})
        }
    },[props.steeringMode])

    return (
       <View className='rounded-full items-center justify-center self-end' style={{width:JOYSTICK_RADIUS,height:1.6*JOYSTICK_RADIUS}}>
         <Animated.View style={[steeringModeStyle]} className=' bg-black rounded-full items-center justify-center ' >
            <GestureDetector gesture={pan} >
                <Animated.View style={[{ width: BALL_RADIUS, height: BALL_RADIUS }, panMoveStyle]} className='bg-red-500 z-10 rounded-full' />
            </GestureDetector>
        </Animated.View>
       </View>
    )
}


type JoyStickProps = {
    onMove: (position: JoyStickPosition) => void;
    steeringMode: boolean;
};

export default JoyStick;