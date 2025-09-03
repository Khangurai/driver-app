import { Redirect } from "expo-router";
import { useAuth } from "./context/AuthContext";
import LoginScreen from "./login";

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return <LoginScreen />;

  return <Redirect href="/(tabs)/index" />;
}
