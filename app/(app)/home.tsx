import { ScreenContainer } from "../../components/common/ScreenContainer";
import { LoadingState } from "../../components/common/LoadingState";
import { GuardianHome } from "../../components/dashboard/GuardianHome";
import { ChildHome } from "../../components/dashboard/ChildHome";
import { AdminHome } from "../../components/dashboard/AdminHome";
import { useAuthStore } from "../../store/authStore";

export default function HomeScreen() {
  const role = useAuthStore((s) => s.role);

  return (
    <ScreenContainer>
      {role === "guardian" && <GuardianHome />}
      {role === "child" && <ChildHome />}
      {role === "admin" && <AdminHome />}
      {!role && <LoadingState message="Loading your dashboard..." />}
    </ScreenContainer>
  );
}
