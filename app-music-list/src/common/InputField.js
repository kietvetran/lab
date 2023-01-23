import { StyleSheet, TextInput, View } from 'react-native';
import Styling from '../config/Styling';

export default ({ style, inputStyle, type, textArea, label, ...rest}) => {
    const keyboardTypeOption = { number: 'numeric', email: 'email-address', decimal: 'decimal-pad' };
    return (
        <View style={[styles.root, style]}>
            <TextInput
                {...rest}
                style={[styles.input, inputStyle]}
                keyboardType={keyboardTypeOption[type]}
                autoCorrect={false}
                placeholderTextColor={Styling.color.placeholder}
                underlineColorAndroid="transparent"
                numberOfLines={textArea ? 3 : undefined}
                multiline={!!textArea}
                accessibilityLabel={label}
                maxFontSizeMultiplier={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        position: 'relative',
    },
    input: {
        padding: Styling.space.smallest + 2,
        color: Styling.font.color,
        fontSize: Styling.font.regular,
        textAlign: 'left',
        lineHeight: Styling.font.regular * 1.2,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Styling.border.color,
        borderRadius: Styling.border.radius,
    },
});
