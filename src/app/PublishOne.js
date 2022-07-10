import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, Dimensions, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectTitle, selectAnonymous, selectBackground, setTitleAndBackground, selectIsSuccessful } from '../redux/slices/publishSlice';
import PublishTwo from './PublishTwo';

const PublishOne = ({ navigation }) => {
    const dispatch = useDispatch();
    const storedAnonymous = useSelector(selectAnonymous);
    const storedTitle = useSelector(selectTitle);
    const storedBackground = useSelector(selectBackground);
    const isSuccessful = useSelector(selectIsSuccessful);

    const [anonymous, updateAnonymous] = React.useState(storedAnonymous);
    const [title, updateTitle] = React.useState(storedTitle);
    const [background, updateBackground] = React.useState(storedBackground);
    
    const handleNextPress = () => {
        if (title && background) {
            const info = {
                anonymous,
                title,
                background
            }
            dispatch(setTitleAndBackground(info))
            navigation.navigate(PublishTwo);
        }
    }

    React.useEffect(() => {
        if (isSuccessful) {
            updateAnonymous(false);
            updateTitle("");
            updateBackground("");
        }
    }, [isSuccessful])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={{ width: 353, height: Dimensions.get('window').height - 500, flexDirection: 'column' }}>
                    <View style={{ flex : 0.7, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <View style={{ flex: 4, alignItems: 'flex-start' }}>
                            <Text style={styles.blowAWhistle}>Blow a Whistle!</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text onPress={handleNextPress} style={styles.nextBtn}>Next</Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Text style={styles.pageCounter}>(1/4)</Text>
                    </View>
                    <View style={{ flex: 0.8, width: 235, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center' }}>
                        <View style={{ flex: 2, alignItems: 'flex-start', justifyContent: 'center' }}>
                            <Text style={styles.anonymousText}>Post Anonymously</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                            <Switch
                                style={styles.anonymousSwitch}
                                trackColor={{ true: '#5B57FA' }}
                                onValueChange={() => updateAnonymous(previousState => !previousState)} 
                                value={anonymous}
                                />
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.inputTitle}>
                                Title
                            </Text>
                        </View>
                        <View style={{ flex: 2 }}>
                            <TextInput placeholder="Something Eye-Catching" placeholderTextColor="#9D9D9D" style={styles.titleInput} value={title} onChangeText={updateTitle} />
                        </View>
                    </View>
                    
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.inputTitle}>
                                Background
                            </Text>
                        </View>
                        <View style={{ flex: 2 }}>
                            <TextInput placeholder="Age, gender, geography, etc." placeholderTextColor="#9D9D9D" style={styles.backgroundInput} value={background} onChangeText={updateBackground} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default PublishOne;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ECEEFF',
    },
    blowAWhistle: {
        fontFamily: 'WorkSans-Bold', 
        fontSize: 30, 
        color: '#2C65F6'
    },
    nextBtn: {
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
    anonymousText: {
        fontFamily: 'WorkSans-Medium',
        fontSize: 17,
        color: '#2C65F6'
    },
    anonymousSwitch: {
        transform: [
            { scaleX: 0.8 },
            { scaleY: 0.8 }
        ]
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
    errorText: {
        color: 'red',
        fontSize: 20,
        fontFamily: 'WorkSans-Medium'
    },
})