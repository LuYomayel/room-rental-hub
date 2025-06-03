"use client";

import { useState } from "react";
import { Room } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageModal } from "@/components/MessageModal";
import { ImageGallery } from "@/components/ImageGallery";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { formatPrice } from "@/lib/utils";
import {
  MapPin,
  Users,
  Wifi,
  Home,
  MessageCircle,
  Calendar,
} from "lucide-react";

interface RoomCardProps {
  room: Room;
  showAvailability?: boolean;
}

export function RoomCard({ room, showAvailability = false }: RoomCardProps) {
  const [showMessageModal, setShowMessageModal] = useState(false);

  const amenityIcons: { [key: string]: React.JSX.Element } = {
    WiFi: <Wifi className="h-4 w-4" />,
    "Air Conditioning": <Home className="h-4 w-4" />,
    "Private Bathroom": <Home className="h-4 w-4" />,
    Closet: <Home className="h-4 w-4" />,
    Desk: <Home className="h-4 w-4" />,
    Kitchenette: <Home className="h-4 w-4" />,
    "Living Room": <Home className="h-4 w-4" />,
    Balcony: <Home className="h-4 w-4" />,
    Fan: <Home className="h-4 w-4" />,
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image gallery */}
        <div className="relative">
          <ImageGallery
            images={room.images}
            roomName={room.name}
            className="w-full"
          />

          {/* Price badge */}
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold z-10">
            {formatPrice(room.price)}
          </div>

          {/* Availability status */}
          <div className="absolute top-4 left-4 z-10">
            <div
              className={`px-2 py-1 rounded text-xs font-medium ${
                room.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {room.isAvailable ? "Available" : "Occupied"}
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Title and location */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-black mb-2">
              {room.name}
            </h3>
            <div className="flex items-center text-black mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{room.property?.address}</span>
            </div>
            <div className="flex items-center text-black">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">
                Up to {room.maxOccupants} person
                {room.maxOccupants !== 1 ? "s" : ""}
              </span>
              {room.size && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{room.size}m²</span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-black text-sm mb-4 line-clamp-2">
            {room.description}
          </p>

          {/* Availability information */}
          {!room.isAvailable && room.leaseEndDate && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center text-yellow-800 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Available from{" "}
                  {new Date(room.leaseEndDate).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>
          )}

          {/* Amenities */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-black mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 4).map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs text-gray-700"
                >
                  {amenityIcons[amenity] || <Home className="h-3 w-3" />}
                  <span className="ml-1">{amenity}</span>
                </div>
              ))}
              {room.amenities.length > 4 && (
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                  +{room.amenities.length - 4} more
                </div>
              )}
            </div>
          </div>

          {/* Compact calendar if enabled */}
          {showAvailability && (
            <div className="mb-4">
              <AvailabilityCalendar room={room} compact={true} />
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button onClick={() => setShowMessageModal(true)} className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Inquire
          </Button>
        </CardFooter>
      </Card>

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        room={room}
      />
    </>
  );
}
