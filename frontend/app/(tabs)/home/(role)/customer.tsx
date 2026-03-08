import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Button, Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";

type Request = {
  _id: string;
  title: string;
  address: string;
  status: string;
  createdAt: string;
  scheduleDate?: string;

  serviceId?: {
    name: string;
  };

  repairmanId?: {
    name: string;
  };
};


export default function CustomerHome() {

  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {

      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/request/customer/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRequests(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");
    router.replace("/auth/login");
  };

  const getStatusColor = (status: string) => {
    if (status === "pending") return "#f59e0b";
    if (status === "accepted") return "#3b82f6";
    if (status === "in_progress") return "#6366f1";
    if (status === "completed") return "#10b981";
    return "gray";
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not scheduled";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };



  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Requests</Text>

        <Button mode="outlined" onPress={handleLogout}>
          Logout
        </Button>
      </View>

      {/* Request List */}
      {requests.map((item) => (
        <Card key={item._id} style={styles.card}>

          <Card.Content>

            <View style={styles.rowTop}>
              <Text style={styles.requestTitle}>
                {item.title}
              </Text>

              <Chip
                style={[
                  styles.statusChip,
                  { backgroundColor: getStatusColor(item.status) }
                ]}
                textStyle={{ color: "white" }}
              >
                {item.status}
              </Chip>
            </View>

            <Text style={styles.info}>
              🔧 Service: {item.serviceId?.name}
            </Text>

            <Text style={styles.info}>
              📍 Address: {item.address}
            </Text>

            <Text style={styles.info}>
              📅 Schedule: {formatDate(item.scheduleDate)}
            </Text>

            <Text style={styles.info}>
              👨‍🔧 Repairman: {item.repairmanId?.name || "Waiting assignment"}
            </Text>

          </Card.Content>

        </Card>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    padding: 16,
    backgroundColor: "#f5f5f5"
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },

  title: {
    fontSize: 26,
    fontWeight: "bold"
  },

  card: {
    marginBottom: 15,
    borderRadius: 14,
    elevation: 3
  },

  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },

  requestTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1
  },

  statusChip: {
    height: 28
  },

  info: {
    fontSize: 14,
    color: "#555",
    marginTop: 2
  }

});
