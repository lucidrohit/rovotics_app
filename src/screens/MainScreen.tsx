import { View ,Text} from 'react-native'
import JoyStick from '../components/JoyStick'
import { useEffect, useState } from 'react';
import useDebouncedState from '../hooks/useDebouncedState';
import { useConnectionStatus } from '../contexts/ConnectionStatus';

export type JoyStickPosition = {
    x: number;
    y: number;
}

export default function MainScreen() {
    const [position, setPosition] = useDebouncedState<JoyStickPosition>({ x: 0, y: 0 });

    useEffect(()=>{
        console.log(position)
    },[position])

    return (
        <View className='bg-white p-4 relative h-full '>
            <ConnectionStatusIndicator/>
            <View className='absolute bottom-16 left-16 '>
                <JoyStick onMove={(position:JoyStickPosition)=>setPosition(position)} steeringMode={true} />
            </View>
        </View>
    )
}

function ConnectionStatusIndicator(){
    const {connectionStatus} = useConnectionStatus()
    return <View className={`self-end w-3 h-3 ${connectionStatus?"bg-green-500":"bg-red-500"}  rounded-full`}/>
    
}