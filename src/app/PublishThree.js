import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, TextInput, Dimensions } from 'react-native'; 
import { useSelector, useDispatch } from 'react-redux';
import { selectChoices, setChoices, selectIsSuccessful } from '../redux/slices/publishSlice';

const PublishThree = ({ navigation }) => {
    const dispatch = useDispatch();
    const storedChoices = useSelector(selectChoices);
    const isSuccessful = useSelector(selectIsSuccessful);

    const [option1, updateOption1] = React.useState("");
    const [option2, updateOption2] = React.useState("");

    React.useEffect(() => {
        if (storedChoices && storedChoices.length >= 2) {
            updateOption1(storedChoices[0]);
            updateOption2(storedChoices[1]);
        }
    }, []);

    React.useEffect(() => {
        if (isSuccessful) {
            updateOption1("");
            updateOption2("");
        }
    }, [isSuccessful]);

    const handlePreviousPress = () => {
        const info = {
            choices: [option1, option2]
        };
        dispatch(setChoices(info));
        navigation.pop();
    };

    const handleNextPress = () => {
        if (option1 && option2) {
            const info = {
                choices: [option1, option2]
            };
            dispatch(setChoices(info));
            navigation.navigate('PublishFour');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={{ width: 353, height: Dimensions.get('window').height - 570, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={styles.btn} onPress={handlePreviousPress}>Previous</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={styles.pageCounter}>(3/4)</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={styles.btn} onPress={handleNextPress}>Next</Text>
                        </View>
                    </View>
                    <View style={{ flex: 3, alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column' }}>
                        <View style={{ flex: 0.5 }}>
                            <Text style={styles.inputTitle}>
                                Choices
                            </Text>
                        </View>
                        <View style={{ flex: 2 }}>
                            <TextInput style={styles.choiceInput} placeholder="Your first choice" placeholderTextColor="#9D9D9D" value={option1} onChangeText={updateOption1} autoFocus={true} />
                        </View>
                        <View style={{ flex: 2 }}>
                            <TextInput style={styles.choiceInput} placeholder="Your second choice" placeholderTextColor="#9D9D9D" value={option2} onChangeText={updateOption2} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default PublishThree;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ECEEFF',
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
    inputTitle: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18,
        color: '#2C65F6'
    },
    choiceInput: {
        color: 'black',
        width: 353,
        height: 62,
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        borderRadius: 6,
        padding: 10,
        borderColor: '#5B57FA',
        borderWidth: 1,
        textAlign: 'center'
    },
});