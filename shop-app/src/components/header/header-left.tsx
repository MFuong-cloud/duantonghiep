"use client";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Croissant, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";

export default function HeaderLeft() {
    const [selectedLocation, setSelectedLocation] = useState(
        "Đông Anh, Thanh Hóa"
    );
    const [searchTerm, setSearchTerm] = useState("");

    const locations = {
        "1": "Đông Anh, Thanh Hóa",
        "2": "Phủ Lý, Hà Nội",
        "3": "Hoàng Mai, Hà Nội",
        "4": "CS1, Hà Nam",
        "7": "CS2, Bình Dương",
        "8": "CS3, Bình Thuận",
        "9": "CS4, Bình Phước",
    };

    const filteredLocations = Object.values(locations).filter((loc) =>
        loc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex items-center gap-3 group">
            <Link
                href="/"
                className="rounded-full bg-gradient-to-br from-[var(--co-orage-button-start)] to-[var(--co-orage-button-end)] p-2 transition-transform group-hover:scale-110"
            >
                <Croissant className="h-6 w-6 text-white" />
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="flex text-l font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            {selectedLocation}
                            <SearchIcon className="ml-2 w-5 text-orange-600 transition-colors group-hover:text-foreground" />
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="p-3 bg-background shadow-md rounded-lg min-h-80">
                            <div className="relative mb-3">
                                <Input
                                    placeholder="Tìm khu vực..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-10 pl-10"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3 overflow-y-auto min-w-200">
                                {filteredLocations.length > 0 ? (
                                    filteredLocations.map((loc) => (
                                        <button
                                            key={loc}
                                            onClick={() => setSelectedLocation(loc)}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                                selectedLocation === loc
                                                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                                                    : "hover:bg-accent hover:text-foreground"
                                            }`}
                                        >
                                            {loc}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-2">
                                        Không tìm thấy khu vực
                                    </p>
                                )}
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}
