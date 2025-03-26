"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function CountryPage() {
  const { countryCode } = useParams();
  const [states, setStates] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/location/states?countryCode=${countryCode}`)
      .then((res) => res.json())
      .then((data) => setStates(data.states));
  }, [countryCode]);

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Select a State in {countryCode}</h2>
      <div className="grid grid-cols-3 gap-4">
        {states.map((state) => (
          <div
            key={state}
            className="p-4 border rounded-lg text-center cursor-pointer hover:shadow-md"
            onClick={() => router.push(`/country/${countryCode}/state/${state}`)}
          >
            <p>{state}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
