import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectAnonymous, selectTitle, selectBackground, selectContext, selectChoices, selectExpirationDateTime, selectErrorMessage, selectIsSuccessful, blowWhistleThunk } from '../redux/slices/publishSlice';
import { selectUsername } from '../redux/slices/authSlice';

const PreviewWhistle = ({ navigation }) => {
    const dispatch = useDispatch();

    const anonymous = useSelector(selectAnonymous);
    const title = useSelector(selectTitle);
    const username = useSelector(selectUsername);
    const background = useSelector(selectBackground);
    const context = useSelector(selectContext);
    const choices = useSelector(selectChoices);
    const expirationDateTime = useSelector(selectExpirationDateTime);
    const errorMessage = useSelector(selectErrorMessage);
    const isSuccessful = useSelector(selectIsSuccessful);
    const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
    const [isLoading, updateIsLoading] = React.useState(false);

    const blowWhistle = () => {
        updateIsLoading(true);
        dispatch(blowWhistleThunk);
    }

    React.useEffect(() => {
        const handle = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => {
            clearInterval(handle);
        }
    }, []);

    React.useEffect(() => {
        if (isSuccessful) {
            updateIsLoading(false);
            for (let i = 0; i < 4; i++) {
                navigation.pop();
            }
            navigation.navigate('Feed');
        }
    }, [isSuccessful]);

    return (
        <View style={styles.whistleContainer}>
            <View style ={{ width: 353, height: Dimensions.get('window').height - 170, flexDirection: 'column' }}>
                <View style={{ flex: 0.8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                        <Text style={styles.backBtn} onPress={() => navigation.pop()}>Back</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <TouchableOpacity style={styles.publishBtn} onPress={blowWhistle}>
                            {
                                isLoading && !errorMessage
                                    ? <ActivityIndicator size="small" color="#fff" />
                                    : <Text style={styles.publishText}>Post</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                { errorMessage && <Text style={styles.errorText}>{errorMessage}</Text> }
                <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Text style={styles.whistleTitle}>{title}</Text>
                </View>
                <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'center', paddingTop: 4 }}>
                    <Text style={styles.whistleAuthor}>{anonymous ? "Anonymous" : username}: </Text>
                    <Text style={styles.whistleBackground}>{background}</Text>
                </View>
                <View style={{ flex: 4.5}}>
                    <Text style={styles.whistleContext}>{context}</Text>
                </View>
                <View style={{ flex: 1.1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.whistleOptionBtn}>
                        <Text style={styles.whistleOptionText}>{choices && choices[0]}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1.1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.whistleOptionBtn}>
                        <Text style={styles.whistleOptionText}>{choices && choices[1]}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1.4, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#4D7AEF', textAlign: 'center' }}>Time left </Text>
                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 18, color: '#E21313', textAlign: 'center' }}>{Math.floor(((new Date(expirationDateTime)) - currentDateTime) / (1000 * 60 * 60 * 24))} days : {Math.floor(((new Date(expirationDateTime) - currentDateTime) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} hrs : {Math.floor(((new Date(expirationDateTime) - currentDateTime) % (1000 * 60 * 60)) / (1000 * 60))} mins : {Math.floor(((new Date(expirationDateTime) - currentDateTime) % (1000 * 60)) / 1000)} secs</Text>
                </View>
            </View>
        </View>
    );
}

export default PreviewWhistle;

const styles = StyleSheet.create({
    whistleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ECEEFF',
        height: Dimensions.get('window').height - 170,
    },
    whistleTitle: {
        fontFamily: 'WorkSans-Bold',
        fontSize: 30,
        color: '#2C65F6',
        textAlign: 'center'
    },
    whistleAuthor: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 18,
        color: '#8CA9F2'
    },
    whistleBackground: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18,
        color: '#2C65F6'
    },
    whistleContext: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        color: 'black'
    },
    whistleOptionBtn: {
        width: 347,
        height: 62,
        borderRadius: 6,
        backgroundColor: '#5B57FA',
        alignItems: 'center',
        justifyContent: 'center'
    },
    whistleOptionText: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 19,
        color: 'white'
    },
    backBtn: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 20,
        color: '#2C65F6',
        textDecorationLine: 'underline'
    },
    publishBtn: {
        width: 94,
        height: 39,
        backgroundColor: '#5B57FA',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    publishText: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 20,
        color: 'white'
    },
    errorText: {
        color: 'red',
        fontSize: 20,
        fontFamily: 'WorkSans-Medium'
    }
})