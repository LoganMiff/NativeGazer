import { View, StyleSheet } from "react-native"

export default function GazeDot( {x, y, radius} ) {
    return (
        <View 
            style={[
                styles.dot,
                {
                    left: x - radius / 2,
                    top: y - radius / 2,
                    width: radius,
                    height: radius,
                    borderRadius: radius / 2
                }
            ]}/>
    );
}


const styles = StyleSheet.create({
    dot: {
        position: 'absoulute',
        backgroundColor: 'red',
    }
})