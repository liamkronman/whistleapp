import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, Dimensions, TouchableOpacity, TextInput } from 'react-native'; 
import { useSelector, useDispatch } from 'react-redux';
import { selectExpirationDateTime, setExpirationDateTime, selectIsSuccessful } from '../redux/slices/publishSlice';

const PublishFour = ({ navigation }) => {
    const dispatch = useDispatch();
    const storedExpirationDate = useSelector(selectExpirationDateTime);
    const isSuccessful = useSelector(selectIsSuccessful);

    const [date, setDate] = React.useState(new Date(storedExpirationDate));

    const [days, updateDays] = React.useState([date ? (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) : null]);
    const [hours, updateHours] = React.useState([date ? (date.getTime() - new Date().getTime()) / (1000 * 60 * 60) : null]);
    const [mins, updateMins] = React.useState([date ? (date.getTime() - new Date().getTime()) / (1000 * 60) : null]);
    const [showExpiration, updateShowExpiration] = React.useState(false);

    const handlePreviousPress = () => {
        const info = {
            expirationDateTime: date.toString(),
        };
        dispatch(setExpirationDateTime(info));
        navigation.pop();
    };

    const handlePreviewPress = () => {
        if (date) {
            const info = {
                expirationDateTime: date.toString()
            };  
            dispatch(setExpirationDateTime(info));
            navigation.navigate('PreviewWhistle');
        }
    };

    React.useEffect(() => {
        if (days && hours && mins) {
            const numDays = parseInt(days);
            const numHours = parseInt(hours);
            const numMins = parseInt(mins);
            if (numDays <= 10 && numDays >= 0 && numHours <= 23 && numHours >= 0 && numMins <= 59 && numMins >= 0) {
                // current date and adding the numDays, numHours, and numMins
                const currentDate = new Date();
                const newDate = new Date(currentDate.getTime() + numDays * 24 * 60 * 60 * 1000 + numHours * 60 * 60 * 1000 + numMins * 60 * 1000);
                setDate(newDate);
                updateShowExpiration(true);
            } else {
                updateShowExpiration(false);
            }
        } else {
            updateShowExpiration(false);
        }
    }, [days, hours, mins]);

    React.useEffect(() => {
        if (isSuccessful) {
            updateDays(null);
            updateHours(null);
            updateMins(null);
        }
    }, [isSuccessful])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={{ width: 353, height: Dimensions.get('window').height - 570, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={styles.previousBtn} onPress={handlePreviousPress}>Previous</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={styles.pageCounter}>(4/4)</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity style={styles.previewBtn} onPress={handlePreviewPress}>
                                <Text style={styles.previewText}>Preview</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'column' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.inputTitle}>
                                Duration
                            </Text>
                        </View>
                        <View style={{ flex: 2, flexDirection: 'row' }}>
                            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
                                <View style={{ flex: 1 }}>
                                    <TextInput placeholder="0-10" placeholderTextColor="#9D9D9D" style={styles.dateInput} value={days} onChangeText={updateDays}  />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.dateLabel}>days</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
                                <View style={{ flex: 1 }}>
                                    <TextInput placeholder="0-23" placeholderTextColor="#9D9D9D" style={styles.dateInput} value={hours} onChangeText={updateHours}  />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.dateLabel}>hours</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
                                <View style={{ flex: 1 }}>
                                    <TextInput placeholder="0-59" placeholderTextColor="#9D9D9D" style={styles.dateInput} value={mins} onChangeText={updateMins}  />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.dateLabel}>minutes</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        {
                            showExpiration && 
                            <Text style={styles.expirationDate}>Your Whistle will expire on {date.toLocaleDateString()} at {date.toLocaleTimeString()}.</Text>
                        }
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default PublishFour;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ECEEFF',
    },
    previousBtn: {
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
    previewBtn: {
        width: 94,
        height: 39,
        backgroundColor: 'white',
        borderColor: '#2C65F6',
        borderWidth: 1,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    previewText: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 20,
        color: '#2C65F6'
    },
    inputTitle: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18,
        color: '#2C65F6'
    },
    dateInput: {
        width: 84,
        height: 36,
        backgroundColor: '#D8E5FF',
        fontFamily: 'WorkSans-Regular',
        fontSize: 16,
        borderRadius: 8,
        padding: 10,
        textAlign: 'center'
    },
    dateLabel: {
        fontFamily: 'WorkSans-Medium',
        fontSize: 16,
        color: '#2C65F6'
    },
    expirationDate: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        color: 'black',
        textAlign: 'center'
    }
})