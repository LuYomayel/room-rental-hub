"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import { Room, LeaseInfo } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import "react-calendar/dist/Calendar.css";

interface AvailabilityCalendarProps {
  room: Room;
  leases?: LeaseInfo[];
  compact?: boolean;
}

export function AvailabilityCalendar({
  room,
  leases = [],
  compact = false,
}: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Determine if a date is occupied
  const isDateOccupied = (date: Date): boolean => {
    return leases.some((lease) => {
      const leaseStart = new Date(lease.startDate);
      const leaseEnd = new Date(lease.endDate);
      return (
        date >= leaseStart && date <= leaseEnd && lease.status === "active"
      );
    });
  };

  // Get tenant information for a specific date
  const getTenantForDate = (date: Date): LeaseInfo | undefined => {
    return leases.find((lease) => {
      const leaseStart = new Date(lease.startDate);
      const leaseEnd = new Date(lease.endDate);
      return (
        date >= leaseStart && date <= leaseEnd && lease.status === "active"
      );
    });
  };

  // Configure CSS classes for calendar
  const tileClassName = ({ date }: { date: Date }) => {
    const classes = [];

    if (isDateOccupied(date)) {
      classes.push("occupied");
    } else if (room.availableFrom && date >= new Date(room.availableFrom)) {
      classes.push("available");
    } else {
      classes.push("unavailable");
    }

    return classes.join(" ");
  };

  if (compact) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {room.isAvailable ? (
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                Available
              </Badge>
              {room.availableFrom && (
                <span className="text-sm text-black">
                  from {formatDate(new Date(room.availableFrom))}
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="destructive">Occupied</Badge>
                <span className="text-sm text-black">
                  by {room.currentTenant}
                </span>
              </div>
              {room.leaseEndDate && (
                <div className="flex items-center space-x-2 text-sm text-black">
                  <Clock className="h-3 w-3" />
                  <span>
                    Available from {formatDate(new Date(room.leaseEndDate))}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Availability Calendar - {room.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <style jsx global>{`
                .react-calendar {
                  width: 100%;
                  background: white;
                  border: 1px solid #e5e7eb;
                  font-family: inherit;
                  line-height: 1.125em;
                  border-radius: 0.5rem;
                }

                .react-calendar__tile {
                  max-width: 100%;
                  padding: 10px 6px;
                  background: none;
                  text-align: center;
                  line-height: 16px;
                  font-size: 0.875rem;
                }

                .react-calendar__tile.occupied {
                  background-color: #fef2f2;
                  color: #dc2626;
                }

                .react-calendar__tile.available {
                  background-color: #f0fdf4;
                  color: #16a34a;
                }

                .react-calendar__tile.unavailable {
                  background-color: #f9fafb;
                  color: #9ca3af;
                }

                .react-calendar__tile:enabled:hover {
                  background-color: #e5e7eb;
                }

                .react-calendar__tile--active {
                  background: #2563eb !important;
                  color: white !important;
                }
              `}</style>

              <Calendar
                onChange={(value) => setSelectedDate(value as Date)}
                value={selectedDate}
                tileClassName={tileClassName}
                locale="en-US"
                minDate={new Date()}
                maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 year
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span className="text-sm">Occupied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                  <span className="text-sm">Not available</span>
                </div>
              </div>
            </div>

            {/* Detailed information */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-black mb-3">Current Status</h3>
                {room.isAvailable ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-green-100 text-green-800">
                        Available
                      </Badge>
                    </div>
                    {room.availableFrom && (
                      <p className="text-sm text-green-700">
                        Available from:{" "}
                        {formatDate(new Date(room.availableFrom))}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="destructive">Occupied</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-red-700">
                      <p className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        Tenant: {room.currentTenant}
                      </p>
                      {room.leaseEndDate && (
                        <p className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Available from:{" "}
                          {formatDate(new Date(room.leaseEndDate))}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Upcoming events */}
              <div>
                <h3 className="font-medium text-black mb-3">Upcoming Events</h3>
                <div className="space-y-2">
                  {leases
                    .filter((lease) => new Date(lease.endDate) >= new Date())
                    .sort(
                      (a, b) =>
                        new Date(a.endDate).getTime() -
                        new Date(b.endDate).getTime()
                    )
                    .slice(0, 3)
                    .map((lease) => (
                      <div
                        key={lease.id}
                        className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">
                              {lease.tenantName}
                            </p>
                            <p className="text-xs text-black">
                              Until: {formatDate(new Date(lease.endDate))}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            ${lease.monthlyRent.toLocaleString()}/month
                          </Badge>
                        </div>
                      </div>
                    ))}

                  {leases.filter(
                    (lease) => new Date(lease.endDate) >= new Date()
                  ).length === 0 && (
                    <p className="text-sm text-black italic">
                      No upcoming events
                    </p>
                  )}
                </div>
              </div>

              {/* Selected date information */}
              <div>
                <h3 className="font-medium text-black mb-3">
                  {formatDate(selectedDate)}
                </h3>
                {(() => {
                  const tenant = getTenantForDate(selectedDate);
                  if (tenant) {
                    return (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800">
                          Occupied
                        </p>
                        <p className="text-sm text-red-700">
                          Tenant: {tenant.tenantName}
                        </p>
                        <p className="text-sm text-red-700">
                          Contract: {formatDate(new Date(tenant.startDate))} -{" "}
                          {formatDate(new Date(tenant.endDate))}
                        </p>
                      </div>
                    );
                  } else if (
                    room.availableFrom &&
                    selectedDate >= new Date(room.availableFrom)
                  ) {
                    return (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800">
                          Available
                        </p>
                        <p className="text-sm text-green-700">
                          This date is available for rental
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm font-medium text-black">
                          Not available
                        </p>
                        <p className="text-sm text-gray-700">
                          This date is not available
                        </p>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
