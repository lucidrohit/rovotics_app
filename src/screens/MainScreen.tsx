import { View, Text } from "react-native";
import JoyStick from "../components/JoyStick";
import { useEffect, useRef, useState } from "react";
import useDebouncedState from "../hooks/useDebouncedState";
import { useConnectionStatus } from "../contexts/ConnectionStatus";
import SteeringWheel from "../components/SteeringWheel";
import { useDerivedValue } from "react-native-reanimated";
import { joyStickAngle } from "../utils/maths";
import { JOYSTICK_RADIUS } from "../utils/constants";

export type JoyStickPosition = {
    x: number;
    y: number;
};

export default function MainScreen() {
    const position = useRef<JoyStickPosition>({ x: 0, y: 0 });
    const rotation = useRef<number>(0);
    const [sw, setSw] = useState(false);
    const {sendMSG} = useConnectionStatus()

    const handleJoyStickMove = (jsPos: JoyStickPosition) => {
        position.current = jsPos;
        if(!sw){
            sendMSG(`{"function": "moveAtAngle","speed": ${Math.sqrt(Math.pow(jsPos.y,2)+Math.pow(jsPos.x,2))/(JOYSTICK_RADIUS/2)},"angle": ${joyStickAngle(jsPos.x,jsPos.y)}}`)
        }else{
            sendMSG(`{"function": "moveWithAngle","speed": ${-jsPos.y/(JOYSTICK_RADIUS/2)},"angle": ${rotation.current}}`)
        }
    };

    const handleSteeringWheelMove = (swRotation: number) => {
        rotation.current = swRotation;
        if (swRotation) {
            setSw(true);
            sendMSG(`{"function": "moveWithAngle","speed": ${-position.current.y/(JOYSTICK_RADIUS/2)},"angle": ${rotation.current}}`)
        } else {
            setSw(false);
            sendMSG(`{"function": "moveAtAngle","speed": ${Math.sqrt(Math.pow(position.current.y,2)+Math.pow(position.current.x,2))/(JOYSTICK_RADIUS/2)},"angle": ${joyStickAngle(position.current.x,position.current.y)}}`)
        }
    };

    return (
        <View className="bg-white p-4 relative h-full ">
            <ConnectionStatusIndicator />
            <View className=" flex-row p-4  h-full justify-between items-end w-full ">
                <JoyStick
                    onMove={handleJoyStickMove}
                    steeringMode={sw}
                />
                <SteeringWheel onMove={handleSteeringWheelMove} />
            </View>
        </View>
    );
}

function ConnectionStatusIndicator() {
    const { connectionStatus } = useConnectionStatus();
    return (
        <View
            className={`self-end w-3 h-3 ${connectionStatus ? "bg-green-500" : "bg-red-500"
                }  rounded-full`}
        />
    );
}
