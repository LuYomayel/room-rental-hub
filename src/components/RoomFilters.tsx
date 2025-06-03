"use client";

import { useState } from "react";
import { RoomFilters as RoomFiltersType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  X,
  DollarSign,
  Users,
  Wifi,
  Home,
  Car,
  Calendar,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";

interface RoomFiltersProps {
  onFiltersChange: (filters: RoomFiltersType) => void;
  initialFilters?: RoomFiltersType;
  className?: string;
}

const AMENITIES_OPTIONS = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "ac", label: "Air Conditioning", icon: Home },
  { id: "private_bathroom", label: "Private Bathroom", icon: Home },
  { id: "closet", label: "Closet", icon: Home },
  { id: "desk", label: "Desk", icon: Home },
  { id: "kitchenette", label: "Kitchenette", icon: Home },
  { id: "living_room", label: "Living Room", icon: Home },
  { id: "balcony", label: "Balcony", icon: Home },
  { id: "parking", label: "Parking", icon: Car },
  { id: "fan", label: "Fan", icon: Home },
];

const SORT_OPTIONS = [
  { value: "price", label: "Price" },
  { value: "name", label: "Name" },
  { value: "size", label: "Size" },
  { value: "date", label: "Date" },
];

export function RoomFilters({
  onFiltersChange,
  initialFilters,
  className = "",
}: RoomFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<RoomFiltersType>(initialFilters || {});

  const updateFilters = (newFilters: Partial<RoomFiltersType>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: RoomFiltersType = {};
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = filters.amenities || [];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity];

    updateFilters({
      amenities: updatedAmenities.length > 0 ? updatedAmenities : undefined,
    });
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).some((key) => {
      const value = filters[key as keyof RoomFiltersType];
      return (
        value !== undefined &&
        value !== null &&
        (Array.isArray(value) ? value.length > 0 : true)
      );
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.amenities && filters.amenities.length > 0) count++;
    if (filters.maxOccupants) count++;
    if (filters.size?.min || filters.size?.max) count++;
    if (filters.isAvailable !== undefined) count++;
    if (filters.sortBy) count++;
    return count;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters() && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4 mr-1" />
                  {isExpanded ? "Hide" : "Filters"}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Availability */}
          <div>
            <h3 className="font-medium text-black mb-3">Availability</h3>
            <div className="flex gap-2">
              <Button
                variant={filters.isAvailable === true ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateFilters({
                    isAvailable:
                      filters.isAvailable === true ? undefined : true,
                  })
                }
              >
                Available only
              </Button>
              <Button
                variant={filters.isAvailable === false ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateFilters({
                    isAvailable:
                      filters.isAvailable === false ? undefined : false,
                  })
                }
              >
                Occupied only
              </Button>
            </div>
          </div>

          {/* Price range */}
          <div>
            <h3 className="font-medium text-black mb-3 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Price Range (AUD)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-black mb-1">Minimum</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    updateFilters({
                      minPrice: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-black mb-1">Maximum</label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    updateFilters({
                      maxPrice: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Maximum occupants */}
          <div>
            <h3 className="font-medium text-black mb-3 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Maximum Occupants
            </h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((count) => (
                <Button
                  key={count}
                  variant={
                    filters.maxOccupants === count ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    updateFilters({
                      maxOccupants:
                        filters.maxOccupants === count ? undefined : count,
                    })
                  }
                >
                  {count} {count === 1 ? "person" : "people"}
                </Button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h3 className="font-medium text-black mb-3">Size (m²)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-black mb-1">Minimum</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.size?.min || ""}
                  onChange={(e) =>
                    updateFilters({
                      size: {
                        ...filters.size,
                        min: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-black mb-1">Maximum</label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={filters.size?.max || ""}
                  onChange={(e) =>
                    updateFilters({
                      size: {
                        ...filters.size,
                        max: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-medium text-black mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES_OPTIONS.map((amenity) => {
                const IconComponent = amenity.icon;
                const isSelected =
                  filters.amenities?.includes(amenity.label) || false;

                return (
                  <Button
                    key={amenity.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAmenity(amenity.label)}
                    className="justify-start"
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {amenity.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Sort by */}
          <div>
            <h3 className="font-medium text-black mb-3 flex items-center">
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Sort by
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    filters.sortBy === option.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    updateFilters({
                      sortBy:
                        filters.sortBy === option.value
                          ? undefined
                          : (option.value as
                              | "price"
                              | "name"
                              | "date"
                              | "size"),
                    })
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {filters.sortBy && (
              <div className="mt-3 flex gap-2">
                <Button
                  variant={filters.sortOrder === "asc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilters({ sortOrder: "asc" })}
                >
                  Ascending
                </Button>
                <Button
                  variant={filters.sortOrder === "desc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilters({ sortOrder: "desc" })}
                >
                  Descending
                </Button>
              </div>
            )}
          </div>

          {/* Availability date */}
          <div>
            <h3 className="font-medium text-black mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Available from
            </h3>
            <Input
              type="date"
              value={
                filters.availableFrom
                  ? filters.availableFrom.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                updateFilters({
                  availableFrom: e.target.value
                    ? new Date(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </CardContent>
      )}

      {/* Compact active filters */}
      {!isExpanded && hasActiveFilters() && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {filters.isAvailable !== undefined && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.isAvailable ? "Available" : "Occupied"}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilters({ isAvailable: undefined })}
                />
              </Badge>
            )}

            {(filters.minPrice || filters.maxPrice) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                ${filters.minPrice || 0} - ${filters.maxPrice || "∞"}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    updateFilters({ minPrice: undefined, maxPrice: undefined })
                  }
                />
              </Badge>
            )}

            {filters.maxOccupants && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Up to {filters.maxOccupants} people
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilters({ maxOccupants: undefined })}
                />
              </Badge>
            )}

            {filters.amenities && filters.amenities.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.amenities.length} amenities
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilters({ amenities: undefined })}
                />
              </Badge>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
