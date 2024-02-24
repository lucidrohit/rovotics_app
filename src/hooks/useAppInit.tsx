import { useLayoutEffect } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'react-native';

export default function useAppInit() {
    useLayoutEffect(()=>{
        StatusBar.setHidden(true)
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

        return () => {
            StatusBar.setHidden(false)
            ScreenOrientation.unlockAsync();
        }
    },[])
}