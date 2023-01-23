import { StyleSheet, Text } from 'react-native';
import Styling from '../config/Styling';

export default ({style, type, children, bold, semibold, ...rest}) => {
    const styling = [
        styles.text,
        type === 'smallest' && styles.smallest,
        type === 'small' && styles.small,
        type === 'h1' && styles.h1,
        type === 'h2' && styles.h2,
        !!bold && styles.bold,
        !!semibold && styles.semibold,
        !!rest.onPress && styles.link,
        style,
    ];

    return (
        <Text {...rest} style={styling}>{children}</Text>
    );
}

const styles = StyleSheet.create({
    text: {
        color: Styling.font.color,
        fontSize: Styling.font.regular,
        textAlign: 'left',
        lineHeight: Styling.font.regular * 1.2,
    },
    smallest: {
        fontSize: Styling.font.smallest,        
        lineHeight: Styling.font.smallest * 1.2,
    },
    small: {
        fontSize: Styling.font.small,        
        lineHeight: Styling.font.small * 1.2,
    },
    h1: {
        fontSize: Styling.font.large,        
        lineHeight: Styling.font.large * 1.2,
        paddingBottom: Styling.space.medium,
        fontWeight: 600,
    },
    h2: {
        fontSize: Styling.font.medium,        
        lineHeight: Styling.font.medium * 1.2,
        paddingBottom: Styling.space.medium,
        fontWeight: 600,
    },
    link: {
        color: Styling.color.link,
        fontWeight: 600,
    },
    bold: {
        fontWeight: 700,
    },
    semibold: {
        fontWeight: 600,
    },
});
