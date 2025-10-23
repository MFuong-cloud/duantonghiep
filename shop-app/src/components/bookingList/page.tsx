import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";

export default function BookingList() {
    return (
        <div className="w-full px-60 my-15">
            <h3 className="font-semibold my-2 text-4xl pb-4">Đặt bàn ngay</h3>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <CarouselContent>
                    {Array.from({length: 10}).map((_, index) => (
                        <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                            <div className="p-1">
                                <Card>
                                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                                        <Image
                                            src="/image/homepage/restaurant.png"
                                            alt="Nhà Hàng Lippo Chiuchow"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-4 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Nhà Hàng Lippo Chiuchow</h4>
                                            <div className="flex items-center gap-1 mb-2">
                                                <span className="text-yellow-500">★</span>
                                                <span className="font-medium">5.0</span>
                                                <span className="text-gray-500">· Món Hoa · $$</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                                </svg>
                                                <span>Hà Nội</span>
                                            </div>
                                        </div>
                                        <button
                                            className="mt-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">
                                            Booking now
                                        </button>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious/>
                <CarouselNext/>
            </Carousel>
        </div>
    );
}
