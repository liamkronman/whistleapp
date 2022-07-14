import * as React from "react";
import { ChevronLeft } from "react-native-feather";
import { StyleSheet, View, Dimensions } from "react-native";
import WhistleDisplay from "../components/WhistleDisplay";

const WhistleFeature = ({ route, navigation }) => {
    const { focusedWhistle, isOwner } = route.params;
    
    return (
        <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height - 170, backgroundColor: '#ECEEFF' }}>
            <WhistleDisplay whistle={focusedWhistle} isOwner={isOwner} navigation={navigation} />
            <ChevronLeft onPress={() => navigation.pop()} style={styles.backBtn} width={34} height={34}  />
        </View>
    )
}

export default WhistleFeature;

const styles = StyleSheet.create({
    backBtn: {
        position: 'absolute',
        alignSelf: 'flex-start', 
        top: 12, 
        left: 12,
        color: '#2C65F6'
    }
});