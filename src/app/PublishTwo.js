import React from 'react';
import { Text } from 'react-native'; 
import { useSelector } from 'react-redux';
import { selectContext } from '../redux/slices/publishSlice';

const PublishTwo = ({ navigation }) => {
    const storedContext = useSelector(selectContext);
    const [context, updateContext] = React.useState(storedContext);

    return (
        <>
            <Text>Page 2</Text> 
        </>
    )
}

export default PublishTwo;