import BookingPageContent from "@/components/booking/BookingPageContent";

interface BookingPageProps {
    searchParams?: {
        branchId?: string;
    };
}

export default function BookingPage({ searchParams }: BookingPageProps) {
    const branchIdParam = searchParams?.branchId;
    const parsedBranchId = branchIdParam ? Number(branchIdParam) : undefined;
    const branchId = parsedBranchId !== undefined && !Number.isNaN(parsedBranchId) ? parsedBranchId : undefined;
    return <BookingPageContent />;
}
