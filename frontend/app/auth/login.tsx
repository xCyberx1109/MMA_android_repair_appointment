import { View, StyleSheet } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import { loginApi } from "../../constants/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";

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
      const role = res.data.user.role;
      const UserId = res.data.user._id;

      await AsyncStorage.setItem("UserId", UserId);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("role", role);

      // điều hướng theo role
      if (role === "admin") {
        router.replace("/home/admin");
      }

      else if (role === "repairman") {
        router.replace("/home/repairman");
      }

      else {
        router.replace("/home/customer");
      }

    } catch (err) {

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Card style={styles.card}>
        <Card.Content>

          <Text variant="titleLarge" style={styles.title}>
            Repair booking service
          </Text>

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          {error ? (
            <Text style={styles.errorText}>
              {error}
            </Text>
          ) : null}

          <Button
            mode="contained"
            loading={loading}
            onPress={handleLogin}
            style={styles.button}
          >
            Login
          </Button>

        </Card.Content>
      </Card>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5"
  },
  card: {
    padding: 10,
    borderRadius: 10
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  input: {
    marginBottom: 15
  },
  button: {
    marginTop: 10
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10
  }
});
