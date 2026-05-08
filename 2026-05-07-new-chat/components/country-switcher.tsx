"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { defaultRegionCode, regions } from "@/lib/site-data";

export function CountrySwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeRegion = searchParams.get("region") ?? defaultRegionCode;

  function handleChange(nextRegion: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("region", nextRegion);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <label className="country-switcher">
      <span>Country</span>
      <select value={activeRegion} onChange={(event) => handleChange(event.target.value)}>
        {regions.map((region) => (
          <option key={region.code} value={region.code}>
            {region.name}
          </option>
        ))}
      </select>
    </label>
  );
}
