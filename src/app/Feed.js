import React, { useEffect } from 'react';
import axios from "axios";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, FlatList, Alert, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken } from '../redux/slices/authSlice';
import { selectIsSuccessful, resetIsSuccessful } from '../redux/slices/publishSlice';
import FlipCard from 'react-native-flip-card';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

const PollBar = (props) => {
    const heightAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(
            heightAnim,
            {
                toValue: 350 * props.percent,
                duration: 1000,
                useNativeDriver: false,
            }
        ).start();
    }, [heightAnim])

    return (
        <Animated.View style={{...props.style, height: heightAnim}}>
            {props.children}
        </Animated.View>
    )
}

const Feed = () => {
    const dispatch = useDispatch();
    const jwtToken = useSelector(selectAccessToken);
    const isSuccessful = useSelector(selectIsSuccessful);

    const [whistles, updateWhistles] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
    const [backSides, setBackSides] = React.useState([]);

    useEffect(() => {
        const handle = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => {
            clearInterval(handle);
        }
    }, []);
    
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
    }, [isSuccessful])

    function getMoreWhistles() {
        let lastWhistleId = whistles[whistles.length - 1].id;
        getWhistles(lastWhistleId)
        .then(newWhistles => {
            updateWhistles(whistles => [...whistles, ...newWhistles.data.whistles]);
        })
        .catch(err => console.log(err));
    }


    const renderWhistle = ( whistle ) => {
        const keys = Object.keys(whistle.item.options);
        let totalVotes = 0;

        for (let i = 0; i < keys.length; i++) {
            totalVotes += whistle.item.options[keys[i]];
        }

        return (
            <FlipCard
                flipHorizontal={true}
                friction={1000}
                flipVertical={false}
                flip={backSides[whistle.index]}
                clickable={false}>
                <View style={styles.face}>
                    <View style={styles.whistleContainer}>
                        <View style ={{ width: 353, height: Dimensions.get('window').height - 170, flexDirection: 'column' }}>
                            <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={styles.whistleTitle}>{whistle.item.title}</Text>
                            </View>
                            <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'center', paddingTop: 4 }}>
                                <Text style={styles.whistleAuthor}>{whistle.item.author}: </Text>
                                <Text style={styles.whistleBackground}>{whistle.item.background}</Text>
                            </View>
                            <View style={{ flex: 4.5}}>
                                <Text style={styles.whistleContext}>{whistle.item.context}</Text>
                            </View>
                            <View style={{ flex: 1.1, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={styles.whistleOptionBtn} onPress={() => {
                                    axios.post("https://trywhistle.app/api/app/votewhistle", {
                                        whistleId: whistle.item.id,
                                        optionSelected: keys[0]
                                    }, {
                                        headers: {
                                            "x-access-token": jwtToken,
                                        }
                                    })
                                    .then(resp => {
                                        whistle.item.options[keys[0]] += 1;
                                        setBackSides(backSides => {
                                            backSides[whistle.index] = true;
                                            return backSides;
                                        });
                                    })
                                    .catch(err => console.log(err));
                                }}>
                                    <Text style={styles.whistleOptionText}>{keys[0]}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1.1, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={styles.whistleOptionBtn} onPress={() => {
                                    axios.post("https://trywhistle.app/api/app/votewhistle", {
                                        whistleId: whistle.item.id,
                                        optionSelected: keys[1]
                                    }, {
                                        headers: {
                                            "x-access-token": jwtToken,
                                        }
                                    })
                                    .then(resp => {
                                        whistle.item.options[keys[1]] += 1;
                                        setBackSides(backSides => {
                                            backSides[whistle.index] = true;
                                            return backSides;
                                        });
                                    })
                                    .catch(err => console.log(err));
                                }}>
                                    <Text style={styles.whistleOptionText}>{keys[1]}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 22, color:'#2C65F6' }}>{totalVotes} Votes</Text>
                            </View>
                            <View style={{ flex: 1.4, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#4D7AEF', textAlign: 'center' }}>Time left </Text>
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 18, color: '#E21313', textAlign: 'center' }}>{Math.floor((new Date(whistle.item.closeDateTime) - currentDateTime) / (1000 * 60 * 60 * 24))} days : {Math.floor(((new Date(whistle.item.closeDateTime) - currentDateTime) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} hrs : {Math.floor(((new Date(whistle.item.closeDateTime) - currentDateTime) % (1000 * 60 * 60)) / (1000 * 60))} mins : {Math.floor(((new Date(whistle.item.closeDateTime) - currentDateTime) % (1000 * 60)) / 1000)} secs</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.back}>
                    <View style={styles.whistleContainerBack}>
                        <View style ={{ width: 353, height: Dimensions.get('window').height - 170, flexDirection: 'column', justifyContent: 'center' }}>
                            <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={styles.whistleTitle}>{whistle.item.title}</Text>
                            </View>
                            <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'center', paddingTop: 4 }}>
                                <Text style={styles.whistleAuthor}>{whistle.item.author}</Text>
                            </View>
                            <View style={{ flex: 7, flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={styles.pollBarContainer}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={styles.percentage}>{whistle.item.options[keys[0]]} Votes ({~~(whistle.item.options[keys[0]] / (whistle.item.options[keys[0]] + whistle.item.options[keys[1]])).toFixed(2) * 100}%)</Text>
                                    </View>
                                    <View style={{ flex: 5, justifyContent: 'flex-end' }}>
                                        <PollBar key={0} percent={whistle.item.options[keys[0]] / (whistle.item.options[keys[0]] + whistle.item.options[keys[1]])} style={styles.pollBar}></PollBar>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={styles.pollBarText}>
                                            {keys[0]}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.pollBarContainer}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={styles.percentage}>{whistle.item.options[keys[1]]} Votes ({~~(whistle.item.options[keys[1]] / (whistle.item.options[keys[0]] + whistle.item.options[keys[1]])).toFixed(2) * 100}%)</Text>
                                    </View>
                                    <View style={{ flex: 5, justifyContent: 'flex-end' }}>
                                        <PollBar key={1} percent={whistle.item.options[keys[1]] / (whistle.item.options[keys[0]] + whistle.item.options[keys[1]])} style={styles.pollBar}></PollBar>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={styles.pollBarText}>
                                            {keys[1]}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}></View>
                        </View>
                    </View>
                </View>
            </FlipCard>
        )
    };

    return (
        <View style={styles.container}>
            {
                isLoading
                ? <SkeletonContent
                    containerStyle={{ flex: 1 }}
                    animationDirection="horizontalLeft"
                    layout={[
                        { width: Dimensions.get('window').width, height: Dimensions.get('window').height - 170, borderRadius: 10 },
                    ]}
                    />
                : <FlatList
                    data={whistles}
                    renderItem={renderWhistle}
                    keyExtractor={(whistle) => whistle.id}
                    onEndReached={() => {
                        getMoreWhistles();
                    }}
                    pagingEnabled
                    decelerationRate={"normal"}
                    showsVerticalScrollIndicator={false}
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
})