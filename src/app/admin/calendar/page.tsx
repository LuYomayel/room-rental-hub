"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Room, LeaseInfo } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { ArrowLeft, Calendar as CalendarIcon, Home } from "lucide-react";

export default function CalendarPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [leases, setLeases] = useState<LeaseInfo[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, leasesRes] = await Promise.all([
        fetch("/api/rooms"),
        fetch("/api/leases/expiring-soon"),
      ]);

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setRooms(roomsData);
        if (roomsData.length > 0) {
          setSelectedRoom(roomsData[0]);
        }
      }

      if (leasesRes.ok) {
        const leasesData = await leasesRes.json();
        setLeases(leasesData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
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
              <CalendarIcon className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">
                Availability Calendar
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-black mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No rooms available
            </h3>
            <p className="text-gray-500 mb-4">
              Add rooms to see their availability calendar
            </p>
            <Button onClick={() => router.push("/admin/rooms/new")}>
              Add First Room
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Room Selector */}
            <div className="xl:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {rooms.map((room) => (
                      <Button
                        key={room.id}
                        variant={
                          selectedRoom?.id === room.id ? "default" : "outline"
                        }
                        className="w-full justify-start"
                        onClick={() => setSelectedRoom(room)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{room.name}</div>
                          <div className="text-xs opacity-75">
                            {room.property?.name}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  {/* Room Summary */}
                  {selectedRoom && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Current Selection
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <strong>Room:</strong> {selectedRoom.name}
                        </p>
                        <p>
                          <strong>Property:</strong>{" "}
                          {selectedRoom.property?.name}
                        </p>
                        <p>
                          <strong>Price:</strong> $
                          {selectedRoom.price.toLocaleString()}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          <span
                            className={
                              selectedRoom.isAvailable
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {selectedRoom.isAvailable
                              ? "Available"
                              : "Occupied"}
                          </span>
                        </p>
                        {!selectedRoom.isAvailable &&
                          selectedRoom.currentTenant && (
                            <p>
                              <strong>Tenant:</strong>{" "}
                              {selectedRoom.currentTenant}
                            </p>
                          )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Calendar */}
            <div className="xl:col-span-3">
              {selectedRoom ? (
                <AvailabilityCalendar
                  room={selectedRoom}
                  leases={leases.filter((l) => l.roomId === selectedRoom.id)}
                  compact={false}
                />
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CalendarIcon className="h-16 w-16 text-black mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a room
                    </h3>
                    <p className="text-gray-500">
                      Choose a room from the list to view its availability
                      calendar
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {rooms.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {rooms.length}
                </div>
                <div className="text-sm text-gray-600">Total Rooms</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {rooms.filter((r) => r.isAvailable).length}
                </div>
                <div className="text-sm text-gray-600">Available Now</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {rooms.filter((r) => !r.isAvailable).length}
                </div>
                <div className="text-sm text-gray-600">Occupied</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {leases.length}
                </div>
                <div className="text-sm text-gray-600">Expiring Soon</div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
