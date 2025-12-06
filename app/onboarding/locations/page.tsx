"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, MapPin, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ServiceArea {
  placeId: string;
  name: string;
  formattedAddress: string;
  postcode?: string;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export default function LocationsPage() {
  const router = useRouter();
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load existing service areas from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.service_areas && Array.isArray(parsed.service_areas)) {
        setServiceAreas(
          parsed.service_areas.map((area: { name: string; formatted_address?: string; postcode?: string; place_id?: string }) => ({
            placeId: area.place_id || `saved-${Date.now()}-${Math.random()}`,
            name: area.name,
            formattedAddress: area.formatted_address || area.name,
            postcode: area.postcode,
          }))
        );
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch predictions from Google Places API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setPredictions([]);
      return;
    }

    const fetchPredictions = async () => {
      setIsLoading(true);
      try {
        // Call our API route that interfaces with Google Places
        const response = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(searchQuery)}&types=(regions)`
        );

        if (response.ok) {
          const data = await response.json();
          setPredictions(data.predictions || []);
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
        // Fallback: Show search query as a manual option
        setPredictions([
          {
            place_id: `manual-${Date.now()}`,
            description: searchQuery,
            structured_formatting: {
              main_text: searchQuery,
              secondary_text: "Add as custom area",
            },
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchPredictions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectPlace = async (prediction: PlacePrediction) => {
    // Check if already added
    if (serviceAreas.some((area) => area.placeId === prediction.place_id)) {
      setSearchQuery("");
      setShowDropdown(false);
      return;
    }

    // Add the area
    const newArea: ServiceArea = {
      placeId: prediction.place_id,
      name: prediction.structured_formatting.main_text,
      formattedAddress: prediction.description,
    };

    // Try to get place details for postcode
    try {
      const response = await fetch(
        `/api/places/details?place_id=${prediction.place_id}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.postcode) {
          newArea.postcode = data.postcode;
        }
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }

    setServiceAreas([...serviceAreas, newArea]);
    setSearchQuery("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const removeArea = (placeId: string) => {
    setServiceAreas(serviceAreas.filter((area) => area.placeId !== placeId));
  };

  const handleContinue = () => {
    if (serviceAreas.length < 1) {
      alert("Please add at least 1 service area");
      return;
    }

    const existing = localStorage.getItem("onboarding_data");
    const onboardingData = existing ? JSON.parse(existing) : {};
    localStorage.setItem(
      "onboarding_data",
      JSON.stringify({
        ...onboardingData,
        service_areas: serviceAreas.map((area) => ({
          name: area.name,
          formatted_address: area.formattedAddress,
          postcode: area.postcode,
          place_id: area.placeId,
        })),
      })
    );
    router.push("/onboarding/review");
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-3 tracking-tight">
          Service Areas
        </h1>
        <p className="text-base text-muted-foreground">
          Search and add the suburbs or areas where you provide services
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
          <Input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => searchQuery && setShowDropdown(true)}
            placeholder="Search for a suburb, city, or region..."
            className={cn(
              "w-full pl-12 pr-4 py-6 rounded-2xl h-auto text-base shadow-sm border-border/60 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
            )}
          />
        </div>

        {/* Predictions Dropdown */}
        {showDropdown && predictions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-2 bg-card rounded-xl border border-border/60 shadow-premium overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                onClick={() => handleSelectPlace(prediction)}
                className={cn(
                  "w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-surface-muted transition-colors",
                  serviceAreas.some((a) => a.placeId === prediction.place_id) &&
                  "opacity-50 cursor-not-allowed"
                )}
                disabled={serviceAreas.some(
                  (a) => a.placeId === prediction.place_id
                )}
              >
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {prediction.structured_formatting.main_text}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {prediction.structured_formatting.secondary_text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Areas as Badges */}
      {serviceAreas.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-medium text-foreground mb-3">
            Selected areas ({serviceAreas.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {serviceAreas.map((area) => (
              <div
                key={area.placeId}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                  "bg-primary/10 text-primary border border-primary/20",
                  "text-sm font-medium transition-all duration-200",
                  "hover:bg-primary/20"
                )}
              >
                <MapPin className="w-4 h-4" />
                <span>{area.name}</span>
                {area.postcode && (
                  <span className="text-primary/80">({area.postcode})</span>
                )}
                <button
                  onClick={() => removeArea(area.placeId)}
                  className="ml-1 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                  aria-label={`Remove ${area.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {serviceAreas.length === 0 && (
        <div className="text-center py-12 px-4 bg-surface-muted/50 rounded-2xl border-2 border-dashed border-border/60 mb-8">
          <MapPin className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground mb-1 font-medium">
            No service areas added yet
          </p>
          <p className="text-sm text-muted-foreground/80">
            Start typing above to search
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="px-6 h-12 text-muted-foreground hover:text-foreground hover:bg-surface-muted/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={serviceAreas.length === 0}
          className={cn(
            "px-8 h-12 text-base font-medium rounded-xl transition-all duration-200",
            "bg-primary hover:bg-primary/90",
            "text-primary-foreground shadow-premium hover:shadow-premium-hover",
            "disabled:opacity-50 disabled:shadow-none min-w-[140px]"
          )}
        >
          <span className="flex items-center gap-2">
            Continue
            <ArrowRight className="w-4 h-4" />
          </span>
        </Button>
      </div>
    </div>
  );
}
