import { View, ScrollView } from "react-native";
import { Text, Card, Chip, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import axios from "axios";
import { commonStyles } from "../../../styles/commonStyle";
import { Alert, Platform } from "react-native";
import { Modal, Portal, Menu } from "react-native-paper";

type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
};

export default function UserList() {

  const [users, setUsers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState("all");

  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [role, setRole] = useState("");


  const API_URL = "http://localhost:5000/api/users";


  const getUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    getUsers();
  }, []);


  const filteredUsers =
    filterRole === "all"
      ? users
      : users.filter((u) => u.role === filterRole);
  const toggleUserActive = async (user: User) => {

    const message = user.is_active
      ? "Are you sure you want to deactivate this user?"
      : "Are you sure you want to activate this user?";

    if (Platform.OS === "web") {

      const confirm = window.confirm(message);

      if (!confirm) return;

      try {

        await axios.patch(
          `${API_URL}/${user._id}/toggle-active`
        );

        getUsers();

      } catch (err) {
        console.log(err);
      }

    } else {

      Alert.alert(
        "Confirm",
        message,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "OK",
            onPress: async () => {
              try {

                await axios.patch(
                  `${API_URL}/${user._id}/toggle-active`
                );

                getUsers();

              } catch (err) {
                console.log(err);
              }
            }
          }
        ]
      );

    }

  };
  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setRole(user.role);
    setRoleModalVisible(true);
  };

  const updateRole = async () => {
    if (!selectedUser) return;

    try {

      await axios.patch(
        `${API_URL}/${selectedUser._id}`,
        { role }
      );

      setRoleModalVisible(false);
      getUsers();

    } catch (err) {
      console.log(err);
    }
  };


  return (
    <ScrollView style={commonStyles.container}>

      <Text style={commonStyles.title}>Users</Text>


      {/* FILTER ROLE */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 15 }}>

        <Chip
          selected={filterRole === "all"}
          onPress={() => setFilterRole("all")}
        >
          All
        </Chip>

        <Chip
          selected={filterRole === "admin"}
          onPress={() => setFilterRole("admin")}
        >
          Admin
        </Chip>

        <Chip
          selected={filterRole === "repairman"}
          onPress={() => setFilterRole("repairman")}
        >
          Repairman
        </Chip>

        <Chip
          selected={filterRole === "customer"}
          onPress={() => setFilterRole("customer")}
        >
          Customer
        </Chip>

      </View>


      {/* USER LIST */}

      {filteredUsers.map((item) => (

        <Card
          key={item._id}
          style={commonStyles.card}

        >
          <Card.Content>

            <View style={commonStyles.rowTop}>

              <Text style={commonStyles.requestTitle}>
                👤 {item.name}
              </Text>

              <Chip
                style={[
                  commonStyles.statusChip,
                  item.is_active
                    ? commonStyles.statusActive
                    : commonStyles.statusInactive
                ]}
                textStyle={
                  item.is_active
                    ? commonStyles.statusTextActive
                    : commonStyles.statusTextInactive
                }
              >
                {item.is_active ? "Active" : "Inactive"}
              </Chip>

            </View>

            <Text style={commonStyles.info}>📧 {item.email}</Text>
            <Text style={commonStyles.info}>📱 {item.phone}</Text>
            <Text style={commonStyles.info}>🎭 Role: {item.role}</Text>


            {/* ACTION BUTTON */}
            <Button
              mode="outlined"
              onPress={() => openRoleModal(item)}
            >
              Change Role
            </Button>

            <Button
              mode="contained"
              style={commonStyles.button}
              onPress={() => toggleUserActive(item)}
            >
              {item.is_active ? "Deactivate" : "Activate"}
            </Button>

          </Card.Content>
        </Card>
      ))}
      <Portal>
        <Modal
          visible={roleModalVisible}
          onDismiss={() => setRoleModalVisible(false)}
          contentContainerStyle={commonStyles.modal}
        >

          <Text style={commonStyles.modalTitle}>Change Role</Text>

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
              >
                {role || "Select Role"}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setRole("admin");
                setMenuVisible(false);
              }}
              title="Admin"
            />

            <Menu.Item
              onPress={() => {
                setRole("repairman");
                setMenuVisible(false);
              }}
              title="Repairman"
            />

            <Menu.Item
              onPress={() => {
                setRole("customer");
                setMenuVisible(false);
              }}
              title="Customer"
            />
          </Menu>

          <View style={commonStyles.modalButtons}>

            <Button onPress={() => setRoleModalVisible(false)}>
              Cancel
            </Button>

            <Button mode="contained" onPress={updateRole}>
              Save
            </Button>

          </View>

        </Modal>
      </Portal>

    </ScrollView>
  );
}
