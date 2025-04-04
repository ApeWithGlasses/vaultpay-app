import { StyleSheet, Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Main() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top , paddingBottom: insets.bottom }}>
      <Text>VaultPay App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  
});
