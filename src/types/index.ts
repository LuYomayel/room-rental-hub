export interface Property {
  id: string;
  name: string;
  address: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  // New fields for comprehensive management
  services?: string[]; // property services (cleaning, community wifi, etc.)
  amenities?: string[]; // building amenities (gym, pool, laundry, etc.)
  contactEmail?: string;
  contactPhone?: string;
  managementCompany?: string;
  buildingType?: "apartment" | "house" | "condo" | "studio" | "other";
  yearBuilt?: number;
  totalRooms?: number;
  parkingSpaces?: number;
  pets?: "allowed" | "not_allowed" | "with_deposit";
  smokingPolicy?: "allowed" | "not_allowed" | "outdoor_only";
  utilities?: {
    electricity?: "included" | "not_included";
    water?: "included" | "not_included";
    gas?: "included" | "not_included";
    internet?: "included" | "not_included";
    cable?: "included" | "not_included";
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  propertyId: string;
  property?: Property;
  name: string;
  description: string;
  price: number;
  images: string[];
  amenities: string[];
  requirements: string[];
  isAvailable: boolean;
  size?: number; // in square meters
  maxOccupants: number;
  // Enhanced lease fields
  currentLease?: LeaseInfo;
  availableFrom?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  roomId: string;
  room?: Room;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  content: string;
  isRead: boolean;
  isArchived: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: Date;
}

export interface RoomFilters {
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  maxOccupants?: number;
  search?: string;
  isAvailable?: boolean;
  availableFrom?: Date;
  availableTo?: Date;
  size?: { min?: number; max?: number };
  sortBy?: "price" | "name" | "date" | "size";
  sortOrder?: "asc" | "desc";
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  unreadMessages: number;
  monthlyRevenue: number;
  // New statistics
  expiringSoonLeases: number; // contracts expiring in 30 days
  totalMessages: number;
  averageRoomPrice: number;
  occupancyRate: number;
  totalActiveLeases: number;
  averageLeaseDuration: number; // in months
}

export interface Notification {
  id: string;
  type:
    | "message"
    | "lease_expiring"
    | "payment"
    | "maintenance"
    | "lease_ended";
  title: string;
  message: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
  createdAt: Date;
}

export interface LeaseInfo {
  id: string;
  roomId: string;
  room?: Room;
  // Tenant information
  tenantName: string;
  tenantEmail: string;
  tenantPhone?: string;
  tenantEmergencyContact?: string;
  tenantEmergencyPhone?: string;
  // Lease details
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  deposit: number;
  depositPaid: boolean;
  depositAmount?: number;
  // Lease status and management
  status: "active" | "expired" | "terminated" | "pending" | "ending_soon";
  terminationReason?: string;
  terminationDate?: Date;
  // Additional terms
  leaseTerms?: string[];
  specialConditions?: string;
  // Automatic renewal
  autoRenewal: boolean;
  renewalNoticeProvided?: boolean;
  renewalNoticeDays: number; // days before expiry to notify
  // Payment tracking
  lastPaymentDate?: Date;
  nextPaymentDue?: Date;
  paymentStatus: "current" | "late" | "overdue";
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// New interfaces for lease management
export interface LeaseAction {
  type: "extend" | "terminate" | "renew" | "change_tenant" | "update_rent";
  leaseId: string;
  data: {
    newEndDate?: Date;
    newTenantName?: string;
    newTenantEmail?: string;
    newTenantPhone?: string;
    newRent?: number;
    terminationReason?: string;
    effectiveDate?: Date;
  };
  performedBy: string;
  performedAt: Date;
}

export interface TenantChangeRequest {
  leaseId: string;
  currentTenant: {
    name: string;
    email: string;
    phone?: string;
  };
  newTenant: {
    name: string;
    email: string;
    phone?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  };
  effectiveDate: Date;
  keepLeaseTerms: boolean;
  newDeposit?: number;
  reason?: string;
}
