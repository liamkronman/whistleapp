import React from 'react';
import axios from "axios";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, FlatList, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken } from '../redux/slices/authSlice';
import { render } from 'react-dom';
// import { PagerView } from 'react-native-pager-view';
// import styled from 'react-native-styled-components';


// const { height } = Dimensions.get('window');

// const Container = styled(PagerView)`
//     height: ${height}px;
// `;

const Feed = () => {
    const dispatch = useDispatch();
    const jwtToken = useSelector(selectAccessToken);

    const [whistles, updateWhistles] = React.useState([]);
    const [currWhistleIndex, setCurrWhistleIndex] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    
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
        if (currWhistleIndex >= whistles.length - 3 && whistles.length >= 5) {
            let lastWhistleId = whistles[whistles.length - 1].id;
            getWhistles(lastWhistleId)
            .then(newWhistles => {
                updateWhistles(whistles => [...whistles, ...newWhistles.data.whistles]);
            })
        }
    }, [currWhistleIndex]);

    const renderWhistle = ( whistle ) => {
        console.log(whistle)
        return (
            <View style={styles.whistleContainer}>
                <Text style={styles.whistleText}>{whistle.item.title}</Text>
                <Button title={whistle.item.author} />
                <Text style={styles.whistleText}>{whistle.item.background}</Text>
                <Text style={styles.whistleText}>{whistle.item.context}</Text>
                <Text style={styles.whistleText}>{whistle.item.option1}</Text>
                <Text style={styles.whistleText}>{whistle.item.option2}</Text>
            </View>
        )
    };

    return (
        <>
            {
                isLoading
                ? <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
                : <FlatList
                    data={whistles}
                    renderItem={renderWhistle}
                    keyExtractor={(whistle) => whistle.id}
                    extraData={currWhistleIndex}
                    pagingEnabled
                    decelerationRate={"normal"}
                    />
            }
        </>
    )
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
        backgroundColor: '#F5FCFF',
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
    whistleText: {
        color: 'black',
        fontSize: 20
    }
})