import { AuthFormHeader } from "@/components/features/auth/auth-form-header";
import { Link } from "react-router";
import { SignupForm } from "@/components/features/auth/signup-form";

export default function SignupPage() {
  return (
    <div>
      <AuthFormHeader title="Create your account" description="Start saving the meals you cook most." />

      <SignupForm />

      <p className="mt-8 text-sm text-ink/70">
        Already have an account?{" "}
        <Link className="font-semibold text-towel underline underline-offset-4 hover:text-ink" to={"/auth/login"}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
