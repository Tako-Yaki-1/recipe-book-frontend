import { useNavigate } from "react-router";
import { useState, type SubmitEvent } from "react";
import { useAuth } from "@/components/context/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return "Could not connect to the API. Check that the API server is running.";
}

export function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Keep field values in React state; the auth context calls the API service.
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const currentUser = await signup(name, email, password);
      // Navigate after the context has received the authenticated user.
      const destination = currentUser.role === "ADMIN" ? "/admin" : "/user";
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      <div>
        <Label htmlFor="auth-name">Name</Label>
        <Input id="auth-name" autoComplete="name" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} />
      </div>
      <div>
        <Label htmlFor="auth-email">Email</Label>
        <Input id="auth-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>
      <div>
        <Label htmlFor="auth-password">Password</Label>
        <PasswordInput id="auth-password" autoComplete={"new-password"} required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      <p className="-mt-2 text-sm text-ink/70">Use at least 8 characters, including one uppercase letter and one number.</p>
      {error && <p role="alert" className="animate-nudge text-sm text-tomato motion-reduce:animate-none">{error}</p>}
      <Button type="submit" disabled={busy} className="mt-2 w-full gap-2 disabled:cursor-wait">
        {busy && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />}
        {busy ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
