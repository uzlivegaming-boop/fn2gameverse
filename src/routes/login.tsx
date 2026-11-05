import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/AuthLayout";
import { Button, Field } from "@/components/ui-kit";
import { login } from "@/services/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () => seo("Login", "Sign in to your GameVerse account."),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email.";
    if (!password) errs.password = "Password is required.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your adventure.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {errors.form && <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{errors.form}</p>}
        <Field label="Email" error={errors.email}>
          <input className="field" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password" error={errors.password}>
          <input className="field" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Login"}</Button>
        <p className="text-center text-sm text-muted-foreground">
          New here? <Link to="/register" className="font-semibold text-secondary hover:underline">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
