import { View, TextInput, Button } from "react-native";
import { registerApi } from "../../constants/authApi";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Register() {

  const router = useRouter();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleRegister = async () => {

    await registerApi({
      name,
      email,
      password
    });

    router.replace("/auth/login");
  };

  return (
    <View>

      <TextInput placeholder="Name" onChangeText={setName} />

      <TextInput placeholder="Email" onChangeText={setEmail} />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button
        title="Register"
        onPress={handleRegister}
      />

    </View>
  );
}
