import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type BookingCtx = {
  preselectedService: string;
  selectService: (id: string) => void;
  clearService: () => void;
};

const Ctx = createContext<BookingCtx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [preselectedService, setService] = useState("");

  const selectService = useCallback((id: string) => {
    setService(id);
    if (typeof document !== "undefined") {
      const el = document.getElementById("booking");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const clearService = useCallback(() => setService(""), []);

  return (
    <Ctx.Provider value={{ preselectedService, selectService, clearService }}>
      {children}
    </Ctx.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
