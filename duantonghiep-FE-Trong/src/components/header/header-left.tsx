"use client";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Croissant, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBooking } from "@/contexts/BookingContext";
import {BranchService} from "@/api/branches/branch.service";

export default function HeaderLeft() {
    const { location, setLocation, branches, setBranches } = useBooking();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const result = await BranchService.getListBranch();

                if (result.ok && result.payload) {
                    // Xử lý dữ liệu trả về - có thể là result.payload.data hoặc result.payload
                    const branchesData = result.payload.data || result.payload;
                    setBranches(Array.isArray(branchesData) ? branchesData : []);
                } else {
                    console.error("Lỗi khi lấy danh sách nhà hàng:", result.payload?.message);
                    setBranches([]);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setBranches([]);
            }
        };

        fetchBranches();
    }, []);

    const filteredLocations = branches.filter( branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                            {location ? location.name: "Chọn chi nhánh"}
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
                                            key={loc.id}
                                            onClick={() => setLocation(loc)}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                                location?.id === loc.id
                                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                                                : "hover:bg-accent hover:text-foreground"
                                            }`}>
                                            {loc.name}
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
