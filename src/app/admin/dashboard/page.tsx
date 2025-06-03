"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardStats, Room, Message, LeaseInfo } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/NotificationCenter";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { formatPrice } from "@/lib/utils";
import {
  Home,
  Users,
  MessageCircle,
  Plus,
  LogOut,
  Settings,
  Eye,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  Clock,
  AlertTriangle,
  Building,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [expiringSoonLeases, setExpiringSoonLeases] = useState<LeaseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCalendarRoom, setSelectedCalendarRoom] = useState<Room | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, roomsRes, messagesRes, leasesRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/rooms"),
        fetch("/api/messages"),
        fetch("/api/leases/expiring-soon"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setRooms(roomsData);
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
      }

      if (leasesRes.ok) {
        const leasesData = await leasesRes.json();
        setExpiringSoonLeases(leasesData);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Set default selected room when rooms are loaded
  useEffect(() => {
    if (rooms.length > 0 && !selectedCalendarRoom) {
      setSelectedCalendarRoom(rooms.find((r) => !r.isAvailable) || rooms[0]);
    }
  }, [rooms, selectedCalendarRoom]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDashboardData(); // Reload data
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-black">Loading dashboard...</p>
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
              <Settings className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <Button variant="outline" onClick={() => router.push("/")}>
                <Eye className="h-4 w-4 mr-2" />
                View Public Site
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Rooms
                </CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRooms}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.availableRooms}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((stats.availableRooms / stats.totalRooms) * 100).toFixed(1)}
                  % available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Occupied</CardTitle>
                <Users className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.occupiedRooms}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.occupancyRate.toFixed(1)}% occupancy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(stats.monthlyRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average: {formatPrice(stats.averageRoomPrice)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Additional statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unread Messages
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.unreadMessages}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {stats.totalMessages} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Expiring Contracts
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.expiringSoonLeases}
                </div>
                <p className="text-xs text-muted-foreground">next 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Occupancy Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.occupancyRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.occupiedRooms} of {stats.totalRooms} rooms
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Important alerts */}
        {(expiringSoonLeases.length > 0 ||
          (stats && stats.unreadMessages > 0)) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-black mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Requires Attention
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {expiringSoonLeases.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-sm text-yellow-800">
                      Contracts expiring soon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {expiringSoonLeases.slice(0, 3).map((lease) => (
                        <div
                          key={lease.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-yellow-700">
                            {lease.tenantName}
                          </span>
                          <span className="text-yellow-600">
                            {new Date(lease.endDate).toLocaleDateString(
                              "en-US"
                            )}
                          </span>
                        </div>
                      ))}
                      {expiringSoonLeases.length > 3 && (
                        <p className="text-xs text-yellow-600">
                          +{expiringSoonLeases.length - 3} more
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {stats && stats.unreadMessages > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-sm text-orange-800">
                      Pending messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {messages
                        .filter((m) => !m.isRead)
                        .slice(0, 3)
                        .map((message) => (
                          <div key={message.id} className="text-sm">
                            <p className="text-orange-700 font-medium">
                              {message.senderName}
                            </p>
                            <p className="text-orange-600 truncate">
                              {message.content}
                            </p>
                          </div>
                        ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/admin/messages")}
                        className="w-full mt-2"
                      >
                        View All Messages
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-black mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => router.push("/admin/rooms/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Room
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/properties")}
            >
              <Building className="h-4 w-4 mr-2" />
              Manage Properties
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/messages")}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              View Messages ({messages.filter((m) => !m.isRead).length})
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/calendar")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Full Calendar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room list */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">Recent Rooms</h2>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/rooms")}
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {rooms.slice(0, 4).map((room) => (
                <Card key={room.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-black">
                          {room.name}
                        </h3>
                        <p className="text-sm text-black">
                          {room.property?.address}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            room.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {room.isAvailable ? "Available" : "Occupied"}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(room.price)}
                      </p>
                      <p className="text-sm text-black">
                        {room.maxOccupants} person
                        {room.maxOccupants !== 1 ? "s" : ""}
                        {room.size && ` • ${room.size}m²`}
                      </p>
                    </div>

                    {!room.isAvailable && room.leaseEndDate && (
                      <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                        <span className="text-yellow-800">
                          Available from:{" "}
                          {new Date(room.leaseEndDate).toLocaleDateString(
                            "en-US"
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/rooms/${room.id}/edit`)
                        }
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {rooms.length === 0 && (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-black mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-black mb-2">
                    No rooms registered
                  </h3>
                  <p className="text-black mb-4">
                    Start by adding your first room to the system.
                  </p>
                  <Button onClick={() => router.push("/admin/rooms/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Calendar for selected room */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">
                Calendar View
              </h2>
              {rooms.length > 1 && (
                <select
                  value={selectedCalendarRoom?.id || ""}
                  onChange={(e) => {
                    const room = rooms.find((r) => r.id === e.target.value);
                    setSelectedCalendarRoom(room || null);
                  }}
                  className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {rooms.length > 0 && selectedCalendarRoom ? (
              <AvailabilityCalendar
                room={selectedCalendarRoom}
                leases={expiringSoonLeases.filter(
                  (l) => l.roomId === selectedCalendarRoom.id
                )}
                compact={false}
              />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-black mx-auto mb-3" />
                  <p className="text-black">No rooms to display in calendar</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
