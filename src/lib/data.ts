import {
  Room,
  Property,
  Message,
  User,
  DashboardStats,
  Notification,
  LeaseInfo,
  LeaseAction,
} from "@/types";
import bcrypt from "bcryptjs";
import {
  addDays,
  subDays,
  differenceInMonths,
  differenceInDays,
} from "date-fns";

// Simulated data for development
const properties: Property[] = [
  {
    id: "1",
    name: "Central House",
    address: "1234 Main Street, Downtown",
    description: "Main property with excellent location",
    latitude: 40.7128,
    longitude: -74.006,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "North Residence",
    address: "5678 Oak Avenue, Uptown",
    description: "Family residence in quiet area",
    latitude: 40.7589,
    longitude: -73.9851,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    name: "Modern Tower",
    address: "2345 Park Boulevard, Midtown",
    description: "Modern building in the heart of the city",
    latitude: 40.7505,
    longitude: -73.9934,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
];

// Enhanced lease data
const leases: LeaseInfo[] = [
  {
    id: "lease-1",
    roomId: "3",
    tenantName: "Carlos Mendoza",
    tenantEmail: "carlos.mendoza@email.com",
    tenantPhone: "+1 555-123-4567",
    tenantEmergencyContact: "Maria Mendoza",
    tenantEmergencyPhone: "+1 555-123-4568",
    startDate: subDays(new Date(), 90),
    endDate: addDays(new Date(), 30), // Expires in 30 days
    monthlyRent: 1600,
    deposit: 4800, // 3 months
    depositPaid: true,
    depositAmount: 4800,
    status: "ending_soon",
    autoRenewal: false,
    renewalNoticeDays: 30,
    paymentStatus: "current",
    lastPaymentDate: subDays(new Date(), 5),
    nextPaymentDue: addDays(new Date(), 25),
    leaseTerms: [
      "No smoking inside the premises",
      "No pets allowed",
      "Quiet hours: 10 PM - 7 AM",
      "Monthly inspection allowed",
    ],
    specialConditions: "Tenant is responsible for utilities",
    createdAt: subDays(new Date(), 90),
    updatedAt: new Date(),
  },
  {
    id: "lease-2",
    roomId: "4",
    tenantName: "Ana García",
    tenantEmail: "ana.garcia@email.com",
    tenantPhone: "+1 555-987-6543",
    tenantEmergencyContact: "Luis García",
    tenantEmergencyPhone: "+1 555-987-6544",
    startDate: subDays(new Date(), 180),
    endDate: addDays(new Date(), 60), // Expires in 60 days
    monthlyRent: 1350,
    deposit: 2700, // 2 months
    depositPaid: true,
    depositAmount: 2700,
    status: "active",
    autoRenewal: true,
    renewalNoticeDays: 60,
    paymentStatus: "current",
    lastPaymentDate: subDays(new Date(), 15),
    nextPaymentDue: addDays(new Date(), 15),
    leaseTerms: [
      "Pets allowed with additional deposit",
      "Tenant maintains terrace garden",
      "Quiet hours: 10 PM - 8 AM",
    ],
    specialConditions: "Water and electricity included in rent",
    createdAt: subDays(new Date(), 180),
    updatedAt: new Date(),
  },
];

// Lease actions history
const leaseActions: LeaseAction[] = [
  {
    type: "extend",
    leaseId: "lease-1",
    data: {
      newEndDate: addDays(new Date(), 30),
    },
    performedBy: "admin@roomrental.com",
    performedAt: subDays(new Date(), 10),
  },
];

const rooms: Room[] = [
  {
    id: "1",
    propertyId: "1",
    name: "Premium Room 101",
    description: "Spacious room with street view, fully furnished",
    price: 1200,
    images: [
      "/images/room1-1.jpg",
      "/images/room1-2.jpg",
      "/images/room1-3.jpg",
    ],
    amenities: [
      "WiFi",
      "Air Conditioning",
      "Private Bathroom",
      "Closet",
      "Desk",
    ],
    requirements: ["2-month deposit", "Proof of income", "Guarantor required"],
    isAvailable: true,
    size: 25,
    maxOccupants: 2,
    availableFrom: new Date(),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    propertyId: "1",
    name: "Standard Room 102",
    description: "Comfortable and bright room, ideal for students",
    price: 900,
    images: ["/images/room2-1.jpg", "/images/room2-2.jpg"],
    amenities: ["WiFi", "Fan", "Closet", "Desk"],
    requirements: ["1-month deposit", "Proof of income"],
    isAvailable: true,
    size: 18,
    maxOccupants: 1,
    availableFrom: addDays(new Date(), 15),
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    propertyId: "2",
    name: "Executive Suite 201",
    description: "Complete suite with kitchenette and living room",
    price: 1600,
    images: [
      "/images/room3-1.jpg",
      "/images/room3-2.jpg",
      "/images/room3-3.jpg",
    ],
    amenities: [
      "WiFi",
      "Air Conditioning",
      "Private Bathroom",
      "Kitchenette",
      "Living Room",
      "Balcony",
    ],
    requirements: [
      "3-month deposit",
      "Proof of income",
      "Guarantor required",
      "Security insurance",
    ],
    isAvailable: true,
    size: 45,
    maxOccupants: 2,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "4",
    propertyId: "3",
    name: "Modern Loft 301",
    description: "Designer loft with large windows and private terrace",
    price: 1350,
    images: ["/images/room4-1.jpg", "/images/room4-2.jpg"],
    amenities: [
      "WiFi",
      "Air Conditioning",
      "Terrace",
      "Integrated Kitchen",
      "Washing Machine",
    ],
    requirements: ["2-month deposit", "Proof of income"],
    isAvailable: true,
    size: 35,
    maxOccupants: 2,
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "5",
    propertyId: "1",
    name: "Shared Room 103",
    description: "Spacious room for sharing, ideal for students",
    price: 650,
    images: ["/images/room5-1.jpg"],
    amenities: ["WiFi", "Fan", "Closet", "Desk", "Shared Bathroom"],
    requirements: ["1-month deposit"],
    isAvailable: true,
    size: 20,
    maxOccupants: 2,
    availableFrom: addDays(new Date(), 7),
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-01"),
  },
];

// Update rooms with their current leases
rooms.forEach((room) => {
  const currentLease = leases.find(
    (lease) =>
      lease.roomId === room.id &&
      (lease.status === "active" || lease.status === "ending_soon")
  );
  if (currentLease) {
    room.currentLease = currentLease;
    room.isAvailable = false;
    room.availableFrom = currentLease.endDate;
  }
});

const messages: Message[] = [
  {
    id: "1",
    roomId: "1",
    senderName: "Maria Gonzalez",
    senderEmail: "maria@example.com",
    senderPhone: "+1 555-123-4567",
    content:
      "Hi, I'm very interested in this room. Could we schedule a viewing? I need to move next month.",
    isRead: false,
    isArchived: false,
    priority: "high",
    createdAt: new Date("2024-06-01T10:30:00"),
  },
  {
    id: "2",
    roomId: "2",
    senderName: "John Perez",
    senderEmail: "john@example.com",
    content:
      "Does the room include utilities? When would it be available exactly?",
    isRead: false,
    isArchived: false,
    priority: "medium",
    createdAt: new Date("2024-06-02T14:20:00"),
  },
  {
    id: "3",
    roomId: "5",
    senderName: "Sofia Rodriguez",
    senderEmail: "sofia@example.com",
    senderPhone: "+1 555-555-1234",
    content:
      "Looking for a room to share. I'm a university student, very organized and responsible.",
    isRead: true,
    isArchived: false,
    priority: "medium",
    createdAt: new Date("2024-06-03T09:15:00"),
  },
];

const notifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "New message from Maria Gonzalez",
    message: "Inquiry about Premium Room 101",
    isRead: false,
    priority: "high",
    actionUrl: "/admin/messages",
    createdAt: new Date("2024-06-01T10:30:00"),
  },
  {
    id: "2",
    type: "lease_expiring",
    title: "Contract expiring soon",
    message: "Executive Suite 201 available in 30 days",
    isRead: false,
    priority: "high",
    actionUrl: "/admin/rooms/3",
    createdAt: new Date(),
  },
];

