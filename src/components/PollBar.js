import React from 'react';
import { Animated } from 'react-native'

const PollBar = (props) => {
    const heightAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(
            heightAnim,
            {
                toValue: 350 * props.percent,
                duration: 1000,
                useNativeDriver: false,
            }
        ).start();
    }, [heightAnim])

    return (
        <Animated.View style={{...props.style, height: heightAnim}}>
            {props.children}
        </Animated.View>
    )
}

export default PollBar;