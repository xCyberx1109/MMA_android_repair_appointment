import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function AdminHome() {

  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");

    router.replace("/auth/login");
  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard 🛠</Text>

        <Button
          mode="outlined"
          onPress={handleLogout}
        >
          Logout
        </Button>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text>Pending Requests: 5</Text>
          <Text>Repairmen Available: 4</Text>
          <Text>Completed Jobs: 20</Text>
        </Card.Content>
      </Card>

      <Text style={styles.section}>New Requests</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Water Leak</Text>
          <Text>Customer: Minh</Text>
          <Text>Address: Ha Noi</Text>
        </Card.Content>

        <Card.Actions>
          <Button mode="contained">Assign Repairman</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Pipe Broken</Text>
          <Text>Customer: Lan</Text>
          <Text>Address: Dong Da</Text>
        </Card.Content>

        <Card.Actions>
          <Button mode="contained">Assign</Button>
        </Card.Actions>
      </Card>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
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
