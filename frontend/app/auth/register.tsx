import { View } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import { registerApi } from "../../constants/authApi";
import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";
import { commonStyles } from "../../styles/commonStyle";

export default function Register() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {

    try {

      setError("");
      setLoading(true);

      await registerApi({
        name,
        email,
        password
      });

      router.replace("/auth/login");

    } catch (err) {

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Register failed");
      } else {
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
            Create account
          </Text>

          <TextInput
            label="Name"
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={commonStyles.input}
          />

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

          <Button
            mode="contained"
            loading={loading}
            onPress={handleRegister}
            style={commonStyles.button}
          >
            Register
          </Button>

          <Button
            mode="text"
            onPress={() => router.push("/auth/login")}
          >
            Already have account? Login
          </Button>

        </Card.Content>
      </Card>

    </View>
  );
}
