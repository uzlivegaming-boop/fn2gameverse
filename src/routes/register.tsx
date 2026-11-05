import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/AuthLayout";
import { Button, Field } from "@/components/ui-kit";
import { register } from "@/services/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/register")({
  head: () => seo("Register", "Create your free GameVerse account."),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [v, setV] = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const up = (k: keyof typeof v) => (e: ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(v.username)) errs.username = "3–20 letters, numbers or underscores.";
    if (!/^\S+@\S+\.\S+$/.test(v.email)) errs.email = "Enter a valid email.";
    if (v.password.length < 6) errs.password = "At least 6 characters.";
    if (v.confirm !== v.password) errs.confirm = "Passwords do not match.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await register(v.username, v.email, v.password);
      toast.success("Account created! Welcome to GameVerse.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Join GameVerse" subtitle="Create your account in seconds.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {errors.form && <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{errors.form}</p>}
        <Field label="Username" error={errors.username}><input className="field" value={v.username} onChange={up("username")} autoComplete="username" /></Field>
        <Field label="Email" error={errors.email}><input className="field" type="email" value={v.email} onChange={up("email")} autoComplete="email" /></Field>
        <Field label="Password" error={errors.password}><input className="field" type="password" value={v.password} onChange={up("password")} autoComplete="new-password" /></Field>
        <Field label="Confirm password" error={errors.confirm}><input className="field" type="password" value={v.confirm} onChange={up("confirm")} autoComplete="new-password" /></Field>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? "Creating account…" : "Create account"}</Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-semibold text-secondary hover:underline">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
