import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Styling from './src/config/Styling';
import Styleguide from './src/component/Styleguide';

export default function App() {
    return (
        <View style={styles.container}>
            <Styleguide />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Styling.color.appBg,
    },
});
