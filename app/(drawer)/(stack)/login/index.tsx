import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "@/core/auth/login";

// Esquema de validación con Yup
const schema = yup.object().shape({
    username: yup.string().matches(/^[a-zA-Z0-9_]+$/, 'El usuario solo puede contener letras, números y guiones bajo').required("El usuario es obligatorio"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
});

export default function LoginScreen() {
    const router = useRouter();

    // Configuración del formulario
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    // Función que maneja el login
    const onSubmit = async (data: any) => {
        const username = typeof data.username === 'string' ? data.username.toLowerCase() : data.username;
        const password = typeof data.password === 'string' ? data.password.trim() : data.password;

        try {
            const body = {
                username,
                password
            }

            const data = await login(body);

            if (data) {
                router.replace("/home");
            }
        } catch (error) {
            console.error('Error en el login:', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>Iniciar Sesión</Text>

            {/* Campo de email */}
            <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
                        placeholder="Usuario"
                        keyboardType="email-address"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />
            {errors.username && <Text style={{ color: "red" }}>{errors.username.message}</Text>}

            {/* Campo de contraseña */}
            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
                        placeholder="Contraseña"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />
            {errors.password && <Text style={{ color: "red" }}>{errors.password.message}</Text>}

            {/* Botón de login */}
            <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ backgroundColor: "blue", padding: 15, borderRadius: 5 }}>
                <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Ingresar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
