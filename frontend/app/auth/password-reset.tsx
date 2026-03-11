import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert, Platform } from "react-native";

export default function ForgotPassword() {

    const [email, setEmail] = useState("");
    const router = useRouter();
    const resetPassword = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/password-reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                }),
            });

            const data = await res.json();

            if (Platform.OS === "web") {
                alert(data.message);
                router.replace("/auth/login");
            } else {
                Alert.alert(
                    "Notification",
                    data.message,
                    [
                        {
                            text: "OK",
                            onPress: () => router.replace("/auth/login"),
                        },
                    ]
                );
            }

        } catch (error) {
            if (Platform.OS === "web") {
                alert("Something went wrong");
            } else {
                Alert.alert("Error", "Something went wrong");
            }
        }
    };


    return (
        <View style={{ padding: 20 }}>

            <Text variant="titleLarge">Reset Password</Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={{ marginTop: 20 }}
            />

            <Button
                mode="contained"
                onPress={resetPassword}
                style={{ marginTop: 20 }}
            >
                Send new password
            </Button>
            <Button
                mode="text"
                onPress={() => router.push("/auth/login")}
            >
                Back to Login
            </Button>
        </View>
    );
}
