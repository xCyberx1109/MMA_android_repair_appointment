import {
  ScrollView,
  StyleSheet,
  View,
  Modal,
  TextInput,
  Platform,
  TouchableOpacity,
  FlatList
} from "react-native";

import {
  Card,
  Text,
  Button,
  Chip
} from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

import { commonStyles } from "../../../../styles/commonStyle";

type Request = {
  _id: string;
  title: string;
  description?: string;
  address: string;
  status: string;
  createdAt: string;
  scheduleDate?: string;

  serviceId?: {
    _id: string;
    name: string;
    price: number;
  };

  repairmanId?: {
    name: string;
  };
};

type Service = {
  _id: string;
  name: string;
};

export default function CustomerHome() {

  const [requests, setRequests] = useState<Request[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editService, setEditService] = useState<string>("");
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  const [editScheduleDate, setEditScheduleDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useFocusEffect(
    useCallback(() => {
      fetchMyRequests();
      fetchServices();
    }, [])
  );

  const fetchMyRequests = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/api/requests/customer/my`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/services`);
      setServices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const openEditModal = (request: Request) => {
    setSelectedRequest(request);
    setEditTitle(request.title);
    setEditDescription(request.description || "");
    setEditAddress(request.address);
    setEditService(request.serviceId?._id || "");
    setServiceDropdownOpen(false);

    if (request.scheduleDate) {
      setEditScheduleDate(new Date(request.scheduleDate));
    } else {
      setEditScheduleDate(new Date());
    }

    setModalVisible(true);
  };

  const updateRequest = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/requests/${selectedRequest?._id}`,
        {
          title: editTitle,
          description: editDescription,
          address: editAddress,
          serviceId: editService,
          scheduleDate: editScheduleDate.toISOString()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setModalVisible(false);
      fetchMyRequests();
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status?: string) => {
    if (status === "pending") return "#f59e0b";
    if (status === "assigned") return "#3b82f6";
    if (status === "in_progress") return "#6366f1";
    if (status === "completed") return "#10b981";
    if (status === "cancelled") return "#ef4444";
    return "gray";
  };

  const formatLocalDateTime = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  return (
    <ScrollView style={commonStyles.container}>

      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>My Requests</Text>
      </View>

      {requests.map((item) => (
        <Card key={item._id} style={commonStyles.card}>
          <Card.Content>

            <View style={commonStyles.rowTop}>

              <Text style={commonStyles.requestTitle}>
                {item.title}
              </Text>

              <Chip
                style={[
                  commonStyles.statusChip,
                  { backgroundColor: getStatusColor(item.status) }
                ]}
                textStyle={{ color: "white" }}
              >
                {item.status}
              </Chip>

            </View>

            <Text style={commonStyles.info}>
              🔧 Service: {item.serviceId?.name}
            </Text>

            <Text style={commonStyles.info}>
              📍 Address: {item.address}
            </Text>

            <Text style={commonStyles.info}>
              📅 {new Date(item.scheduleDate || "").toLocaleString()}
            </Text>

            {item.status === "pending" && (
              <Button
                mode="contained"
                style={styles.editBtn}
                onPress={() => openEditModal(item)}
              >
                Edit Request
              </Button>
            )}

          </Card.Content>
        </Card>
      ))}

      {/* MODAL */}

      <Modal visible={modalVisible} transparent animationType="slide">

        <View style={commonStyles.modalContainer}>

          <ScrollView style={commonStyles.modalContent} scrollEnabled={!serviceDropdownOpen}>

            <Text style={commonStyles.modalTitle}>
              Edit Request
            </Text>

            <Text style={commonStyles.label}>Title</Text>

            <TextInput
              style={commonStyles.input}
              value={editTitle}
              onChangeText={setEditTitle}
            />

            <Text style={commonStyles.label}>Service</Text>

            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setServiceDropdownOpen(!serviceDropdownOpen)}
              >
                <View style={styles.dropdownContent}>
                  <Text style={styles.dropdownButtonText}>
                    {editService
                      ? services.find((s) => s._id === editService)?.name
                      : "Select Service"}
                  </Text>
                  <Text style={styles.dropdownArrow}>
                    {serviceDropdownOpen ? "▲" : "▼"}
                  </Text>
                </View>
              </TouchableOpacity>

              {serviceDropdownOpen && (
                <View style={styles.dropdownListAbsolute}>
                  {services.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setEditService(item._id);
                        setServiceDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

            </View>

            <Text style={[commonStyles.label, serviceDropdownOpen && { marginTop: 180 }]}>
              Description
            </Text>

            <TextInput
              style={commonStyles.input}
              value={editDescription}
              onChangeText={setEditDescription}
              multiline
            />

            <Text style={commonStyles.label}>Address</Text>

            <TextInput
              style={commonStyles.input}
              value={editAddress}
              onChangeText={setEditAddress}
            />

            <Text style={commonStyles.label}>
              Schedule Date
            </Text>

            {Platform.OS === "web" ? (

              <input
                type="datetime-local"
                title="Schedule Date"
                placeholder="Select schedule date"
                value={formatLocalDateTime(editScheduleDate)}
                onChange={(e) =>
                  setEditScheduleDate(new Date(e.target.value))
                }
                style={styles.webInput}
              />

            ) : (

              <>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setPickerMode("date");
                    setShowDatePicker(true);
                  }}
                >
                  {editScheduleDate.toLocaleString()}
                </Button>

                {showDatePicker && (
                  <DateTimePicker
                    value={editScheduleDate}
                    mode={pickerMode}
                    minimumDate={new Date()}
                    display="default"
                    onChange={(event, date) => {

                      setShowDatePicker(false);

                      if (event.type === "dismissed") return;

                      if (pickerMode === "date") {
                        setPickerMode("time");
                        setEditScheduleDate(date || editScheduleDate);
                        setShowDatePicker(true);
                      } else {
                        setEditScheduleDate(date || editScheduleDate);
                      }

                    }}
                  />
                )}
              </>
            )}

            <View style={commonStyles.modalButtons}>

              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
              >
                Cancel
              </Button>

              <Button
                mode="contained"
                onPress={updateRequest}
              >
                Save
              </Button>

            </View>

          </ScrollView>

        </View>

      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  editBtn: {
    marginTop: 10
  },
  dropdownWrapper: {
    position: "relative",
    marginBottom: 10,
    zIndex: 10
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#fff"
  },
  dropdownContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
    flex: 1
  },
  dropdownArrow: {
    fontSize: 18,
    color: "#666",
    marginLeft: 10
  },
  dropdownListAbsolute: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
    maxHeight: 200,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333"
  },
  webInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 15,
    fontSize: 16
  }
});