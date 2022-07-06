import React, { useEffect } from 'react';
import axios from "axios";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, FlatList, Button, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken } from '../redux/slices/authSlice';
import FlipCard from 'react-native-flip-card';

const PollBar = (props) => {
    const heightAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(
            heightAnim,
            {
                toValue: 270 * props.percent,
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

    const [whistles, updateWhistles] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
    const [backSides, setBackSides] = React.useState([]);

    useEffect(() => {
        setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
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
        const colors = ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff'];

        return (
            <FlipCard
                flipHorizontal={true}
                friction={1000}
                flipVertical={false}
                flip={backSides[whistle.index]}
                clickable={false}>
                <View style={styles.face}>
                    <View style={styles.whistleContainer}>
                        <Text style={styles.whistleText}>{whistle.item.title}</Text>
                        <Button title={whistle.item.author} />
                        <Text style={styles.whistleText}>{whistle.item.background}</Text>
                        <Text style={styles.whistleText}>{whistle.item.context}</Text>
                        <Button style={styles.whistleText} title={keys[0]} onPress={() => {
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
                        }}/>
                        <Button style={styles.whistleText} title={keys[1]} onPress={() => {
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
                        }}/>
                        <Text style={styles.whistleText}>{Math.floor((new Date(whistle.item.closeDateTime) - currentDateTime) / (1000 * 60 * 60 * 24))} days, {Math.floor(((new Date(whistle.item.closeDateTime) - currentDateTime) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} hours, {Math.floor(((new Date(whistle.item.closeDateTime) - currentDateTime) % (1000 * 60 * 60)) / (1000 * 60))} minutes, {Math.floor(((new Date(whistle.item.closeDateTime) - currentDateTime) % (1000 * 60)) / 1000)} seconds left</Text>
                    </View>
                </View>
                <View style={styles.back}>
                    <View style={styles.whistleContainerBack}>
                        <View style={styles.pollBarContainer}>
                            <Text style={styles.percentage}>{~~(whistle.item.options[keys[0]] / (whistle.item.options[keys[0]] + whistle.item.options[keys[1]])).toFixed(2) * 100}% ({keys[0]})</Text>
                            <PollBar key={0} percent={whistle.item.options[keys[0]] / (whistle.item.options[keys[0]] + whistle.item.options[keys[1]])} style={styles.pollBar}></PollBar>
                            <Text style={styles.pollBarText}>
                                {keys[0]}
                            </Text> 
                        </View>
                        <View style={styles.pollBarContainer}>
                            <Text style={styles.percentage}>{~~(whistle.item.options[keys[1]] / (whistle.item.options[keys[0]] + whistle.item.options[keys[1]])).toFixed(2) * 100}% ({keys[0]})</Text>
                            <PollBar key={1} percent={whistle.item.options[keys[1]] / (whistle.item.options[keys[0]] + whistle.item.options[keys[1]])} style={styles.pollBar}></PollBar>
                            <Text style={styles.pollBarText}>
                                {keys[1]}
                            </Text> 
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
                ? <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
                : <FlatList
                    data={whistles}
                    renderItem={renderWhistle}
                    keyExtractor={(whistle) => whistle.id}
                    onEndReached={() => {
                        getMoreWhistles();
                    }}
                    pagingEnabled
                    decelerationRate={"normal"}
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
        backgroundColor: '#F5FCFF',
        height: Dimensions.get('window').height - 170,
    },
    whistleContainerBack: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        height: Dimensions.get('window').height - 170,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: 55,
    },
    whistleText: {
        color: 'black',
        fontSize: 20
    },
    pollBar: {
        width: 70,
        height: 300,
        backgroundColor: 'gray',
        borderRadius: 10,
    },
    pollBarText: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 10,
    },
})