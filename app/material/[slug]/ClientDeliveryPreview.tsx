"use client";

import { useEffect, useState } from "react";

export default function ClientDeliveryPreview({
  minDays,
  maxDays,
  inputId,
}: {
  minDays: number;
  maxDays: number;
  inputId: string;
}) {
  const [pincodeFilled, setPincodeFilled] = useState(false);
  const [eta, setEta] = useState<number | null>(null);

  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (!input) return;

    const handler = () => {
      const ok = /^\d{6}$/.test(input.value ?? "");
      setPincodeFilled(ok);

      if (ok) {
        const d = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
        setEta(d);
      } else {
        setEta(null);
      }
    };

    input.addEventListener("input", handler);
    handler();

    return () => input.removeEventListener("input", handler);
  }, [minDays, maxDays, inputId]);

  return (
    <p className="text-xs text-gray-600 mt-1">
      {pincodeFilled && eta ? (
        <>
          Estimated delivery: <b>{eta} days</b> (preview)
        </>
      ) : (
        <>Enter a 6-digit pincode to preview delivery time.</>
      )}
    </p>
  );
}
