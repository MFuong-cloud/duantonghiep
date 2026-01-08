import AboutSectionPage from "@/components/aboutSection/page";
import BookingList from "@/components/bookingList/page";
import MainContentPage from "@/components/content/page";

export default function Home() {
    return (
        <div className="h-full w-full">
            <MainContentPage />
            <BookingList />
            <AboutSectionPage />
        </div>
    );
}
