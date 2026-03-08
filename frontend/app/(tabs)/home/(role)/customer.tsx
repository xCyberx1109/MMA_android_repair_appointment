import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function CustomerHome() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");

    router.replace("/auth/login");
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hello Customer 👋</Text>
      <Button
        mode="outlined"
        onPress={handleLogout}
      >
        Logout
      </Button>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Need a repair?</Text>
          <Text>Book a repair service quickly</Text>
        </Card.Content>

        <Card.Actions>
          <Button mode="contained">Book Repair</Button>
        </Card.Actions>
      </Card>

      <Text style={styles.section}>My Appointments</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Water Leak Repair</Text>
          <Text>Today - 14:00</Text>
          <Text>Status: Assigned</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Air Conditioner Repair</Text>
          <Text>Tomorrow - 09:00</Text>
          <Text>Status: Pending</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  section: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "600",
  },

  card: {
    marginBottom: 12,
  },
});
