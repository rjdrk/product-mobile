import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StackLayout() {
    Appearance.setColorScheme("light");
    const router = useRouter();
    const segments = useSegments();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // 🔹 1️⃣ Verifica si hay token al iniciar la app
    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("authToken");
            setIsAuthenticated(!!token);
            setHasCheckedAuth(true);
        };

        checkAuth();
    }, []);

    // 🔹 2️⃣ Detecta cambios en `AsyncStorage` después del login
    useEffect(() => {
        const interval = setInterval(async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (token && isAuthenticated === false) {
                console.log("Token detectado, actualizando estado...");
                setIsAuthenticated(true);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // 🔹 3️⃣ Redirige según el estado de autenticación
    useEffect(() => {
        if (!hasCheckedAuth || !isMounted) return;

        const isLoginScreen = segments.length > 0 && segments[0] === "login";

        if (!isAuthenticated && !isLoginScreen) {
            console.log("Redirigiendo a login...");
            router.replace("/login");
        } else if (isAuthenticated && isLoginScreen) {
            console.log("Redirigiendo a home...");
            router.replace("/home");
        }
    }, [isAuthenticated, hasCheckedAuth, isMounted, segments]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    console.log("Renderizando StackLayout... isAuthenticated:", isAuthenticated, "hasCheckedAuth:", hasCheckedAuth, "isMounted:", isMounted);

    if (!hasCheckedAuth || !isMounted) {
        return null;
    }

    return (
        <Stack>
            <Stack.Screen name="home/index" options={{ headerShown: false }} />
            <Stack.Screen name="login/index" options={{ headerShown: false }} />
            <Stack.Screen name="product/[id]" options={{ title: 'Detalle del producto', headerShown: false }} />
        </Stack>
    );
}
