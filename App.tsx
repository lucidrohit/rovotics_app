import "./global.css"
import { SafeAreaView } from 'react-native';
import useAppInit from './src/hooks/useAppInit';
import ConnectionStatusProvider from './src/contexts/ConnectionStatus';
import { ToastProvider } from 'react-native-toast-notifications'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MainScreen from "./src/screens/MainScreen";

export default function App() {
  useAppInit();

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <ToastProvider placement='top'>
          <ConnectionStatusProvider>
            <MainScreen />
          </ConnectionStatusProvider>
        </ToastProvider>
      </SafeAreaView>
    </GestureHandlerRootView>

  );
}
