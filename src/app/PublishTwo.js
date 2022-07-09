import React from 'react';
import { Text, View, TouchableWithoutFeedback, Keyboard } from 'react-native'; 
import { useSelector } from 'react-redux';
import { selectContext } from '../redux/slices/publishSlice';
import PublishThree from './PublishThree';

const PublishTwo = ({ navigation }) => {
    const storedContext = useSelector(selectContext);
    const [context, updateContext] = React.useState(storedContext);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
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
            </View>
        </TouchableWithoutFeedback>
    )
}

export default PublishTwo;

