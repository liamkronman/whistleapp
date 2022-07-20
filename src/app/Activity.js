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
            setNotifications([...resp.data.notifications]);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    const renderNotification = ( notification ) => {
        let user = "";
        let text1 = "";
        let action = "";
        let text2 = "";
        let whistleTitle = "";

        switch (notification.item.type) {
            case "whistleVote":
                user = notification.item.info.voter;
                text1 = " voted ";
                action = notification.item.info.optionSelected;
                text2 = " on your Whistle ";
                whistleTitle = notification.item.info.whistle.title;
                break;
        }

        return (
            <TouchableOpacity style={notification.item.read ? styles.readNotificationContainer : styles.unreadNoticationContainer}>
                <Text>
                    {user && <Text style={styles.notificationUserText}>{user}</Text>}
                    {text1 && <Text style={styles.notificationText}>{text1}</Text>}
                    {action && <Text style={styles.notificationLightText}>{action}</Text>}
                    {text2 && <Text style={styles.notificationText}>{text2}</Text>}
                    {whistleTitle && <Text style={styles.notificationLightText}>{whistleTitle}</Text>}
                    <Text style={styles.notificationText}>.</Text>
                </Text>
            </TouchableOpacity>
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
    },
    readNotificationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 20,
        width: Dimensions.get('window').width,
        backgroundColor: '#ECEEFF',
        topBorderWidth: 1,
        topBorderColor: '#93B9F2',
    },
    unreadNoticationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 20,
        width: Dimensions.get('window').width,
        backgroundColor: '#F3F5FA',
        topBorderWidth: 1,
        topBorderColor: '#93B9F2',
    },
    notificationText: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 18,
        color: 'black',
    },
    notificationUserText: {
        fontFamily: 'WorkSans-SemiBold',
        fontSize: 18,
        color: '#2C65F6',
    },
    notificationLightText: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 18,
        color: '#2C65F6',
    }
});