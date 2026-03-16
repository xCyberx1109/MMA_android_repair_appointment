import { ScrollView, StyleSheet, View, Alert, Platform } from "react-native";
import { Card, Text, Button, Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import axios from "axios";
import { commonStyles } from "../../../../styles/commonStyle";

type Request = {
  _id: string;
  title: string;
  address: string;
  status: string;
  scheduleDate?: string;

  customerId?: {
    name: string;
  };

  serviceId?: {
    name: string;
  };
};

export default function RepairmanHome() {

  const [requests, setRequests] = useState<Request[]>([]);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {

      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/requests/repairman/my`,
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


  const formatDate = (date?: string) => {
    if (!date) return "Not scheduled";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status?: string) => {
    if (status === "pending") return "#f59e0b";
    if (status === "assigned") return "#3b82f6";
    if (status === "in_progress") return "#6366f1";
    if (status === "completed") return "#10b981";
    if (status === "cancelled") return "#ef4444";
    return "gray";
  };

  const updateStatus = async (id: string, status: string) => {
    try {

      const token = await AsyncStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/requests/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchMyJobs();

    } catch (err) {
      console.log(err);
    }
  };
  const confirmStatusChange = (id: string, status: string) => {

    const message =
      status === "in_progress"
        ? "Start this job?"
        : "Mark this job as completed?";

    // Nếu chạy trên web
    if (Platform.OS === "web") {
      const ok = window.confirm(message);
      if (ok) {
        updateStatus(id, status);
      }
      return;
    }

    Alert.alert(
      "Confirm",
      message,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => updateStatus(id, status) }
      ],
      { cancelable: true }
    );
  };



  return (
    <ScrollView style={commonStyles.container}>

      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>My Jobs 🔧</Text>


      </View>

      {requests.map((item) => (
        <Card key={item._id} style={commonStyles.card}>

          <Card.Content>

            <View style={commonStyles.rowTop}>
              <Text style={commonStyles.jobTitle}>
                {item.title}
              </Text>

              <Chip
                style={{
                  backgroundColor: getStatusColor(item.status)
                }}
                textStyle={{ color: "white" }}
              >
                {item.status}
              </Chip>

            </View>

            <Text style={commonStyles.info}>
              🔧 Service: {item.serviceId?.name}
            </Text>

            <Text style={commonStyles.info}>
              👤 Customer: {item.customerId?.name}
            </Text>

            <Text style={commonStyles.info}>
              📅 Schedule: {formatDate(item.scheduleDate)}
            </Text>

            <Text style={commonStyles.info}>
              📍 Address: {item.address}
            </Text>

          </Card.Content>

          {item.status === "assigned" && (
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => confirmStatusChange(item._id, "in_progress")}
              >
                Start Job
              </Button>
            </Card.Actions>
          )}

          {item.status === "in_progress" && (
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => confirmStatusChange(item._id, "completed")}
              >
                Complete
              </Button>
            </Card.Actions>
          )}
        </Card>
      ))}

    </ScrollView>
  );
}
