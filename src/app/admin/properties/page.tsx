"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building,
  Plus,
  Edit,
  Trash2,
  MapPin,
  ArrowLeft,
  Search,
  X,
} from "lucide-react";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProperty = () => {
    setEditingProperty({
      id: "",
      name: "",
      address: "",
      description: "",
      latitude: undefined,
      longitude: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setIsEditing(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsEditing(true);
  };

  const handleSaveProperty = async (propertyData: Partial<Property>) => {
    try {
      if (editingProperty?.id) {
        // Update existing property
        const response = await fetch(`/api/properties/${editingProperty.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(propertyData),
        });

        if (response.ok) {
          fetchProperties();
          setIsEditing(false);
          setEditingProperty(null);
        }
      } else {
        // Create new property
        const response = await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(propertyData),
        });

        if (response.ok) {
          fetchProperties();
          setIsEditing(false);
          setEditingProperty(null);
        }
      }
    } catch (error) {
      console.error("Error saving property:", error);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-black">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <PropertyEditor
        property={editingProperty}
        onSave={handleSaveProperty}
        onCancel={() => {
          setIsEditing(false);
          setEditingProperty(null);
        }}
      />
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
              <Building className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-black">
                Properties Management
              </h1>
            </div>
            <Button onClick={handleCreateProperty}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
            <Input
              type="text"
              placeholder="Search properties by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card
              key={property.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{property.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-black mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-black">
                      {property.address}
                    </span>
                  </div>

                  {property.description && (
                    <p className="text-sm text-black line-clamp-2">
                      {property.description}
                    </p>
                  )}

                  {property.latitude && property.longitude && (
                    <div className="text-xs text-black">
                      📍 {property.latitude.toFixed(4)},{" "}
                      {property.longitude.toFixed(4)}
                    </div>
                  )}

                  <div className="text-xs text-black">
                    Created: {new Date(property.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProperty(property)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProperty(property.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-black mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">
              {searchTerm ? "No properties found" : "No properties yet"}
            </h3>
            <p className="text-black mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Start by adding your first property to the system"}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateProperty}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Property Editor Component
interface PropertyEditorProps {
  property: Property | null;
  onSave: (data: Partial<Property>) => void;
  onCancel: () => void;
}

function PropertyEditor({ property, onSave, onCancel }: PropertyEditorProps) {
  const [formData, setFormData] = useState({
    name: property?.name || "",
    address: property?.address || "",
    description: property?.description || "",
    latitude: property?.latitude?.toString() || "",
    longitude: property?.longitude?.toString() || "",
    services: property?.services || [],
    amenities: property?.amenities || [],
    contactEmail: property?.contactEmail || "",
    contactPhone: property?.contactPhone || "",
    managementCompany: property?.managementCompany || "",
    buildingType: property?.buildingType || "apartment",
    yearBuilt: property?.yearBuilt?.toString() || "",
    totalRooms: property?.totalRooms?.toString() || "",
    parkingSpaces: property?.parkingSpaces?.toString() || "",
    pets: property?.pets || "not_allowed",
    smokingPolicy: property?.smokingPolicy || "not_allowed",
    utilities: {
      electricity: property?.utilities?.electricity || "not_included",
      water: property?.utilities?.water || "not_included",
      gas: property?.utilities?.gas || "not_included",
      internet: property?.utilities?.internet || "not_included",
      cable: property?.utilities?.cable || "not_included",
    },
  });

  const [newService, setNewService] = useState("");
  const [newAmenity, setNewAmenity] = useState("");

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData({
        ...formData,
        services: [...formData.services, newService.trim()],
      });
      setNewService("");
    }
  };

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s !== service),
    });
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()],
      });
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: Partial<Property> = {
      name: formData.name,
      address: formData.address,
      description: formData.description,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude
        ? parseFloat(formData.longitude)
        : undefined,
      services: formData.services.length > 0 ? formData.services : undefined,
      amenities: formData.amenities.length > 0 ? formData.amenities : undefined,
      contactEmail: formData.contactEmail || undefined,
      contactPhone: formData.contactPhone || undefined,
      managementCompany: formData.managementCompany || undefined,
      buildingType: formData.buildingType as Property["buildingType"],
      yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
      totalRooms: formData.totalRooms
        ? parseInt(formData.totalRooms)
        : undefined,
      parkingSpaces: formData.parkingSpaces
        ? parseInt(formData.parkingSpaces)
        : undefined,
      pets: formData.pets as Property["pets"],
      smokingPolicy: formData.smokingPolicy as Property["smokingPolicy"],
      utilities: formData.utilities,
    };

    onSave(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={onCancel} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Button>
              <Building className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">
                {property?.id ? "Edit Property" : "Add New Property"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Downtown Apartments"
                    required
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Building Type
                  </label>
                  <select
                    value={formData.buildingType}
                    onChange={(e) => {
                      const value =
                        (e.target.value as Property["buildingType"]) ||
                        "apartment";
                      setFormData({
                        ...formData,
                        buildingType: value,
                      });
                    }}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="apartment">Apartment Building</option>
                    <option value="house">House</option>
                    <option value="condo">Condominium</option>
                    <option value="studio">Studio Complex</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="e.g., 123 Main Street, City, State"
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of the property..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                  <Input
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) =>
                      setFormData({ ...formData, yearBuilt: e.target.value })
                    }
                    placeholder="2020"
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Rooms
                  </label>
                  <Input
                    type="number"
                    value={formData.totalRooms}
                    onChange={(e) =>
                      setFormData({ ...formData, totalRooms: e.target.value })
                    }
                    placeholder="10"
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Spaces
                  </label>
                  <Input
                    type="number"
                    value={formData.parkingSpaces}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parkingSpaces: e.target.value,
                      })
                    }
                    placeholder="5"
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                    placeholder="property@example.com"
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <Input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                    placeholder="+1 555-123-4567"
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Management Company
                </label>
                <Input
                  type="text"
                  value={formData.managementCompany}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      managementCompany: e.target.value,
                    })
                  }
                  placeholder="ABC Property Management"
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    placeholder="e.g., 40.7128"
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    placeholder="e.g., -74.0060"
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Property Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Add service (e.g., Cleaning, Maintenance, Security)"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addService())
                  }
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button type="button" onClick={addService}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.services.map((service) => (
                  <span
                    key={service}
                    className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {service}
                    <button
                      type="button"
                      onClick={() => removeService(service)}
                      className="ml-2 hover:text-green-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Building Amenities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Add amenity (e.g., Gym, Pool, Laundry, Rooftop)"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addAmenity())
                  }
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button type="button" onClick={addAmenity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="ml-2 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Policy
                  </label>
                  <select
                    value={formData.pets}
                    onChange={(e) => {
                      const value =
                        (e.target.value as Property["pets"]) || "not_allowed";
                      setFormData({
                        ...formData,
                        pets: value,
                      });
                    }}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="not_allowed">Not Allowed</option>
                    <option value="allowed">Allowed</option>
                    <option value="with_deposit">Allowed with Deposit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Smoking Policy
                  </label>
                  <select
                    value={formData.smokingPolicy}
                    onChange={(e) => {
                      const value =
                        (e.target.value as Property["smokingPolicy"]) ||
                        "not_allowed";
                      setFormData({
                        ...formData,
                        smokingPolicy: value,
                      });
                    }}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="not_allowed">Not Allowed</option>
                    <option value="outdoor_only">Outdoor Only</option>
                    <option value="allowed">Allowed</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utilities */}
          <Card>
            <CardHeader>
              <CardTitle>Utilities Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(formData.utilities).map(([utility, value]) => (
                  <div key={utility}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {utility}
                    </label>
                    <select
                      value={value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          utilities: {
                            ...formData.utilities,
                            [utility]: e.target.value as
                              | "included"
                              | "not_included",
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="not_included">Not Included</option>
                      <option value="included">Included</option>
                    </select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {property?.id ? "Update Property" : "Create Property"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
