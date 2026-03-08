import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Admin from "./(role)/admin";
import Customer from "./(role)/customer";
import Repairman from "./(role)/repairman";

export default function Home() {

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const loadRole = async () => {
      const r = await AsyncStorage.getItem("role");
      setRole(r);
    };
    loadRole();
  }, []);

  if (!role) return null;

  if (role === "admin") return <Admin />;
  if (role === "repairman") return <Repairman />;

  return <Customer />;
}
