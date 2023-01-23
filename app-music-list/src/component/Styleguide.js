import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import TextView from '../common/TextView';
import InputField from '../common/InputField';
import Styling from '../config/Styling';

export default () => {
    const [content, setContent] = useState([{
        name: 'Color',
        detail: [
            <View style={[styles.colorItem, {backgroundColor: Styling.color.primary }]}><TextView>Primary</TextView></View>,
            <View style={[styles.colorItem, {backgroundColor: Styling.color.secondary }]}><TextView>Secondary</TextView></View>,
            <View style={[styles.colorItem, {backgroundColor: Styling.color.info }]}><TextView>Info</TextView></View>,
            <View style={[styles.colorItem, {backgroundColor: Styling.color.warning }]}><TextView>Warning</TextView></View>,
            <View style={[styles.colorItem, {backgroundColor: Styling.color.error }]}><TextView>Error</TextView></View>,
        ]
    }, {
        name: 'Typography',
        detail: [
            <TextView type="smallest">Smallest - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</TextView>,
            <TextView type="small">Small - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</TextView>,
            <TextView type="regular">Regular - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</TextView>,
            <TextView type="h1">H1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</TextView>,
            <TextView type="h2">H2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</TextView>,
            <TextView onPress={() => { console.log('== CLICK =='); }}>Link</TextView>,
        ],
    }, {
        name: 'Input',
        detail: [
            <InputField placeholder="Placeholder" />
        ],
    }, {
        name: 'Button',
        detailRow: true,
        detail: [
            <InputField placeholder="Placeholder" />
        ],
    }]);

    return (
        <ScrollView style={styles.root}>

            { content.map((cnt) => (
                <View key={`${cnt.name}`} style={styles.content}>
                    <TextView type='h2'>{cnt.name}</TextView>
                    { cnt.detail.map( (data, i) => (
                        <View key={`${cnt.name}-${i}`} style={{paddingBottom: Styling.space.small}}>{data}</View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Styling.space.large,
        paddingBottom: Styling.space.large,
    },
    content: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Styling.border.color,
        marginBottom: -1,
        ...Styling.wrapper,
    },
    colorItem: {
        padding: Styling.space.smallest,
        borderRadius: Styling.border.radius,
        marginBottom: Styling.space.smallest,
    },
});