const users: User[] = [
  {
    id: "1",
    email: "admin@roomrental.com",
    name: "Administrator",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
];

// Functions to handle properties
export const getProperties = (): Property[] => properties;

export const getPropertyById = (id: string): Property | undefined =>
  properties.find((p) => p.id === id);

export const createProperty = (
  propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">
): Property => {
  const newProperty: Property = {
    ...propertyData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  properties.push(newProperty);
  return newProperty;
};

export const updateProperty = (
  id: string,
  updates: Partial<Omit<Property, "id" | "createdAt">>
): Property | null => {
  const index = properties.findIndex((p) => p.id === id);
  if (index === -1) return null;

  properties[index] = {
    ...properties[index],
    ...updates,
    updatedAt: new Date(),
  };
  return properties[index];
};

export const deleteProperty = (id: string): boolean => {
  const index = properties.findIndex((p) => p.id === id);
  if (index === -1) return false;

  properties.splice(index, 1);
  return true;
};

// Functions to handle rooms
export const getRooms = (filters?: {
  isAvailable?: boolean;
  search?: string;
}): Room[] => {
  let filteredRooms = rooms.map((room) => ({
    ...room,
    property: properties.find((p) => p.id === room.propertyId),
  }));

  if (filters?.isAvailable !== undefined) {
    filteredRooms = filteredRooms.filter(
      (room) => room.isAvailable === filters.isAvailable
    );
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filteredRooms = filteredRooms.filter(
      (room) =>
        room.name.toLowerCase().includes(search) ||
        room.description.toLowerCase().includes(search) ||
        room.property?.address.toLowerCase().includes(search) ||
        room.amenities.some((amenity) => amenity.toLowerCase().includes(search))
    );
  }

  return filteredRooms;
};

export const getRoomById = (id: string): Room | undefined => {
  const room = rooms.find((r) => r.id === id);
  if (room) {
    return {
      ...room,
      property: properties.find((p) => p.id === room.propertyId),
    };
  }
  return undefined;
};

export const createRoom = (
  roomData: Omit<Room, "id" | "createdAt" | "updatedAt">
): Room => {
  const newRoom: Room = {
    ...roomData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  rooms.push(newRoom);
  return newRoom;
};

export const updateRoom = (
  id: string,
  updates: Partial<Omit<Room, "id" | "createdAt">>
): Room | null => {
  const index = rooms.findIndex((r) => r.id === id);
  if (index === -1) return null;

  rooms[index] = {
    ...rooms[index],
    ...updates,
    updatedAt: new Date(),
  };
  return rooms[index];
};

export const deleteRoom = (id: string): boolean => {
  const index = rooms.findIndex((r) => r.id === id);
  if (index === -1) return false;

  rooms.splice(index, 1);
  return true;
};

// Functions to handle messages
export const getMessages = (roomId?: string): Message[] => {
  const result = messages.map((m) => ({
    ...m,
    room: rooms.find((r) => r.id === m.roomId),
  }));

  if (roomId) {
    return result.filter((m) => m.roomId === roomId);
  }
  return result;
};

export const createMessage = (
  messageData: Omit<Message, "id" | "createdAt">
): Message => {
  const newMessage: Message = {
    ...messageData,
    id: Date.now().toString(),
    createdAt: new Date(),
  };
  messages.push(newMessage);

  // Create notification
  const room = rooms.find((r) => r.id === messageData.roomId);
  const notification: Notification = {
    id: (Date.now() + 1).toString(),
    type: "message",
    title: `New message from ${messageData.senderName}`,
    message: `Inquiry about ${room?.name || "a room"}`,
    isRead: false,
    priority: messageData.priority || "medium",
    actionUrl: "/admin/messages",
    createdAt: new Date(),
  };
  notifications.push(notification);

  return newMessage;
};

export const markMessageAsRead = (id: string): boolean => {
  const message = messages.find((m) => m.id === id);
  if (message) {
    message.isRead = true;
    return true;
  }
  return false;
};

export const deleteMessage = (id: string): boolean => {
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) return false;

  messages.splice(index, 1);
  return true;
};

// Functions for notifications
export const getNotifications = (): Notification[] => {
  return notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const markNotificationAsRead = (id: string): boolean => {
  const notification = notifications.find((n) => n.id === id);
  if (notification) {
    notification.isRead = true;
    return true;
  }
  return false;
};

// Functions for contracts
export const getLeases = (): LeaseInfo[] => {
  return leases;
};

export const getLeasesByRoomId = (roomId: string): LeaseInfo[] => {
  return leases.filter((l) => l.roomId === roomId);
};

export const getExpiringSoonLeases = (days: number = 30): LeaseInfo[] => {
  const futureDate = addDays(new Date(), days);
  return leases.filter(
    (l) =>
      l.status === "active" &&
      l.endDate <= futureDate &&
      l.endDate >= new Date()
  );
};

// Functions for authentication
export const getUserByEmail = (email: string): User | undefined =>
  users.find((u) => u.email === email);

export const validatePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Function to get dashboard statistics
export const getDashboardStats = (): DashboardStats => {
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.isAvailable).length;
  const occupiedRooms = totalRooms - availableRooms;
  const unreadMessages = messages.filter((m) => !m.isRead).length;
  const monthlyRevenue = rooms
    .filter((r) => !r.isAvailable)
    .reduce((sum, r) => sum + r.price, 0);
  const expiringSoonLeases = getExpiringSoonLeases().length;
  const totalMessages = messages.length;
  const averageRoomPrice =
    rooms.reduce((sum, r) => sum + r.price, 0) / totalRooms;
  const occupancyRate = (occupiedRooms / totalRooms) * 100;

  // New lease statistics
  const activeLeases = leases.filter(
    (l) => l.status === "active" || l.status === "ending_soon"
  );
  const totalActiveLeases = activeLeases.length;
  const averageLeaseDuration =
    activeLeases.length > 0
      ? activeLeases.reduce((sum, lease) => {
          const duration = differenceInMonths(lease.endDate, lease.startDate);
          return sum + duration;
        }, 0) / activeLeases.length
      : 0;

  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    unreadMessages,
    monthlyRevenue,
    expiringSoonLeases,
    totalMessages,
    averageRoomPrice,
    occupancyRate,
    totalActiveLeases,
    averageLeaseDuration,
  };
};

// Enhanced lease management functions
export const getLeaseById = (id: string): LeaseInfo | undefined => {
  return leases.find((l) => l.id === id);
};

export const createLease = (
  leaseData: Omit<LeaseInfo, "id" | "createdAt" | "updatedAt">
): LeaseInfo => {
  const newLease: LeaseInfo = {
    ...leaseData,
    id: `lease-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  leases.push(newLease);

  // Update room availability
  const room = rooms.find((r) => r.id === leaseData.roomId);
  if (room) {
    room.isAvailable = false;
    room.currentLease = newLease;
    room.availableFrom = leaseData.endDate;
    room.updatedAt = new Date();
  }

  // Log action
  const action: LeaseAction = {
    type: "renew",
    leaseId: newLease.id,
    data: {
      newEndDate: leaseData.endDate,
    },
    performedBy: "admin",
    performedAt: new Date(),
  };
  leaseActions.push(action);

  return newLease;
};

export const updateLease = (
  id: string,
  updates: Partial<Omit<LeaseInfo, "id" | "createdAt">>
): LeaseInfo | null => {
  const index = leases.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const oldLease = leases[index];
  leases[index] = {
    ...oldLease,
    ...updates,
    updatedAt: new Date(),
  };

  // Update room if lease status changes
  const room = rooms.find((r) => r.id === leases[index].roomId);
  if (room) {
    if (updates.status === "terminated" || updates.status === "expired") {
      room.isAvailable = true;
      room.currentLease = undefined;
      room.availableFrom = new Date();
    } else {
      room.currentLease = leases[index];
      room.availableFrom = leases[index].endDate;
    }
    room.updatedAt = new Date();
  }

  return leases[index];
};

export const terminateLease = (
  id: string,
  reason: string,
  effectiveDate: Date = new Date()
): boolean => {
  const lease = leases.find((l) => l.id === id);
  if (!lease) return false;

  lease.status = "terminated";
  lease.terminationReason = reason;
  lease.terminationDate = effectiveDate;
  lease.updatedAt = new Date();

  // Update room
  const room = rooms.find((r) => r.id === lease.roomId);
  if (room) {
    room.isAvailable = true;
    room.currentLease = undefined;
    room.availableFrom = effectiveDate;
    room.updatedAt = new Date();
  }

  // Log action
  const action: LeaseAction = {
    type: "terminate",
    leaseId: id,
    data: {
      terminationReason: reason,
      effectiveDate,
    },
    performedBy: "admin",
    performedAt: new Date(),
  };
  leaseActions.push(action);

  return true;
};

export const extendLease = (
  id: string,
  newEndDate: Date,
  newRent?: number
): boolean => {
  const lease = leases.find((l) => l.id === id);
  if (!lease) return false;

  lease.endDate = newEndDate;
  if (newRent) {
    lease.monthlyRent = newRent;
  }
  lease.status = "active";
  lease.updatedAt = new Date();

  // Update room
  const room = rooms.find((r) => r.id === lease.roomId);
  if (room) {
    room.currentLease = lease;
    room.availableFrom = newEndDate;
    if (newRent) {
      room.price = newRent;
    }
    room.updatedAt = new Date();
  }

  // Log action
  const action: LeaseAction = {
    type: "extend",
    leaseId: id,
    data: {
      newEndDate,
      newRent,
    },
    performedBy: "admin",
    performedAt: new Date(),
  };
  leaseActions.push(action);

  return true;
};

export const changeTenant = (
  leaseId: string,
  newTenantName: string,
  newTenantEmail: string,
  newTenantPhone?: string,
  effectiveDate: Date = new Date()
): boolean => {
  const lease = leases.find((l) => l.id === leaseId);
  if (!lease) return false;

  const oldTenantName = lease.tenantName;

  lease.tenantName = newTenantName;
  lease.tenantEmail = newTenantEmail;
  lease.tenantPhone = newTenantPhone;
  lease.updatedAt = new Date();

  // Update room current lease
  const room = rooms.find((r) => r.id === lease.roomId);
  if (room && room.currentLease) {
    room.currentLease = lease;
    room.updatedAt = new Date();
  }

  // Log action
  const action: LeaseAction = {
    type: "change_tenant",
    leaseId,
    data: {
      newTenantName,
      newTenantEmail,
      newTenantPhone,
      effectiveDate,
    },
    performedBy: "admin",
    performedAt: new Date(),
  };
  leaseActions.push(action);

  // Create notification
  const notification: Notification = {
    id: Date.now().toString(),
    type: "lease_expiring",
    title: "Tenant Changed",
    message: `Tenant changed from ${oldTenantName} to ${newTenantName} for ${
      room?.name || "Room"
    }`,
    isRead: false,
    priority: "medium",
    actionUrl: "/admin/leases",
    createdAt: new Date(),
  };
  notifications.push(notification);

  return true;
};

export const getLeaseActions = (leaseId?: string): LeaseAction[] => {
  if (leaseId) {
    return leaseActions.filter((a) => a.leaseId === leaseId);
  }
  return leaseActions.sort(
    (a, b) => b.performedAt.getTime() - a.performedAt.getTime()
  );
};

// Auto-update lease statuses based on dates
export const updateLeaseStatuses = (): void => {
  const today = new Date();

  leases.forEach((lease) => {
    if (lease.status === "active") {
      const daysUntilExpiry = differenceInDays(lease.endDate, today);

      if (daysUntilExpiry <= 0) {
        lease.status = "expired";
        // Make room available
        const room = rooms.find((r) => r.id === lease.roomId);
        if (room) {
          room.isAvailable = true;
          room.currentLease = undefined;
          room.availableFrom = today;
        }
      } else if (daysUntilExpiry <= lease.renewalNoticeDays) {
        lease.status = "ending_soon";

        // Create notification if not already notified
        if (!lease.renewalNoticeProvided) {
          const notification: Notification = {
            id: Date.now().toString(),
            type: "lease_expiring",
            title: `Lease Expiring Soon`,
            message: `${lease.tenantName}'s lease expires in ${daysUntilExpiry} days`,
            isRead: false,
            priority: "high",
            actionUrl: "/admin/leases",
            createdAt: new Date(),
          };
          notifications.push(notification);
          lease.renewalNoticeProvided = true;
        }
      }
    }
  });
};

// Call this function to keep statuses updated
updateLeaseStatuses();
