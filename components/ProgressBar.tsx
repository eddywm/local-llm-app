import {StyleSheet, Text, View} from "react-native";

const ProgressBar = ({ progress } : { progress: number }) => {
    const clampedProgress = Math.max(0, Math.min(progress, 100));

    return (
        <View style={styles.container}>
            <View style={[styles.bar, { width: `${clampedProgress}%` }]} />
            <Text style={styles.text}>{clampedProgress}%</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 28,
        backgroundColor: '#E8E8E8',
        borderRadius: 14,
        overflow: 'hidden',
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    bar: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 14,
    },
    text: {
        margin: 4,
        position: 'absolute',
        alignSelf: "center",
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
});

export default ProgressBar;