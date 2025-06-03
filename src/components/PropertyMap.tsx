"use client";

import { useRef } from "react";
import { Property } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property;
  onPropertySelect?: (property: Property) => void;
  height?: string;
  className?: string;
}

export function PropertyMap({
  properties,
  selectedProperty,
  onPropertySelect,
  height = "400px",
  className = "",
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  // Function to open in Google Maps
  const openInGoogleMaps = (property: Property) => {
    const query = encodeURIComponent(property.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simulated map */}
          <div
            ref={mapRef}
            className="relative bg-gray-100 rounded-lg overflow-hidden border"
            style={{ height }}
          >
            {/* While we don't have API key, we show a placeholder map */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-black mb-2">
                  Property Map
                </h3>
                <p className="text-black text-sm max-w-xs">
                  Interactive view of all available property locations
                </p>
              </div>
            </div>

            {/* Overlay with property information */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-white rounded-lg shadow-lg p-3 max-h-32 overflow-y-auto">
                <div className="text-sm text-black mb-2">
                  {properties.length} propert
                  {properties.length !== 1 ? "ies" : "y"} found
                </div>
                <div className="space-y-1">
                  {properties.slice(0, 3).map((property) => (
                    <div
                      key={property.id}
                      className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition-colors ${
                        selectedProperty?.id === property.id
                          ? "bg-blue-100 text-blue-800"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => onPropertySelect?.(property)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${
                            selectedProperty?.id === property.id
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        ></div>
                        <span className="font-medium">{property.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          openInGoogleMaps(property);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {properties.length > 3 && (
                    <div className="text-xs text-black text-center pt-1">
                      +{properties.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Property list */}
          <div className="space-y-2">
            {properties.map((property, propertyIndex) => (
              <div
                key={property.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedProperty?.id === property.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => onPropertySelect?.(property)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3 ${
                        selectedProperty?.id === property.id
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {propertyIndex + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-black">
                        {property.name}
                      </h4>
                      <p className="text-sm text-black">{property.address}</p>
                      {property.description && (
                        <p className="text-xs text-black mt-1">
                          {property.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        openInGoogleMaps(property);
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View on Google Maps
                    </Button>
                  </div>
                </div>

                {/* Coordinates if available */}
                {property.latitude && property.longitude && (
                  <div className="mt-2 text-xs text-black">
                    📍 {property.latitude.toFixed(4)},{" "}
                    {property.longitude.toFixed(4)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional information */}
          <div className="text-xs text-black bg-gray-50 p-3 rounded-lg">
            <p className="mb-1">
              <strong>💡 Tip:</strong> Click on a property to highlight it on
              the map
            </p>
            <p>
              <strong>🗺️ Note:</strong> For full map functionality, Google Maps
              API integration is required
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
