"use client";

import { useState, useEffect } from "react";
import { Room, RoomFilters as RoomFiltersType } from "@/types";
import { RoomCard } from "@/components/RoomCard";
import { RoomFilters } from "@/components/RoomFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { PropertyMap } from "@/components/PropertyMap"; // Commented out - not connected to real maps API
import {
  Search,
  MapPin,
  LayoutGrid,
  // Map // Commented out - removing map functionality
} from "lucide-react";

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<RoomFiltersType>({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filters, rooms]);

  const fetchData = async () => {
    try {
      const roomsRes = await fetch("/api/rooms");

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setRooms(roomsData);
        setFilteredRooms(roomsData);
      }

      // We don't need to store properties since map is disabled
      // if (propertiesRes.ok) {
      //   const propertiesData = await propertiesRes.json();
      //   setProperties(propertiesData);
      // }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = rooms.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.property?.name.toLowerCase().includes(search.toLowerCase()) ||
        room.property?.address.toLowerCase().includes(search.toLowerCase()) ||
        room.description.toLowerCase().includes(search.toLowerCase());

      const matchesAvailability =
        filters.isAvailable === undefined ||
        room.isAvailable === filters.isAvailable;

      const matchesMinPrice =
        !filters.minPrice || room.price >= filters.minPrice;
      const matchesMaxPrice =
        !filters.maxPrice || room.price <= filters.maxPrice;

      const matchesOccupants =
        !filters.maxOccupants || room.maxOccupants <= filters.maxOccupants;

      const matchesAmenities =
        !filters.amenities ||
        filters.amenities.length === 0 ||
        filters.amenities.every((amenity: string) =>
          room.amenities.some((roomAmenity: string) =>
            roomAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );

      return (
        matchesSearch &&
        matchesAvailability &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesOccupants &&
        matchesAmenities
      );
    });

    // Apply sorting
    if (filters.sortBy) {
      filtered = filtered.sort((a, b) => {
        const order = filters.sortOrder === "desc" ? -1 : 1;
        switch (filters.sortBy) {
          case "price":
            return (a.price - b.price) * order;
          case "name":
            return a.name.localeCompare(b.name) * order;
          case "size":
            return ((a.size || 0) - (b.size || 0)) * order;
          case "date":
            return (
              (new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()) *
              order
            );
          default:
            return 0;
        }
      });
    }

    setFilteredRooms(filtered);
  };

  const handleFiltersChange = (newFilters: RoomFiltersType) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearch("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-black">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-black">Room Rental Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/admin/login")}
              >
                Administrator
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
              <Input
                type="text"
                placeholder="Search by location, features..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* View toggle removed - only showing list view */}
          <div className="flex gap-2">
            <Button variant="default" size="sm">
              <LayoutGrid className="h-4 w-4 mr-2" />
              List View
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Side filters */}
          <div className="lg:col-span-1">
            <RoomFilters
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
              className="sticky top-4"
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Stats */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-black">
                  {filteredRooms.length} room
                  {filteredRooms.length !== 1 ? "s" : ""}
                  {filters.isAvailable === undefined
                    ? " found"
                    : filters.isAvailable
                    ? " available"
                    : " occupied"}
                </p>
                {(search || Object.keys(filters).length > 0) && (
                  <Button
                    variant="link"
                    onClick={clearFilters}
                    className="p-0 h-auto text-sm text-blue-600"
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              {filteredRooms.length > 0 && (
                <div className="text-sm text-black mt-2 sm:mt-0">
                  Average price: $
                  {(
                    filteredRooms.reduce((sum, room) => sum + room.price, 0) /
                    filteredRooms.length
                  ).toLocaleString("en-US")}
                </div>
              )}
            </div>

            {/* List View Only */}
            {filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <MapPin className="h-16 w-16 text-black mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black mb-2">
                    No rooms available
                  </h3>
                  <p className="text-black">
                    {search || Object.keys(filters).length > 0
                      ? "We couldn't find rooms matching your criteria. Try adjusting the filters."
                      : "There are currently no rooms available. Come back soon for new options."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} showAvailability={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-black">
              © 2024 Room Rental Management System. All rights reserved.
            </p>
            <p className="text-black text-sm mt-2">
              Complete platform with calendar, advanced filters and
              notifications
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
