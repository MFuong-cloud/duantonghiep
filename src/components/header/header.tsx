import HeaderLeft from "./header-left";
import HeaderRight from "./header-right";
import HeaderSearch from "./header-search";

export default function Header() {
    return (
        <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className="container mx-auto px-6 lg:px-10">
                <div className="flex h-16 items-center justify-between">
                     <div className="flex-shrink-0">
                        <HeaderLeft />
                    </div>
                     <div className="flex-1 flex justify-center">
                        <HeaderSearch />
                    </div>
                      <div className="flex-shrink-0">
                        <HeaderRight />
                    </div>
                </div>
            </div>
        </header>
    )
}