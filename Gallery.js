import React, { useRef, useState } from 'react';
import { View, FlatList, Image, Animated, StyleSheet, Dimensions, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

const images = [
    require('./assets/sample1.jpg'),
    require('./assets/sample2.jpg'),
    require('./assets/sample3.jpg'),
];

const screenWidth = Dimensions.get('window').width;

const SimplePage = () => {
    const [activePointers, setActivePointers] = useState(0);
    const scales = images.map(() => useRef(new Animated.Value(1)).current);

    const onPinchGestureEvent = (index) => Animated.event(
        [
            {
                nativeEvent: {
                    scale: scales[index],
                },
            },
        ],
        {
            useNativeDriver: false,
            listener: (event) => {
                setActivePointers(event.nativeEvent.numberOfPointers);
            },
        }
    );

    const onPinchStateChange = (index, event) => {
        const numberOfPointers = event.nativeEvent.numberOfPointers;

        if (event.nativeEvent.oldState === State.ACTIVE) {
            Animated.spring(scales[index], {
                toValue: 1,
                useNativeDriver: false,
            }).start();
        }
        setActivePointers(numberOfPointers);
    };

    const renderItem = ({ item, index }) => {
        const dynamicStyles = {
            transform: [{ scale: scales[index] }],
        };

        return (
            <View>
                <PinchGestureHandler
                    onGestureEvent={onPinchGestureEvent(index)}
                    onHandlerStateChange={(event) => onPinchStateChange(index, event)}
                >
                    <Animated.View style={dynamicStyles}>
                        <Image source={item} style={[styles.image, index === 0 && { borderColor: 'black', borderWidth: 3, zIndex: 999999 }]} />
                    </Animated.View>
                </PinchGestureHandler>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={images}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={1}
                scrollEnabled={activePointers <= 1}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: screenWidth,
        height: screenWidth,
        resizeMode: 'contain',
        marginBottom: 10,
        borderColor: 'yellow',
        borderWidth: 2
    },
});

export default SimplePage;
