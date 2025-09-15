"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ParkingCircle,
  Siren,
  Wind,
  Droplet,
  User,
  Users,
  Accessibility,
  Map,
  GraduationCap,
  Sun,
  Car,
  Building2,
  Sparkles,
} from "lucide-react";

const allFacilities = [
  { id: "ac", label: "Air Conditioning", icon: Wind },
  { id: "washroom", label: "Washroom", icon: Droplet },
  { id: "parking", label: "Parking Spaces", icon: ParkingCircle },
  { id: "outdoor-seating", label: "Outdoor Seating", icon: Sun },
  { id: "familyFriendly", label: "Family Friendly", icon: Users },
  { id: "womenSafety", label: "Women Safety", icon: Siren },
  { id: "lgbtq", label: "LGBTQ+ Friendly", icon: User },
  { id: "groups", label: "Good for Groups", icon: Users },
  { id: "students", label: "University Students", icon: GraduationCap },
  { id: "tourists", label: "Good for Tourists", icon: Map },
  {
    id: "wheelchair-seating",
    label: "Wheelchair-accessible Seating",
    icon: Accessibility,
  },
  {
    id: "wheelchair-toilet",
    label: "Wheelchair-accessible Toilet",
    icon: Accessibility,
  },
  { id: "kerbside-pickup", label: "Kerbside Pickup", icon: Car },
  { id: "drive-through", label: "Drive-through", icon: Building2 },
];

type FacilitiesSelectorProps = {
  selected: string[];
  onChange: (facilities: string[]) => void;
};

export default function FacilitiesSelector({
  selected,
  onChange,
}: FacilitiesSelectorProps) {
  const handleToggle = (facilityId: string) => {
    const newFacilities = selected.includes(facilityId)
      ? selected.filter((id) => id !== facilityId)
      : [...selected, facilityId];
    onChange(newFacilities);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header */}
      {/* Facilities List */}
      <div className="flex flex-col gap-3 p-4">
        {allFacilities.map((facility) => (
          <div
            key={facility.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card shadow-sm"
          >
            <div className="flex items-center gap-3">
              <facility.icon className="h-5 w-5 text-primary" />
              <span className="font-medium">{facility.label}</span>
            </div>
            <Switch
              id={`facility-${facility.id}`}
              checked={selected.includes(facility.id)}
              onCheckedChange={() => handleToggle(facility.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
