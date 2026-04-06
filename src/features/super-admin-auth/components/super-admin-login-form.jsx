import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSuperAdmin } from "@/lib/api/api";
import { useAuthStore } from "@/store/auth-store";

const defaultValues = {
  email: "",
  password: "",
};

export function SuperAdminLoginForm() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
  });

  const loginMutation = useMutation({
    mutationFn: loginSuperAdmin,
    onSuccess: (data, variables) => {
      setSession({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        role: data.user_role,
        email: variables.email,
      });

      toast.success("Super admin signed in successfully.");
      navigate("/super-admin/dashboard", { replace: true });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Unable to sign in right now. Check backend connectivity and try again.";

      toast.error(message);
    },
  });

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values);
  });

  return (
    <div className="w-full max-w-md rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur xl:p-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">
            <ShieldCheck className="size-3.5" />
            Platform Access
          </span>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Super admin sign in
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              Secure entry point for platform ownership, company provisioning,
              and global controls.
            </p>
          </div>
        </div>

        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
          <LockKeyhole className="size-5" />
        </div>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-800"
            htmlFor="super-admin-email"
          >
            Work email
          </label>
          <Input
            id="super-admin-email"
            type="email"
            placeholder="owner@conectio.app"
            autoComplete="email"
            className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-sm text-slate-950 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-slate-200"
            aria-invalid={Boolean(errors.email)}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email ? (
            <p className="text-sm text-rose-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label
              className="text-sm font-medium text-slate-800"
              htmlFor="super-admin-password"
            >
              Password
            </label>
            <button
              type="button"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              Forgot password?
            </button>
          </div>
          <Input
            id="super-admin-password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-sm text-slate-950 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-slate-200"
            aria-invalid={Boolean(errors.password)}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.password ? (
            <p className="text-sm text-rose-600">{errors.password.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Signing in
            </>
          ) : (
            "Continue to control center"
          )}
        </Button>
      </form>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Live backend contract: this form posts to
        <code className="ml-1 rounded bg-white px-1.5 py-0.5 text-xs text-slate-900">
          /auth/login?email=...&password=...
        </code>
        and stores the returned auth tokens in Zustand for the next protected
        screens.
      </div>
    </div>
  );
}
