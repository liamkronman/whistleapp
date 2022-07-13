import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../redux/slices/authSlice';
import FlipCard from 'react-native-flip-card';
import PollBar from './PollBar';
import axios from 'axios';

const WhistleDisplay = (props) => {
    const whistle = props.whistle;
    const isOwner = props.isOwner;
    const jwtToken = useSelector(selectAccessToken);
    const [backside, setBackside] = React.useState(false);
    const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
    const [hasVoted, setHasVoted] = React.useState(false);
    const hasExpired = currentDateTime > new Date(whistle.closeDateTime);
    const keys = Object.keys(whistle.options);
    let totalVotes = 0;
    
    for (let i = 0; i < keys.length; i++) {
        totalVotes += whistle.options[keys[i]];
    }

    React.useEffect(() => {
        if (!isOwner && !hasExpired) {
            axios.post("https://trywhistle.app/api/user/checkhasvoted", {
                "whistleId": whistle.id,
            }, {
                headers: {
                    "x-access-token": jwtToken
                }
            })
            .then(resp => {
                if (resp.data.hasVoted) {
                    setHasVoted(true);
                }
            })
        }
    }, []);

    React.useEffect(() => {
        if (!hasExpired) {
            const handle = setInterval(() => {
                setCurrentDateTime(new Date());
            }, 1000);
            return () => {
                clearInterval(handle);
            }
        }
    }, []);

    return (
        <FlipCard
            flipHorizontal={true}
            friction={1000}
            flipVertical={false}
            flip={backside}
            clickable={false}>
            <View style={styles.whistleContainer}>
                <View style ={{ width: 353, height: Dimensions.get('window').height - 170, flexDirection: 'column' }}>
                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Text style={styles.whistleTitle}>{whistle.title}</Text>
                    </View>
                    <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'center', paddingTop: 4 }}>
                        <Text style={styles.whistleAuthor}>{whistle.author}: </Text>
                        <Text style={styles.whistleBackground}>{whistle.background}</Text>
                    </View>
                    <View style={{ flex: 4.5}}>
                        <Text style={styles.whistleContext}>{whistle.context}</Text>
                    </View>
                    {
                        isOwner || hasExpired || hasVoted
                        ? <View style={{ flex: 2.7, flexDirection: 'column' }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                        if (totalVotes > 0) {
                                            setBackside(true)
                                        }
                                    }} style={{ backgroundColor: 'white', borderColor: '#5B57FA', borderWidth: 1, width: 347, height: 62, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 20, color: '#5B57FA' }}>Show Results</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 30, color: '#2C65F6' }}>{totalVotes} Votes</Text>
                            </View>
                        </View>
                        : <View style={{ flex: 2.7, flexDirection: 'column' }}>
                            <View style={{ flex: 1.1, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={styles.whistleOptionBtn} onPress={() => {
                                    axios.post("https://trywhistle.app/api/app/votewhistle", {
                                        whistleId: whistle.id,
                                        optionSelected: keys[0]
                                    }, {
                                        headers: {
                                            "x-access-token": jwtToken,
                                        }
                                    })
                                    .then(resp => {
                                        whistle.options[keys[0]] += 1;
                                        setBackside(true);
                                    })
                                    .catch(err => console.log(err));
                                }}>
                                    <Text style={styles.whistleOptionText}>{keys[0]}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1.1, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={styles.whistleOptionBtn} onPress={() => {
                                    axios.post("https://trywhistle.app/api/app/votewhistle", {
                                        whistleId: whistle.id,
                                        optionSelected: keys[1]
                                    }, {
                                        headers: {
                                            "x-access-token": jwtToken,
                                        }
                                    })
                                    .then(resp => {
                                        whistle.options[keys[1]] += 1;
                                        setBackside(true);
                                    })
                                    .catch(err => console.log(err));
                                }}>
                                    <Text style={styles.whistleOptionText}>{keys[1]}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 22, color:'#2C65F6' }}>{totalVotes} Votes</Text>
                            </View>
                        </View>
                    }
                    <View style={{ flex: 1.4, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#4D7AEF', textAlign: 'center' }}>Time left </Text>
                        {
                            hasExpired
                            ? <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 18, color: '#E21313', textAlign: 'center' }}>Expired</Text>
                            : <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 18, color: '#E21313', textAlign: 'center' }}>{Math.floor((new Date(whistle.closeDateTime) - currentDateTime) / (1000 * 60 * 60 * 24))} days : {Math.floor(((new Date(whistle.closeDateTime) - currentDateTime) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} hrs : {Math.floor(((new Date(whistle.closeDateTime) - currentDateTime) % (1000 * 60 * 60)) / (1000 * 60))} mins : {Math.floor(((new Date(whistle.closeDateTime) - currentDateTime) % (1000 * 60)) / 1000)} secs</Text>
                        }
                    </View>
                </View>
            </View>
            <View style={styles.whistleContainerBack}>
                <View style ={{ width: 353, height: Dimensions.get('window').height - 170, flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Text style={styles.whistleTitle}>{whistle.title}</Text>
                    </View>
                    <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'center', paddingTop: 4 }}>
                        <Text style={styles.whistleAuthor}>{whistle.author}</Text>
                    </View>
                    <View style={{ flex: 7, flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={styles.pollBarContainer}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={styles.percentage}>{whistle.options[keys[0]]} Votes ({~~(whistle.options[keys[0]] / (whistle.options[keys[0]] + whistle.options[keys[1]])).toFixed(2) * 100}%)</Text>
                            </View>
                            <View style={{ flex: 5, justifyContent: 'flex-end' }}>
                                <PollBar key={0} percent={whistle.options[keys[0]] / (whistle.options[keys[0]] + whistle.options[keys[1]])} style={styles.pollBar}></PollBar>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={styles.pollBarText}>
                                    {keys[0]}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.pollBarContainer}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={styles.percentage}>{whistle.options[keys[1]]} Votes ({~~(whistle.options[keys[1]] / (whistle.options[keys[0]] + whistle.options[keys[1]])).toFixed(2) * 100}%)</Text>
                            </View>
                            <View style={{ flex: 5, justifyContent: 'flex-end' }}>
                                <PollBar key={1} percent={whistle.options[keys[1]] / (whistle.options[keys[0]] + whistle.options[keys[1]])} style={styles.pollBar}></PollBar>
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
        </FlipCard>
    );
}

export default WhistleDisplay;

const styles = StyleSheet.create({
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