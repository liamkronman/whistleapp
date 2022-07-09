import React from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native'; 
import { useSelector } from 'react-redux';
import { selectOptions } from '../redux/slices/publishSlice';
import PublishFour from './PublishFour';

const PublishThree = ({ navigation }) => {
    const [option1, updateOption1] = React.useState("");
    const [option2, updateOption2] = React.useState("");

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
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
            </View>
        </TouchableWithoutFeedback>
    )
}

export default PublishThree;