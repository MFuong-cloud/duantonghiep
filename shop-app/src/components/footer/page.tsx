export default function FooterForm() {
    return (
        <div className="app-promo-section w-full bg-[#fffff5] relative border-t">
            <div className="footer-title flex w-full my-10 container mx-auto border-b">
                <div className="w-[30%] text-orange-500 text-4xl font-bold">Booking now</div>
                <div className="w-[70%] flex justify-around text-lg space-y-4">
                    <div className="flex-1 text-2xl space-y-4 font-semibold">About</div>
                    <div className="flex-1 text-2xl space-y-4 font-semibold">Job</div>
                    <div className="flex-1 text-2xl space-y-4 font-semibold">News</div>
                    <div className="flex-1 text-2xl space-y-4 font-semibold">Address</div>
                </div>
            </div>
            <div className="footer-detail flex container mx-auto pb-4">
                <div className="w-[30%] text-2xl font-semibold">
                    <div className="mr-8">Booking-web powers the world’s best restaurants, using technology to imagine
                        the future of hospitality.
                    </div>
                    <div className="flex space-x-4 text-gray-500 mt-4">
                        <a href="#" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 viewBox="0 0 24 24">
                                <path
                                    d="M12 2.163c3.204 0 3.584.012 4.847.07 3.252.148 4.771 1.691 4.919 4.919.058 1.263.069 1.643.069 4.847v.004c0 3.204-.012 3.584-.069 4.847-.149 3.228-1.668 4.771-4.919 4.919-1.263.058-1.643.069-4.847.069h-.004c-3.204 0-3.584-.012-4.847-.069-3.252-.148-4.771-1.691-4.919-4.919-.057-1.263-.069-1.643-.069-4.847v-.004c0-3.204.012-3.584.069-4.847.149-3.228 1.668-4.771 4.919-4.919 1.263-.058 1.643-.069 4.847-.069h.004zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.28-.073 1.688-.073 4.948v.004c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.688.072 4.948.072h.004c3.259 0 3.668-.014 4.947-.072 4.359-.2 6.78-2.618 6.98-6.98.059-1.28.073-1.688.073-4.948v-.004c0-3.259-.014-3.667-.072-4.947-.2-4.359-2.618-6.78-6.98-6.98-1.28-.059-1.689-.073-4.948-.073h-.004zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.283 0-4.162-1.879-4.162-4.162s1.879-4.162 4.162-4.162 4.162 1.879 4.162 4.162-1.879 4.162-4.162 4.162zm6.406-11.845c-.748 0-1.441-.568-1.441-1.283s.693-1.283 1.441-1.283 1.441.568 1.441 1.283-.693 1.283-1.441 1.283z"/>
                            </svg>
                        </a>
                        <a href="#" aria-label="Twitter/X">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 viewBox="0 0 24 24">
                                <path
                                    d="M18.244 2.25h3.308l-7.247 8.47 7.247 8.47-3.308 1.02H9.27l-7.247-8.47L9.27 3.27H18.244z"/>
                            </svg>
                        </a>
                        <a href="#" aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 viewBox="0 0 24 24">
                                <path
                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.064V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.972.923-1.972 1.877v2.25h3.356l-.53 3.47h-2.826v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="w-[70%] flex justify-around">
                    <div className="flex-1">
                        <div className="text-lg space-y-2">Nearby Restaurants</div>
                        <div className="text-lg space-y-2">Climbing</div>
                        <div className="text-lg space-y-2">Top Rated</div>
                        <div className="text-lg space-y-2">New on Resy</div>
                        <div className="text-lg space-y-2">Events</div>
                        <div className="text-lg space-y-2">Guides</div>
                        <div className="text-lg space-y-2">The Hit List</div>
                    </div>
                    <div className="flex-1">
                        <div className="text-lg space-y-2">Stories</div>
                        <div className="text-lg space-y-2">U.S. Card Offers from Amex</div>
                        <div className="text-lg space-y-2">Global Dining Access</div>
                        <div className="text-lg space-y-2">Resy Gift Card</div>
                        <div className="text-lg space-y-2">Security Center</div>
                    </div>
                    <div className="flex-1">
                        <div className="text-lg space-y-2">Book a Consultation</div>
                        <div className="text-lg space-y-2">Resy for Restaurants</div>
                        <div className="text-lg space-y-2">Pricing</div>
                    </div>
                    <div className="flex-1">
                        <div className="text-lg space-y-2">Resy OS Blog</div>
                        <div className="text-lg space-y-2">Resy Help Desk</div>
                        <div className="text-lg space-y-2">Resy OS Dashboard</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
