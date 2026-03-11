import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
export default function TabLayout() {

    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {

            const data = await AsyncStorage.getItem("User");

            if (data) {
                const user = JSON.parse(data);
                setRole(user.role);
            }

            setLoading(false);
        };

        loadUser();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#007AFF",
                tabBarInactiveTintColor: "gray",
            }}
        >
            {/* Home */}
            <Tabs.Screen
                name="home/index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color} />
                    ),
                }}
            />


            <Tabs.Screen
                name="user/index"
                options={{
                    title: "Users",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="users" size={size} color={color} />),
                    ...(role !== "admin" && { href: null })
                }}
            />

            <Tabs.Screen
                name="service/index"
                options={{
                    title: "Service",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home-repair-service" size={size} color={color} />
                    ),
                    ...(role !== "admin" && { href: null })
                }}
            />
            <Tabs.Screen
                name="request/create"
                options={{
                    title: "Create Request",
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialIcons name="request-page" size={size} color={color} />
                    ),
                    ...(role !== "customer" && { href: null })
                }}
            />




            {/* Profile */}
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color}/>
                    ),
                }}
            />

            <Tabs.Screen
                name="home/(role)/admin"
                options={{ href: null }}
            />

            <Tabs.Screen
                name="home/(role)/customer"
                options={{ href: null }}
            />

            <Tabs.Screen
                name="home/(role)/repairman"
                options={{ href: null }}
            />


        </Tabs>
    );
}

