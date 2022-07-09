import React from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native'; 
import { useSelector } from 'react-redux';
import { selectOptions } from '../redux/slices/publishSlice';
import PreviewWhistle from './PreviewWhistle';
import DateTimePicker from '@react-native-community/datetimepicker';

const PublishFour = ({ navigation }) => {
    const [date, setDate] = React.useState(new Date(1598051730000));
    const [mode, setMode] = React.useState('date');
    const [show, setShow] = React.useState(false);

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
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
        </TouchableWithoutFeedback>
    )
}

export default PublishFour;