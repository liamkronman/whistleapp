import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Button, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../redux/slices/authSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import PublishTwo from './PublishTwo';

import axios from "axios";

const PublishOne = ({ navigation }) => {
    const [title, updateTitle] = React.useState("");
    const [background, updateBackground] = React.useState("");
    const [context, updateContext] = React.useState("");
    const [option1, updateOption1] = React.useState("");
    const [option2, updateOption2] = React.useState("");

    const [date, setDate] = React.useState(new Date(1598051730000));
    const [mode, setMode] = React.useState('date');
    const [show, setShow] = React.useState(false);

    const [isLoading, updateIsLoading] = React.useState(false);
    const [message, updateMessage] = React.useState("");
    const [isSuccessful, updateIsSuccessful] = React.useState(false);
    
    const jwtToken = useSelector(selectAccessToken);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    }

    const showDatepicker = () => {
        showMode('date');
    }

    const showTimepicker = () => {
        showMode('time');
    }

    const handlePublish = () => {
        if (title && background && context && option1 && option2 && date) {
            updateMessage("");
            updateIsLoading(true);
            axios.post("https://trywhistle.app/api/app/makewhistle", 
            {
                "title": title,
                "background": background,
                "context": context,
                "options": {
                    option1: 0, 
                    option2: 0,
                },
                "closeDateTime": date,
            },
            {
                headers: {
                    "x-access-token": jwtToken
                }
            })
            .then(resp => {
                updateIsSuccessful(true);
            })
            .catch(err => {
                updateMessage(err);
            });
        } else {
            updateMessage("All fields must be filled to blow a Whistle.")
        }
    }

    return (
        <>
            {
                isSuccessful
                ? <View>
                    <Text style={styles.text}>
                        Successful posting!
                    </Text>
                </View>
                : <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.container}>
                        <View style={{ width: 353, height: Dimensions.get('window').height - 170, flexDirection: 'column' }}>
                            <View style={{ flex : 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={styles.blowAWhistle}>Blow a Whistle!</Text>
                                {
                                    message
                                    ? <Text style={styles.errorText}>{message}</Text>
                                    : <></>
                                }
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.inputTitle}>
                                        Title
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput placeholder="Something Eye-Catching" placeholderTextColor="#9D9D9D" style={styles.titleInput} value={title} onChangeText={updateTitle} />
                                </View>
                            </View>
                            
                            <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.inputTitle}>
                                        Background
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput placeholder="Age, gender, geography, etc." placeholderTextColor="#9D9D9D" style={styles.backgroundInput} value={background} onChangeText={updateBackground} />
                                </View>
                            </View>
                            <View style={{ flex: 4, alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.inputTitle}>
                                        Story
                                    </Text>
                                </View>
                                <View style={{ flex: 4 }}>
                                    <TextInput multiline={true} value={context} placeholderTextColor="#9D9D9D" style={styles.contextInput} onChangeText={updateContext} placeholder="Describe the context of your situation." />
                                </View>
                            </View>
                            <View style={{ flex: 3, alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column' }}>
                                <View style={{ flex: 0.5 }}>
                                    <Text style={styles.inputTitle}>
                                        Choices
                                    </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <TextInput style={styles.choiceInput} placeholder="Your first choice" placeholderTextColor="#9D9D9D" value={option1} onChangeText={updateOption1} />
                                </View>
                                <View style={{ flex: 2 }}>
                                    <TextInput style={styles.choiceInput} placeholder="Your second choice" placeholderTextColor="#9D9D9D" value={option2} onChangeText={updateOption2} />
                                </View>
                            </View>
                            
                            <Button onPress={() => navigation.navigate(PublishTwo)} title="Next" />
                            <Text style={styles.text}>
                                When to Expire
                            </Text>
                            <View>
                                <View>
                                    <Button onPress={showDatepicker} title="Show date picker!" />
                                </View>
                                <View>
                                    <Button onPress={showTimepicker} title="Show time picker!" />
                                </View>
                                <Text>selected: {date.toLocaleString()}</Text>
                                    <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={mode}
                                    is24Hour={true}
                                    onChange={onChangeDate}
                                    />
                            </View>
                            {
                                isLoading && !(message)
                                ? <View style={styles.btn}>
                                    <ActivityIndicator size="small" color="#ffffff" />
                                </View>
                                : <TouchableOpacity onPress={handlePublish} style={styles.btn}>
                                    <Text style={styles.btnText}>Publish</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            }
        </>
    );
}

export default PublishOne;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ECEEFF',
    },
    blowAWhistle: { 
        fontFamily: 'WorkSans-Bold', 
        fontSize: 20, 
        color: '#2C65F6'
    },
    inputTitle: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18,
        color: '#2C65F6'
    },
    titleInput: {
        backgroundColor: '#D8E5FF',
        color: 'black',
        width: 255,
        height: 37,
        textAlign: 'center',
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        borderRadius: 8,
        padding: 10,
    },
    backgroundInput: {
        backgroundColor: '#D8E5FF',
        color: 'black',
        width: 353,
        height: 37,
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        borderRadius: 8,
        padding: 10,
    },
    contextInput: {
        backgroundColor: '#D8E5FF',
        color: 'black',
        width: 353,
        height: 235,
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        borderRadius: 8,
        padding: 10,
        paddingTop: 10,
        paddingBottom: 10,
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
    // btn: {
    //     backgroundColor: 'blue',
    //     paddingHorizontal: 50,
    //     paddingVertical: 10,
    //     borderRadius: 10
    // },
    // text: {
    //     color: 'black',
    //     fontSize: 20
    // },
    // btnText: {
    //     color: 'white',
    //     fontSize: 20
    // },
    errorText: {
        color: 'red',
        fontSize: 20,
        fontFamily: 'WorkSans-Medium'
    },
})