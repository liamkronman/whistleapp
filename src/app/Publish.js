import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../redux/slices/authSlice';
import DateTimePicker from '@react-native-community/datetimepicker';

import axios from "axios";

const Publish = () => {
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
    
    const jwtToken = useSelector(selectAccessToken);

    const onChange = (event, selectedDate) => {
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
                "options": [option1, option2],
                "closeDateTime": date,
            },
            {
                headers: {
                    "x-access-token": jwtToken
                }
            })
            .then(resp => {
                console.log(resp);
            })
            .catch(err => {
                updateMessage(err);
            });
        } else {
            updateMessage("All fields must be filled to blow a Whistle.")
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Text style={{ marginBottom: 20, fontSize: 15 }}>Blow a Whistle!</Text>
                {
                    message
                    ? <Text style={styles.errorText}>{message}</Text>
                    : <></>
                }

                <Text style={styles.text}>
                    Whistle Title
                </Text> 
                <TextInput placeholder="What Should I Do About My Ex???" value={title} onChangeText={updateTitle} />

                <Text style={styles.text}>
                    Your Background
                </Text>
                <TextInput placeholder="Dated this girl for 5 years and then she brutally breaks up with me" value={background} onChangeText={updateBackground} />
                
                <Text style={styles.text}>
                    The Context
                </Text>
                <TextInput multiline={true} value={context} onChangeText={updateContext} placeholder="Your story. What should I do??" /> 
                
                <Text style={styles.text}>
                    Option #1
                </Text>
                <TextInput value={option1} onChangeText={updateOption1} placeholder="Option 1" />

                <Text style={styles.text}>
                    Option #2
                </Text>
                <TextInput value={option2} onChangeText={updateOption2} placeholder="Option 2" />

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
                    {show && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                        />
                    )}
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
        </TouchableWithoutFeedback>
    )
}

export default Publish;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    btn: {
        backgroundColor: 'blue',
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 10
    },
    text: {
        color: 'black',
        fontSize: 20
    },
    btnText: {
        color: 'white',
        fontSize: 20
    },
    errorText: {
        color: 'red',
        fontSize: 20
    },
})