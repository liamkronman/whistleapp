import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import axios from 'axios';
import { selectAccessToken } from '../redux/slices/authSlice';
import { useSelector } from 'react-redux';

const Activity = ({ navigation }) => {
    const jwtToken = useSelector(selectAccessToken);
    const [notifications, setNotifications] = React.useState([]);

    React.useEffect(() => {
        axios.post("https://trywhistle.app/api/user/getnotifications", {}, {
            headers: {
                "x-access-token": jwtToken
            }
        })
        .then(resp => {
            setNotifications(notifications => [...notifications, ...resp.data.notifications]);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    const renderNotification = ( notification ) => {
        console.log(notification);
        return (
            <></>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Activity</Text>
            </View>
            {
                notifications.length > 0
                ? <FlatList
                data={notifications}
                renderItem={renderNotification}
                />
                : <Text style={styles.noNotificationsText}>No notifications yet!</Text>
            }
        </View>
    );
};

export default Activity;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECEEFF',
        alignItems: 'center',
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        width: Dimensions.get('window').width,
        borderBottomWidth: 3,
        borderBottomColor: '#93B9F2'
    },
    headerText: {
        fontFamily: 'WorkSans-Bold',
        fontSize: 30,
        color: '#2C65F6'
    },
    noNotificationsText: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 18,
        color: '#6187EB',
        marginBottom: 4,
        marginTop: 20
    }
});