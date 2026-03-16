import { View, ScrollView } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { commonStyles } from "../../../styles/commonStyle";
import { useRouter } from "expo-router";

type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
};

export default function ProfileScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/users`;

  // Load user from AsyncStorage
  const loadUser = async () => {

    try {

      const userData = await AsyncStorage.getItem("User");

      if (!userData) return;

      const user: User = JSON.parse(userData);

      setUserId(user._id);
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);

    } catch (err) {
      console.log(err);
    }

  };

  useEffect(() => {
    loadUser();
  }, []);
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("User");
    router.replace("/auth/login");
  };

  const updateProfile = async () => {

    try {

      const res = await axios.patch(
        `${API_URL}/${userId}`,
        {
          name,
          email,
          phone
        }
      );

      // cập nhật lại AsyncStorage
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      alert("Profile updated successfully");

    } catch (err) {

      console.log(err);
      alert("Update failed");

    }

  };

  const changePassword = async () => {

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {

      await axios.patch(`${API_URL}/${userId}/change-password`, {
        currentPassword,
        newPassword
      });

      alert("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("User");

      router.replace("/auth/login");


    } catch (err) {
      console.log(err);
      alert("Change password failed");
    }
  };


  return (

    <ScrollView style={commonStyles.container}>

      <Card style={commonStyles.card}>
        <Card.Content>

          <Text style={commonStyles.title}>My Profile</Text>

          <Text style={commonStyles.label}>Name</Text>
          <TextInput
            style={commonStyles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={commonStyles.label}>Email</Text>
          <TextInput
            style={commonStyles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={commonStyles.label}>Phone</Text>
          <TextInput
            style={commonStyles.input}
            value={phone}
            onChangeText={setPhone}
          />

          <Button
            mode="contained"
            style={commonStyles.button}
            onPress={updateProfile}
          >
            Save Changes
          </Button>

          <Button
            mode="outlined"
            style={{ marginTop: 10 }}
            onPress={handleLogout}
          >
            Logout
          </Button>

        </Card.Content>
      </Card>


      <Card style={commonStyles.card}>
        <Card.Content>
          <Text style={[commonStyles.title, { marginTop: 20 }]}>
            Change Password
          </Text>

          <Text style={commonStyles.label}>Current Password</Text>
          <TextInput
            style={commonStyles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            autoComplete="new-password"
            textContentType="none"
          />



          <Text style={commonStyles.label}>New Password</Text>
          <TextInput
            style={commonStyles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          <Text style={commonStyles.label}>Confirm Password</Text>
          <TextInput
            style={commonStyles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Button
            mode="contained"
            style={commonStyles.button}
            onPress={changePassword}
          >
            Change Password
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>

  );
}
