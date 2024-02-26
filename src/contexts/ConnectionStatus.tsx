import { createContext, useContext, useEffect, useRef, useState } from "react";
import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location';
import { useToast } from "react-native-toast-notifications";

const ConnectionStatus = createContext({
    connectionStatus:false,
    sendMSG:(msg:string)=>{}
});


function ConnectionStatusProvider({ children }: React.PropsWithChildren) {
    const [connected, setConnected] = useState(false);
    const [locationPermission, setLocationPermission] = useState(false);
    const toast = useToast()
    const ws = useRef<WebSocket>(new WebSocket("ws://192.168.4.1:81"));

    // location permission
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationPermission(false)
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocationPermission(true);
        })();
    }, []);

    // if location permission then check esp8266 is connected or not
    useEffect(() => {
        if (locationPermission && !connected) {
            const toastId = toast.show("Checking for ESP8266 wifi network...",{
                type:"info",
            })
            const unsubscribe = NetInfo.addEventListener(state => {
                // @ts-ignore
                const ssid: string = state.details.ssid

                if (state.isWifiEnabled && ssid === "ESP8266" && state.type==="wifi") {
                    toast.update(toastId,"Connected to ESP8266 wifi network", {
                        type: "success",
                    })
                    setConnected(true);
                } else {
                    setConnected(false)
                    toast.update(toastId, "Please connect to the ESP8266 wifi network", {
                        type: "error",
                    })
                }
            });
            return () => {
                unsubscribe();
                toast.hide(toastId)
            }
        } else {
            console.log("permission denied")
        }
    }, [locationPermission, toast])

    useEffect(() => {
        if(!connected){
            ws.current = new WebSocket("ws://192.168.4.1:81");
        }
    }, [connected])

    useEffect(() => {
        ws.current.onopen = () => {
            setConnected(true);
            toast.show("WebSocket connection established", { type: "success" });
        };
    
        ws.current.onerror = (error) => {
            setConnected(false);
            toast.show("WebSocket connection error", { type: "error" });
            console.log("WebSocket Error:", error);
        };
    
        ws.current.onclose = (e) => {
            setConnected(false);
            toast.show("WebSocket connection closed", { type: "error" });
        };
    
        return () => {
            ws.current.close();
        };
    }, []);


    
    function sendMSG(msg:string){
        if(!connected) return;
        try {
            ws.current.send(msg)
        } catch (error) {
           console.log("Error:", error)
        }
    }


    return (
        <ConnectionStatus.Provider value={{connectionStatus:connected,sendMSG}}>
            {children}
        </ConnectionStatus.Provider>
    )
}

function useConnectionStatus() {
    return useContext(ConnectionStatus);
}

export default ConnectionStatusProvider;
export { useConnectionStatus }