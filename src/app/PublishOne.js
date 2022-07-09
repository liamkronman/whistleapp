import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Button, Dimensions, Switch } from 'react-native';
import { useSelector } from 'react-redux';
import { selectTitle, selectAnonymous, selectBackground } from '../redux/slices/publishSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import PublishTwo from './PublishTwo';

const PublishOne = ({ navigation }) => {
    const storedAnonymous = useSelector(selectAnonymous);
    const storedTitle = useSelector(selectTitle);
    const storedBackground = useSelector(selectBackground);

    const [anonymous, updateAnonymous] = React.useState(storedAnonymous);
    const [title, updateTitle] = React.useState(storedTitle);
    const [background, updateBackground] = React.useState(storedBackground);
    const [message, updateMessage] = React.useState("");

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
        height: (4.5 / 10.3) * Dimensions.get('window').height - 170,
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
    errorText: {
        color: 'red',
        fontSize: 20,
        fontFamily: 'WorkSans-Medium'
    },
})