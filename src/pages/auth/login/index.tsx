import { AuthFormHeader } from "@/components/features/auth/auth-form-header";
import { Link } from "react-router";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <div>
      {/* The page owns its presentation; the feature handles form state and submission. */}
      <AuthFormHeader title="Welcome back" description="Sign in to find your next favorite meal." />

      <LoginForm />

      <p className="mt-8 text-sm text-ink/70">
        New here?{" "}
        <Link className="font-semibold text-towel underline underline-offset-4 hover:text-ink" to={"/auth/signup"}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
