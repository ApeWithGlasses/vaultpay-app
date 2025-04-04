import '../global.css';

import { StyleSheet, Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Main() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top , paddingBottom: insets.bottom }}>
      <Text className='text-2xl font-bold'>VaultPay App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  
});
