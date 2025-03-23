import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'

interface Props extends DrawerContentComponentProps {
    handleLogout: () => void;
}

const CustomDrawer = (props: Props) => {
    const { handleLogout } = props;

    return (
        <DrawerContentScrollView
            {...props}
            scrollEnabled={false}
        >
            <View style={styles.screen}>
                <View style={styles.container}>
                    <View style={styles.avatar}>
                        <Text style={styles.text}>CP</Text>
                    </View>
                </View>
            </View>
            <Pressable onPress={handleLogout} style={{ padding: 15 }}>
                <Text style={{ color: "black", fontSize: 16 }}>Cerrar sesión</Text>
            </Pressable>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    )
}

export default CustomDrawer

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    container: {
        width: 300,
        height: 150,
        backgroundColor: '#2E6F40',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',

    },
    avatar: {
        width: 96,
        height: 96,
        backgroundColor: 'white',
        borderRadius: 46,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#2E6F40',
        fontSize: 30,
        fontFamily: 'WorkSans-Black',
        fontWeight: 'bold',
    },
})