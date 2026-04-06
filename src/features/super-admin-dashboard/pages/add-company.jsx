import { Building2, Globe, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { SUPERADMIN_CREATE_COMPANY } from "@/config/api";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/client";
import { useAuthStore } from "@/store/auth-store";
import { SuperAdminLayout } from "../components/super-admin-layout";

export function AddCompanyPage() {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      domain: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const normalizedDomain = data.domain.trim().replace(/^@+/, "");

      const response = await apiClient.post(SUPERADMIN_CREATE_COMPANY, null, {
        params: {
          name: data.name.trim(),
          domain: normalizedDomain,
        },
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      toast.success(response.data?.message || "Company created successfully.");
      navigate("/super-admin/dashboard", {
        replace: true,
        state: {
          createdCompany: response.data,
        },
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Unable to create the company right now.";

      toast.error(message);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-medium text-brand-secondary transition hover:text-brand-primary"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-ink">
              Register new company
            </h1>
            <p className="text-sm text-brand-secondary">
              Create a new tenant organization and configure its primary domain.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-brand-line bg-white p-8 shadow-[0_16px_50px_rgba(68,83,74,0.06)] md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {/* Company Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-semibold text-brand-ink"
                >
                  <Building2 className="size-4 text-brand-primary" />
                  Company Name <span className="text-brand-tertiary">*</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    {...register("name", {
                      required: "Company name is required.",
                      minLength: {
                        value: 2,
                        message: "Company name must be at least 2 characters.",
                      },
                    })}
                    placeholder="e.g. Acme Corp"
                    className={`h-12 w-full rounded-2xl border bg-brand-neutral px-4 text-sm transition focus:outline-none focus:ring-2 ${
                      errors.name
                        ? "border-brand-tertiary/50 ring-brand-tertiary/20"
                        : "border-brand-line focus:border-brand-primary focus:ring-brand-primary/10"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs font-medium text-brand-tertiary">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Domain Field */}
              <div className="space-y-2">
                <label
                  htmlFor="domain"
                  className="flex items-center gap-2 text-sm font-semibold text-brand-ink"
                >
                  <Globe className="size-4 text-brand-primary" />
                  Primary Domain <span className="text-brand-tertiary">*</span>
                </label>
                <div className="relative">
                  <input
                    id="domain"
                    {...register("domain", {
                      required: "Domain is required.",
                      minLength: {
                        value: 3,
                        message: "Domain must be at least 3 characters.",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid domain (e.g., example.com)",
                      },
                    })}
                    placeholder="e.g. acme.com"
                    className={`h-12 w-full rounded-2xl border bg-brand-neutral px-4 text-sm transition focus:outline-none focus:ring-2 ${
                      errors.domain
                        ? "border-brand-tertiary/50 ring-brand-tertiary/20"
                        : "border-brand-line focus:border-brand-primary focus:ring-brand-primary/10"
                    }`}
                  />
                  {errors.domain && (
                    <p className="mt-1.5 text-xs font-medium text-brand-tertiary">
                      {errors.domain.message}
                    </p>
                  )}
                </div>
                <p className="text-[11px] text-brand-secondary/70">
                  Use the company workspace domain like `pexpo.com`. We will send it
                  to the backend without a leading `@`.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-2xl border-brand-line px-8 text-brand-secondary hover:bg-brand-soft"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 rounded-2xl bg-brand-primary px-10 text-white shadow-lg shadow-brand-primary/20 transition-all hover:bg-brand-primary/90 hover:shadow-xl hover:shadow-brand-primary/30"
              >
                {isSubmitting ? "Creating..." : "Create company"}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-8 rounded-2xl border border-brand-primary/10 bg-brand-primary/5 p-4 text-sm text-brand-primary">
          <p className="leading-6">
            <strong>Pro Tip:</strong> After registration, you'll be prompted to invite the
            primary administrator for this company. Ensure the domain is correct as it
            will be used for identity verification.
          </p>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
