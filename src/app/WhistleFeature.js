import * as React from "react";
import { ChevronLeft } from "react-native-feather";
import { StyleSheet } from "react-native";
import WhistleDisplay from "../components/WhistleDisplay";

const WhistleFeature = ({ route, navigation }) => {
    console.log(route);
    console.log(route.params);
    const { focusedWhistle, isOwner } = route.params;
    
    return (
        <>
            <ChevronLeft onPress={() => navigation.pop()} style={styles.backBtn} width={34} height={34} />
            <WhistleDisplay whistle={focusedWhistle} isOwner={isOwner} />
        </>
    )
}

export default WhistleFeature;

const styles = StyleSheet.create({
    backBtn: {
        position: 'absolute',
        alignSelf: 'flex-start', 
        top: 70, 
        left: 20
    }
});