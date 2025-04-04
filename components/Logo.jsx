import { View, Image} from 'react-native';

export function Logo() {
    return (
        <View className="w-48 h-48 mb-8 items-center justify-center">
            <Image
                style={{ width: 194, height: 211 }}
                source={{ uri: 'https://res.cloudinary.com/dtux0itp7/image/upload/c_scale,w_194/v1743572482/VaultPay_Logo_vilmix.png' }}
                resizeMode="center"
            />
        </View>
    );
} 