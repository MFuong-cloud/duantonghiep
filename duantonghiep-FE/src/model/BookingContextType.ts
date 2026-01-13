export interface BookingContextType {
    date: Date | null;
    setDate: (v: Date | null) => void;
    time: string;
    setTime: (v: string) => void;
    guests: string;
    setGuests: (v: string) => void;
    notes: string;
    setNotes: (v: string) => void;
    fullName: string;
    setFullName: (v: string) => void;
    phone: string;
    setPhone: (v: string) => void;
    resetBooking: () => void;
}
