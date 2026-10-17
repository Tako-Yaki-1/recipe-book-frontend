import { AuthHeader } from "@/components/features/auth/auth-header";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/components/context/use-auth";

export default function AuthLayout() {
  const { user, ready } = useAuth();

  if (ready && user) return <Navigate to={user.role === "ADMIN" ? "/admin" : "/user"} replace />;
  return (
    <main className="grid min-h-svh lg:grid-cols-[5fr_6fr]">
      <AuthHeader />
      <div className="flex items-center px-6 py-12 sm:px-12 lg:px-20">
        {/* The layout stays mounted when switching between login and signup, so this fades in only once. */}
        <div className="w-full max-w-md animate-fade motion-reduce:animate-none" style={{ animationDelay: "500ms" }}>
          {ready && <Outlet />}
        </div>
      </div>
    </main>
  );
}
