"use client";

import { useState, useEffect } from "react";
import {
  format,
  addMonths,
  differenceInDays,
  differenceInMonths,
} from "date-fns";
import { LeaseInfo, Room } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  CalendarCheck,
  Mail,
  Phone,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ExtendedLease extends LeaseInfo {
  room?: Room;
}

export default function LeasesPage() {
  const router = useRouter();
  const [leases, setLeases] = useState<ExtendedLease[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedLease, setSelectedLease] = useState<ExtendedLease | null>(
    null
  );
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showChangeTenantModal, setShowChangeTenantModal] = useState(false);
  const [showNewLeaseModal, setShowNewLeaseModal] = useState(false);

  // Form states
  const [extendForm, setExtendForm] = useState({
    newEndDate: "",
    newRent: "",
  });

  const [tenantForm, setTenantForm] = useState({
    newTenantName: "",
    newTenantEmail: "",
    newTenantPhone: "",
    effectiveDate: "",
  });

  const [newLeaseForm, setNewLeaseForm] = useState({
    roomId: "",
    tenantName: "",
    tenantEmail: "",
    tenantPhone: "",
    tenantEmergencyContact: "",
    tenantEmergencyPhone: "",
    startDate: "",
    endDate: "",
    monthlyRent: "",
    deposit: "",
    depositPaid: false,
    autoRenewal: false,
    renewalNoticeDays: "30",
    leaseTerms: "",
    specialConditions: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leasesRes, roomsRes] = await Promise.all([
        fetch("/api/leases"),
        fetch("/api/rooms"),
      ]);

      if (leasesRes.ok) {
        const leasesData = await leasesRes.json();
        setLeases(leasesData);
      }

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setRooms(roomsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "ending_soon":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "terminated":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "current":
        return "bg-green-100 text-green-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredLeases = leases
    .filter((lease) => {
      if (filter === "all") return true;
      return lease.status === filter;
    })
    .filter((lease) => {
      if (!search) return true;
      return (
        lease.tenantName.toLowerCase().includes(search.toLowerCase()) ||
        lease.tenantEmail.toLowerCase().includes(search.toLowerCase()) ||
        rooms
          .find((r) => r.id === lease.roomId)
          ?.name.toLowerCase()
          .includes(search.toLowerCase())
      );
    });

  const handleExtendLease = async () => {
    if (!selectedLease || !extendForm.newEndDate) return;

    try {
      const response = await fetch(`/api/leases/${selectedLease.id}/extend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEndDate: extendForm.newEndDate,
          newRent: extendForm.newRent
            ? parseFloat(extendForm.newRent)
            : undefined,
        }),
      });

      if (response.ok) {
        setShowExtendModal(false);
        setExtendForm({ newEndDate: "", newRent: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error extending lease:", error);
    }
  };

  const handleChangeTenant = async () => {
    if (
      !selectedLease ||
      !tenantForm.newTenantName ||
      !tenantForm.newTenantEmail
    )
      return;

    try {
      const response = await fetch(
        `/api/leases/${selectedLease.id}/change-tenant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tenantForm),
        }
      );

      if (response.ok) {
        setShowChangeTenantModal(false);
        setTenantForm({
          newTenantName: "",
          newTenantEmail: "",
          newTenantPhone: "",
          effectiveDate: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error changing tenant:", error);
    }
  };

  const handleTerminateLease = async (leaseId: string) => {
    if (!confirm("Are you sure you want to terminate this lease?")) return;

    try {
      const reason = prompt("Please provide a reason for termination:");
      if (!reason) return;

      const response = await fetch(`/api/leases/${leaseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error terminating lease:", error);
    }
  };

  const handleCreateLease = async () => {
    if (
      !newLeaseForm.roomId ||
      !newLeaseForm.tenantName ||
      !newLeaseForm.tenantEmail
    )
      return;

    try {
      const leaseTermsArray = newLeaseForm.leaseTerms
        .split("\n")
        .filter((term) => term.trim())
        .map((term) => term.trim());

      const response = await fetch("/api/leases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newLeaseForm,
          monthlyRent: parseFloat(newLeaseForm.monthlyRent),
          deposit: parseFloat(newLeaseForm.deposit),
          renewalNoticeDays: parseInt(newLeaseForm.renewalNoticeDays),
          leaseTerms: leaseTermsArray,
        }),
      });

      if (response.ok) {
        setShowNewLeaseModal(false);
        setNewLeaseForm({
          roomId: "",
          tenantName: "",
          tenantEmail: "",
          tenantPhone: "",
          tenantEmergencyContact: "",
          tenantEmergencyPhone: "",
          startDate: "",
          endDate: "",
          monthlyRent: "",
          deposit: "",
          depositPaid: false,
          autoRenewal: false,
          renewalNoticeDays: "30",
          leaseTerms: "",
          specialConditions: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating lease:", error);
    }
  };

  const getDaysUntilExpiry = (endDate: Date) => {
    return differenceInDays(new Date(endDate), new Date());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-900">Loading leases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin/dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Settings className="h-8 w-8 text-blue-600 mr-2" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Lease Management
                </h1>
                <p className="text-sm text-gray-600">
                  Manage tenant contracts and lease agreements
                </p>
              </div>
            </div>
            <Button onClick={() => setShowNewLeaseModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Lease
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Leases
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        leases.filter(
                          (l) =>
                            l.status === "active" || l.status === "ending_soon"
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Expiring Soon
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {leases.filter((l) => l.status === "ending_soon").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Monthly Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      $
                      {leases
                        .filter(
                          (l) =>
                            l.status === "active" || l.status === "ending_soon"
                        )
                        .reduce((sum, l) => sum + l.monthlyRent, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Avg. Duration
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(
                        leases
                          .filter(
                            (l) =>
                              l.status === "active" ||
                              l.status === "ending_soon"
                          )
                          .reduce((sum, l) => {
                            const months = differenceInMonths(
                              new Date(l.endDate),
                              new Date(l.startDate)
                            );
                            return sum + months;
                          }, 0) /
                          Math.max(
                            leases.filter(
                              (l) =>
                                l.status === "active" ||
                                l.status === "ending_soon"
                            ).length,
                            1
                          )
                      )}{" "}
                      months
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by tenant name, email, or room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Leases</option>
              <option value="active">Active</option>
              <option value="ending_soon">Ending Soon</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          {/* Leases Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLeases.map((lease) => {
              const room = rooms.find((r) => r.id === lease.roomId);
              const daysUntilExpiry = getDaysUntilExpiry(lease.endDate);

              return (
                <Card
                  key={lease.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {room?.name || "Unknown Room"}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {lease.tenantName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(lease.status)}>
                          {lease.status.replace("_", " ")}
                        </Badge>
                        <Badge
                          className={getPaymentStatusColor(lease.paymentStatus)}
                        >
                          {lease.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Tenant Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">
                          {lease.tenantEmail}
                        </span>
                      </div>
                      {lease.tenantPhone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">
                            {lease.tenantPhone}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Lease Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Monthly Rent</p>
                        <p className="font-semibold">
                          ${lease.monthlyRent.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deposit</p>
                        <p className="font-semibold">
                          ${lease.deposit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Start Date</p>
                        <p className="font-semibold">
                          {format(new Date(lease.startDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">End Date</p>
                        <p className="font-semibold">
                          {format(new Date(lease.endDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>

                    {/* Days until expiry warning */}
                    {lease.status === "active" &&
                      daysUntilExpiry <= 60 &&
                      daysUntilExpiry > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                            <span className="text-sm text-yellow-800">
                              Expires in {daysUntilExpiry} days
                            </span>
                          </div>
                        </div>
                      )}

                    {/* Lease Terms Preview */}
                    {lease.leaseTerms && lease.leaseTerms.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Terms:
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {lease.leaseTerms.slice(0, 2).map((term, index) => (
                            <li key={index}>• {term}</li>
                          ))}
                          {lease.leaseTerms.length > 2 && (
                            <li className="text-gray-500">
                              • And {lease.leaseTerms.length - 2} more...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedLease(lease);
                          setExtendForm({
                            newEndDate: format(
                              addMonths(new Date(lease.endDate), 6),
                              "yyyy-MM-dd"
                            ),
                            newRent: lease.monthlyRent.toString(),
                          });
                          setShowExtendModal(true);
                        }}
                        disabled={
                          lease.status === "expired" ||
                          lease.status === "terminated"
                        }
                      >
                        <CalendarCheck className="h-4 w-4 mr-1" />
                        Extend
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedLease(lease);
                          setTenantForm({
                            newTenantName: lease.tenantName,
                            newTenantEmail: lease.tenantEmail,
                            newTenantPhone: lease.tenantPhone || "",
                            effectiveDate: format(new Date(), "yyyy-MM-dd"),
                          });
                          setShowChangeTenantModal(true);
                        }}
                        disabled={
                          lease.status === "expired" ||
                          lease.status === "terminated"
                        }
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Change
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTerminateLease(lease.id)}
                        disabled={
                          lease.status === "expired" ||
                          lease.status === "terminated"
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        End
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredLeases.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No leases found
              </h3>
              <p className="text-gray-600">
                {filter === "all"
                  ? "No lease agreements exist yet. Create your first lease."
                  : `No leases match the selected filter: ${filter}`}
              </p>
            </div>
          )}

          {/* Extend Lease Modal */}
          {showExtendModal && selectedLease && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-bold mb-4">Extend Lease</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New End Date
                    </label>
                    <Input
                      type="date"
                      value={extendForm.newEndDate}
                      onChange={(e) =>
                        setExtendForm((prev) => ({
                          ...prev,
                          newEndDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Monthly Rent (optional)
                    </label>
                    <Input
                      type="number"
                      placeholder={`Current rent: $${selectedLease.monthlyRent}`}
                      value={extendForm.newRent}
                      onChange={(e) =>
                        setExtendForm((prev) => ({
                          ...prev,
                          newRent: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button
                    onClick={handleExtendLease}
                    disabled={!extendForm.newEndDate}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Extend Lease
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowExtendModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Change Tenant Modal */}
          {showChangeTenantModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-bold mb-4">Change Tenant</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Tenant Name
                    </label>
                    <Input
                      type="text"
                      value={tenantForm.newTenantName}
                      onChange={(e) =>
                        setTenantForm((prev) => ({
                          ...prev,
                          newTenantName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Tenant Email
                    </label>
                    <Input
                      type="email"
                      value={tenantForm.newTenantEmail}
                      onChange={(e) =>
                        setTenantForm((prev) => ({
                          ...prev,
                          newTenantEmail: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Tenant Phone (optional)
                    </label>
                    <Input
                      type="tel"
                      value={tenantForm.newTenantPhone}
                      onChange={(e) =>
                        setTenantForm((prev) => ({
                          ...prev,
                          newTenantPhone: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective Date
                    </label>
                    <Input
                      type="date"
                      value={tenantForm.effectiveDate}
                      onChange={(e) =>
                        setTenantForm((prev) => ({
                          ...prev,
                          effectiveDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button
                    onClick={handleChangeTenant}
                    disabled={
                      !tenantForm.newTenantName || !tenantForm.newTenantEmail
                    }
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Change Tenant
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowChangeTenantModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* New Lease Modal - Simplified */}
          {showNewLeaseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Create New Lease</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room
                    </label>
                    <select
                      value={newLeaseForm.roomId}
                      onChange={(e) =>
                        setNewLeaseForm((prev) => ({
                          ...prev,
                          roomId: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a room</option>
                      {rooms
                        .filter((r) => r.isAvailable)
                        .map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name} - ${room.price}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tenant Name
                    </label>
                    <Input
                      type="text"
                      value={newLeaseForm.tenantName}
                      onChange={(e) =>
                        setNewLeaseForm((prev) => ({
                          ...prev,
                          tenantName: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tenant Email
                    </label>
                    <Input
                      type="email"
                      value={newLeaseForm.tenantEmail}
                      onChange={(e) =>
                        setNewLeaseForm((prev) => ({
                          ...prev,
                          tenantEmail: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={newLeaseForm.startDate}
                      onChange={(e) =>
                        setNewLeaseForm((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={newLeaseForm.endDate}
                      onChange={(e) =>
                        setNewLeaseForm((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Rent
                    </label>
                    <Input
                      type="number"
                      value={newLeaseForm.monthlyRent}
                      onChange={(e) =>
                        setNewLeaseForm((prev) => ({
                          ...prev,
                          monthlyRent: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deposit
                    </label>
                    <Input
                      type="number"
                      value={newLeaseForm.deposit}
                      onChange={(e) =>
                        setNewLeaseForm((prev) => ({
                          ...prev,
                          deposit: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lease Terms (one per line)
                    </label>
                    <Textarea
                      value={newLeaseForm.leaseTerms}
                      onChange={(e) =>
                        setNewLeaseForm((prev) => ({
                          ...prev,
                          leaseTerms: e.target.value,
                        }))
                      }
                      placeholder="No smoking inside the premises
No pets allowed  
Quiet hours: 10 PM - 7 AM"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button
                    onClick={handleCreateLease}
                    disabled={
                      !newLeaseForm.roomId ||
                      !newLeaseForm.tenantName ||
                      !newLeaseForm.tenantEmail
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Lease
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewLeaseModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
