import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Eye,
  Globe,
  LoaderCircle,
  MapPin,
  PencilLine,
  Plus,
  Save,
  Search,
  Phone,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { SUPERADMIN_COMPANIES } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/client";
import { useAuthStore } from "@/store/auth-store";
import { SuperAdminLayout } from "../components/super-admin-layout";

const COMPANY_PROFILE_STORAGE_KEY = "conectio-company-profiles";

function normalizeCompanies(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.companies)) {
    return data.companies;
  }

  return [];
}

function readStoredProfiles() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(localStorage.getItem(COMPANY_PROFILE_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function CompaniesPage() {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const [search, setSearch] = useState("");
  const [storedProfiles, setStoredProfiles] = useState(() => readStoredProfiles());
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftProfile, setDraftProfile] = useState({
    phone: "",
    address: "",
  });

  const companiesQuery = useQuery({
    queryKey: ["super-admin-companies-page"],
    queryFn: async () => {
      const response = await apiClient.get(SUPERADMIN_COMPANIES, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      return normalizeCompanies(response.data);
    },
  });

  const companies = companiesQuery.data || [];

  const filteredCompanies = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return companies;
    }

    return companies.filter((company) => {
      const name = (company.name || company.company_name || "").toLowerCase();
      const domain = (company.domain || "").toLowerCase();
      const id = (company.id || company.company_id || "").toLowerCase();

      return (
        name.includes(term) ||
        domain.includes(term) ||
        id.includes(term)
      );
    });
  }, [companies, search]);

  useEffect(() => {
    if (!selectedCompany) {
      return;
    }

    const companyId = selectedCompany.id || selectedCompany.company_id || "";
    const storedProfile = storedProfiles[companyId] || {};

    setDraftProfile({
      phone: storedProfile.phone || selectedCompany.phone || selectedCompany.mobile_number || "",
      address: storedProfile.address || selectedCompany.address || "",
    });
  }, [selectedCompany, storedProfiles]);

  function handleOpenView(company) {
    setSelectedCompany(company);
    setIsEditing(false);
    setIsViewOpen(true);
  }

  function handleSaveProfile() {
    if (!selectedCompany) {
      return;
    }

    const companyId = selectedCompany.id || selectedCompany.company_id || "";
    const nextProfiles = {
      ...storedProfiles,
      [companyId]: {
        phone: draftProfile.phone.trim(),
        address: draftProfile.address.trim(),
      },
    };

    setStoredProfiles(nextProfiles);
    localStorage.setItem(COMPANY_PROFILE_STORAGE_KEY, JSON.stringify(nextProfiles));
    setIsEditing(false);
    toast.success("Company details saved locally.");
  }

  const selectedCompanyId = selectedCompany?.id || selectedCompany?.company_id || "";
  const selectedCompanyProfile = selectedCompanyId ? storedProfiles[selectedCompanyId] || {} : {};
  const selectedCompanyPhone =
    draftProfile.phone || selectedCompanyProfile.phone || selectedCompany?.phone || selectedCompany?.mobile_number || "Not added yet";
  const selectedCompanyAddress =
    draftProfile.address || selectedCompanyProfile.address || selectedCompany?.address || "Not added yet";

  return (
    <SuperAdminLayout>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-brand-secondary">
            <Building2 className="size-3.5 text-brand-primary" />
            All Companies
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
              Browse every onboarded company in one place.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-brand-secondary sm:text-base">
              Use this view to inspect tenant details, copy company IDs, and jump
              into the company-admin invitation flow without switching between forms.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            className="h-11 rounded-2xl bg-brand-primary px-5 text-white hover:bg-brand-primary/90"
            onClick={() => navigate("/super-admin/dashboard/companies/create")}
          >
            <Plus className="size-4" />
            Add company
          </Button>
        </div>
      </div>

      <section className="mt-8 rounded-[32px] border border-brand-line bg-white p-6 shadow-[0_16px_50px_rgba(68,83,74,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-secondary">
              Collection
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-brand-ink">
              Company directory
            </h3>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="rounded-full border border-brand-line bg-brand-neutral px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              {filteredCompanies.length} results
            </span>
            <div className="relative min-w-[260px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-secondary" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by company name"
                className="h-12 rounded-2xl border-brand-line bg-brand-neutral pl-11 text-brand-ink"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          {companiesQuery.isLoading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 rounded-[24px] border border-brand-line bg-brand-neutral text-brand-secondary">
              <LoaderCircle className="size-5 animate-spin" />
              Loading companies
            </div>
          ) : companiesQuery.isError ? (
            <div className="rounded-[24px] border border-brand-tertiary/20 bg-brand-tertiary/5 p-5 text-sm text-brand-tertiary">
              Unable to load companies right now. Try signing in again or refreshing
              the page.
            </div>
          ) : filteredCompanies.length ? (
            <div className="overflow-hidden rounded-[24px] border border-brand-line">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-brand-neutral">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">
                        Company Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredCompanies.map((company, index) => {
                      const companyId = company.id || company.company_id || "";
                      const companyName =
                        company.name || company.company_name || `Company ${index + 1}`;
                      const companyDomain = company.domain || "Domain not available";
                      const status =
                        company.status ||
                        company.company_status ||
                        "Active";

                      return (
                        <tr
                          key={companyId || `${companyName}-${index}`}
                          className="border-t border-brand-line transition hover:bg-brand-neutral/60"
                        >
                          <td className="px-6 py-5">
                            <div className="space-y-1">
                              <p className="text-base font-semibold text-brand-ink">
                                {companyName}
                              </p>
                              <p className="text-sm text-brand-secondary">
                                {companyDomain}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex rounded-full border border-brand-line bg-brand-neutral px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <Button
                              type="button"
                              variant="outline"
                              className="h-11 rounded-2xl border-brand-line bg-white px-5 text-brand-ink hover:bg-brand-soft"
                              onClick={() => handleOpenView(company)}
                            >
                              <Eye className="size-4" />
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] border border-brand-line bg-brand-neutral p-6 text-sm text-brand-secondary">
              No companies match this search yet.
            </div>
          )}
        </div>
      </section>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent
          showCloseButton={false}
          className="left-1/2 w-[calc(100vw-3rem)] max-w-[820px] sm:max-w-[820px] rounded-[30px] border border-brand-line bg-transparent p-0 text-brand-ink shadow-none ring-0 lg:left-[calc(50%+146px)]"
        >
          <div className="overflow-hidden rounded-[30px] border border-brand-line bg-white shadow-[0_22px_64px_rgba(68,83,74,0.15)]">
            <div className="border-b border-brand-line bg-gradient-to-br from-brand-soft via-white to-brand-neutral px-6 py-6 sm:px-7 lg:px-8 lg:py-7">
              <div className="flex items-start justify-between gap-6">
                <DialogHeader className="space-y-5 text-left">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-line bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-secondary">
                    <Building2 className="size-3.5 text-brand-primary" />
                    Company Details
                  </div>
                  <DialogTitle className="text-3xl font-semibold tracking-tight text-brand-ink">
                    {selectedCompany?.name || selectedCompany?.company_name || "Company"}
                  </DialogTitle>
                  <DialogDescription className="max-w-xl text-sm leading-7 text-brand-secondary">
                    Review core company details here. Phone number and address can be
                    updated from this view while backend support for those fields is still
                    being integrated.
                  </DialogDescription>
                </DialogHeader>

                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-9 w-9 rounded-full border border-brand-line bg-white text-brand-ink hover:bg-brand-soft"
                  >
                    <span className="text-lg leading-none">×</span>
                  </Button>
                </DialogClose>
              </div>
            </div>

            <div className="bg-white px-6 py-6 sm:px-7 lg:px-8 lg:py-7">
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="min-h-32 rounded-[22px] border border-brand-line bg-brand-neutral p-4 lg:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                    Company ID
                  </p>
                  <p className="mt-3 break-all text-[15px] leading-7 text-brand-ink">
                    {selectedCompanyId || "Not available"}
                  </p>
                </div>

                <div className="min-h-32 rounded-[22px] border border-brand-line bg-brand-neutral p-4 lg:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                    Domain
                  </p>
                  <div className="mt-3 flex items-start gap-3 text-[15px] leading-7 text-brand-ink">
                    <Globe className="mt-1 size-4 shrink-0 text-brand-primary" />
                    <span className="break-all">{selectedCompany?.domain || "Not available"}</span>
                  </div>
                </div>

                <div className="min-h-32 rounded-[22px] border border-brand-line bg-brand-neutral p-4 lg:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                    Phone number
                  </p>
                  {isEditing ? (
                    <Input
                      value={draftProfile.phone}
                      onChange={(event) =>
                        setDraftProfile((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                      }
                      placeholder="Enter company phone number"
                      className="mt-3 h-10 rounded-2xl border-brand-line bg-white text-sm text-brand-ink"
                    />
                  ) : (
                    <div className="mt-3 flex items-start gap-3 text-[15px] leading-7 text-brand-ink">
                      <Phone className="mt-1 size-4 shrink-0 text-brand-primary" />
                      <span>{selectedCompanyPhone}</span>
                    </div>
                  )}
                </div>

                <div className="min-h-32 rounded-[22px] border border-brand-line bg-brand-neutral p-4 lg:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                    Address
                  </p>
                  {isEditing ? (
                    <textarea
                      value={draftProfile.address}
                      onChange={(event) =>
                        setDraftProfile((current) => ({
                          ...current,
                          address: event.target.value,
                        }))
                      }
                      placeholder="Enter company address"
                      className="mt-3 min-h-24 w-full rounded-2xl border border-brand-line bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                    />
                  ) : (
                    <div className="mt-3 flex items-start gap-3 text-[15px] leading-7 text-brand-ink">
                      <MapPin className="mt-1 size-4 shrink-0 text-brand-primary" />
                      <span>{selectedCompanyAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="rounded-none border-t border-brand-line bg-brand-neutral/70 px-6 py-4 sm:px-7 lg:px-8">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-2xl border-brand-line bg-white px-5 text-brand-ink hover:bg-brand-soft"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="h-11 rounded-2xl bg-brand-primary px-5 text-white hover:bg-brand-primary/90"
                  onClick={handleSaveProfile}
                >
                  <Save className="size-4" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  className="h-11 rounded-2xl bg-brand-primary px-5 text-white hover:bg-brand-primary/90"
                  onClick={() => setIsEditing(true)}
                >
                  <PencilLine className="size-4" />
                  Edit details
                </Button>
              </>
            )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  );
}
