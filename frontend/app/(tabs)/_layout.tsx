import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
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
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Notification */}
            <Tabs.Screen
                name="notification/index"
                options={{
                    title: "Notification",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "notifications" : "notifications-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Profile */}
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={size}
                            color={color}
                        />
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

