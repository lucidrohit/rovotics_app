import { View, Text, Button } from 'react-native'
import { useConnectionStatus } from '../contexts/ConnectionStatus'

export default function Hello() {
    const {connectionStatus, sendMSG} = useConnectionStatus()

  return (
    <View>
      <Text className='text-red-800'>{String(connectionStatus)}</Text>
      <Button title='sendAMESSGEE' onPress={()=>sendMSG(`{"function": "moveWithAngle","speed": 50,"angle": 45}`)}/>
    </View>
  )
}