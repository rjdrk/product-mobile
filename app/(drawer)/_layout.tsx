import { Drawer } from "expo-router/drawer";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import CustomDrawer from "@/components/shared/CustomDrawer";

export default function Layout() {
    const router = useRouter();
    const navigation = useNavigation(); // 🔹 Referencia a la navegación

    // Función para cerrar sesión
    const handleLogout = async () => {
        Alert.alert(
            "Cerrar sesión",
            "¿Seguro que quieres cerrar sesión?",
            [
                {
                    text: "Cancelar", style: "cancel"
                },
                {
                    text: "Sí", onPress: async () => {
                        await AsyncStorage.removeItem("authToken");


                        // 🔹 Reemplaza la pantalla con el Login
                        router.push("/login");
                    }
                }
            ]
        );
    };

    return (
        <Drawer
            drawerContent={(props) => (
                <CustomDrawer {...props} handleLogout={handleLogout} />
            )}
            screenOptions={{
                overlayColor: 'rgba(0,0,0,0.4)',
                drawerActiveTintColor: 'indigo',
                headerShadowVisible: false,
                sceneStyle: {
                    backgroundColor: 'white'
                },
                headerShown: false,
            }}
        >
            {/* Oculta "Inicio" en el Drawer */}
            <Drawer.Screen
                name="(stack)"
                options={{ title: "Inicio", drawerItemStyle: { display: "none" } }}
            />
        </Drawer>
    );
}