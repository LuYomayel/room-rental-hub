import {
  Room,
  Property,
  Message,
  User,
  DashboardStats,
  Notification,
  LeaseInfo,
} from "@/types";
import bcrypt from "bcryptjs";
import { addDays, subDays } from "date-fns";

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
    isAvailable: false,
    size: 45,
    maxOccupants: 2,
    currentTenant: "Carlos Mendoza",
    leaseStartDate: subDays(new Date(), 90),
    leaseEndDate: addDays(new Date(), 30), // Available in 30 days
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
    isAvailable: false,
    size: 35,
    maxOccupants: 2,
    currentTenant: "Ana García",
    leaseStartDate: subDays(new Date(), 180),
    leaseEndDate: addDays(new Date(), 60), // Available in 60 days
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

const leases: LeaseInfo[] = [
  {
    id: "1",
    roomId: "3",
    tenantName: "Carlos Mendoza",
    tenantEmail: "carlos.mendoza@email.com",
    tenantPhone: "+1 555-999-8888",
    startDate: subDays(new Date(), 90),
    endDate: addDays(new Date(), 30),
    monthlyRent: 1600,
    deposit: 4800,
    status: "active",
    createdAt: subDays(new Date(), 90),
    updatedAt: new Date(),
  },
  {
    id: "2",
    roomId: "4",
    tenantName: "Ana García",
    tenantEmail: "ana.garcia@email.com",
    startDate: subDays(new Date(), 180),
    endDate: addDays(new Date(), 60),
    monthlyRent: 1350,
    deposit: 2700,
    status: "active",
    createdAt: subDays(new Date(), 180),
    updatedAt: new Date(),
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
  };
};
