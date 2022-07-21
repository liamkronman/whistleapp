import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, TextInput, Dimensions } from 'react-native'; 
import { useSelector, useDispatch } from 'react-redux';
import { selectContext, setContext, selectIsSuccessful } from '../redux/slices/publishSlice';

const PublishTwo = ({ navigation }) => {
    const dispatch = useDispatch();
    const storedContext = useSelector(selectContext);
    const isSuccessful = useSelector(selectIsSuccessful);

    const [context, updateContext] = React.useState("");

    React.useEffect(() => {
        if (storedContext)
            updateContext(storedContext);
    }, []);

    const handlePreviousPress = () => {
        const info = {
            context
        };
        dispatch(setContext(info));
        navigation.pop();
    }

    const handleNextPress = () => {
        if (context) {
            const info = {
                context
            };
            dispatch(setContext(info));
            navigation.navigate('PublishThree');
        }
    }

    React.useEffect(() => {
        if (isSuccessful) {
            updateContext("");
        }
    }, [isSuccessful]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={{ width: 353, height: Dimensions.get('window').height - 500, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={styles.btn} onPress={handlePreviousPress}>Previous</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={styles.pageCounter}>(2/4)</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={styles.btn} onPress={handleNextPress}>Next</Text>
                        </View>
                    </View>
                    <View style={{ flex: 4, alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.inputTitle}>
                                Story
                            </Text>
                        </View>
                        <View style={{ flex: 10 }}>
                            <TextInput multiline={true} value={context} placeholderTextColor="#9D9D9D" style={styles.contextInput} onChangeText={updateContext} placeholder="Describe the context of your situation." autoFocus={true} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default PublishTwo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ECEEFF',
    },
    inputTitle: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18,
        color: '#2C65F6'
    },
    contextInput: {
        backgroundColor: '#D8E5FF',
        color: 'black',
        width: 353,
        height: 300,
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        borderRadius: 8,
        padding: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    btn: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 20,
        color: '#2C65F6',
        textDecorationLine: 'underline'
    },
    pageCounter: {
        color: '#8CA9F2',
        fontFamily: 'WorkSans-Medium',
        fontSize: 16
    },
});