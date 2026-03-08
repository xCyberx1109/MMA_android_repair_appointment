import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function Index() {

  const token = useSelector((state:any) => state.auth.token);

  if (!token) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
