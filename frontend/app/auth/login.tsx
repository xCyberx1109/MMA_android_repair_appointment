import { View } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import { loginApi } from "../../constants/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";
import { commonStyles } from "../../styles/commonStyle";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {

      setError("");
      setLoading(true);

      const res = await loginApi({
        email,
        password
      });

      const token = res.data.token;
      const User = res.data.user;

      await AsyncStorage.setItem("User", JSON.stringify(User));
      await AsyncStorage.setItem("token", token);

      console.log(await AsyncStorage.getItem("User"));

      if (User.role === "admin") {
        router.replace("/home/admin");
      }
      else if (User.role === "repairman") {
        router.replace("/home/repairman");
      }
      else {
        router.replace("/home/customer");
      }

    } catch (err) {

      console.log("ERROR:", err);

      if (axios.isAxiosError(err)) {
        console.log("AXIOS ERROR:", err.response?.data);
        setError(err.response?.data?.message || "Login failed");
      } else {
        console.log("UNKNOWN ERROR:", err);
        setError("Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={commonStyles.container}>

      <Card style={commonStyles.card}>
        <Card.Content>

          <Text variant="titleLarge" style={commonStyles.title}>
            Repair booking service
          </Text>

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={commonStyles.input}
          />

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={commonStyles.input}
          />

          {error ? (
            <Text style={commonStyles.errorText}>
              {error}
            </Text>
          ) : null}

          {/* Password reset */}
          <Button
            mode="text"
            onPress={() => router.push("/auth/password-reset")}
            style={{ alignSelf: "flex-end" }}
          >
            Forgot password
          </Button>

          <Button
            mode="contained"
            loading={loading}
            onPress={handleLogin}
            style={commonStyles.button}
          >
            Login
          </Button>

          {/* Nút Register */}
          <Button
            mode="text"
            onPress={() => router.push("/auth/register")}
          >
            Don't have an account? Register
          </Button>

        </Card.Content>
      </Card>

    </View>
  );
}
