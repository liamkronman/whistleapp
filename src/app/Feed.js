import React, { useEffect } from 'react';
import axios from "axios";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, FlatList, Alert, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken } from '../redux/slices/authSlice';
import { selectIsSuccessful, resetIsSuccessful } from '../redux/slices/publishSlice';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import WhistleDisplay from '../components/WhistleDisplay';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Feed = ({ navigation }) => {
    const dispatch = useDispatch();
    const jwtToken = useSelector(selectAccessToken);
    const isSuccessful = useSelector(selectIsSuccessful);

    const [whistles, updateWhistles] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    
    const getWhistles = async (lastWhistleId=null) => {
        if (lastWhistleId) {
            return await axios.post("https://trywhistle.app/api/app/getwhistles", {
                    lastId: lastWhistleId,
                },
                {
                    headers: {
                        "x-access-token": jwtToken,
                    }
            });
        } else {
            return await axios.post("https://trywhistle.app/api/app/getwhistles", {},
                {
                    headers: {
                        "x-access-token": jwtToken,
                    }
            });
        }
    };
    
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
        getWhistles()
        .then(newWhistles => {
            updateWhistles(newWhistles.data.whistles);
            setIsLoading(false);
        })
        .catch(err => console.log(err));
    }, []);

    // load whistles immediately
    React.useEffect(() => {
        getWhistles()
        .then(newWhistles => {
            updateWhistles(newWhistles.data.whistles);
            setIsLoading(false);
        })
        .catch(err => console.log(err));
    }, []);

    React.useEffect(() => {
        if (isSuccessful) {
            Alert.alert("Success!", "Your whistle has been published!");
            dispatch(resetIsSuccessful());
        }
    }, [isSuccessful]);

    function getMoreWhistles() {
        let lastWhistleId = whistles[whistles.length - 1].id;
        getWhistles(lastWhistleId)
        .then(newWhistles => {
            updateWhistles(whistles => [...whistles, ...newWhistles.data.whistles]);
        })
        .catch(err => console.log(err));
    }


    const renderWhistle = ( whistle ) => {
        return (
            <WhistleDisplay whistle={whistle.item} isOwner={false} navigation={navigation} />
        );
    };

    return (
        <View style={styles.container}>
            {
                isLoading
                ? <ActivityIndicator size="large" color="#2C65F6" />
                : whistles.length > 0 
                ? <FlatList
                    data={whistles}
                    renderItem={renderWhistle}
                    keyExtractor={(whistle) => whistle.id}
                    onEndReached={() => {
                        getMoreWhistles();
                    }}
                    pagingEnabled
                    decelerationRate={"normal"}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                          tintColor="#2C65F6"
                        />
                    }
                    />
                : <FlatList
                    data={["No New Whistles Active."]}
                    renderItem={({item}) => <Text style={styles.noWhistlesText}>{item}</Text>}
                    refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                          tintColor="#2C65F6"
                        />
                    }
                    />
            }
        </View>
    );
}

export default Feed;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ECEEFF',
    },
    btn: {
        backgroundColor: 'blue',
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 10
    },
    text: {
        color: 'white',
        fontSize: 20
    },
    whistleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ECEEFF',
        height: Dimensions.get('window').height - 170,
    },
    whistleContainerBack: {
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
    pollBarContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 150,
        flexDirection: 'column'
    },
    percentage: {
        fontFamily: 'WorkSans-Medium',
        fontSize: 16,
        color: '#2C65F6'
    },
    pollBar: {
        width: 70,
        height: 350,
        backgroundColor: '#5B57FA',
        borderRadius: 10,
    },
    pollBarText: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'WorkSans-SemiBold',
        color: '#2C65F6'
    },
    noWhistlesText: {
        fontFamily: 'WorkSans-Regular',
        fontSize: 20,
        color: '#2C65F6',
    }
})