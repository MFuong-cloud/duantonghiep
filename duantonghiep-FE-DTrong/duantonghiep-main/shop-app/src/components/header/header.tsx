import HeaderLeft from "./header-left";
import HeaderRight from "./header-right";

export default function Header() {
    return (
        <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className="container mx-auto px-6 lg:px-10">
                <div className="flex h-16 items-center justify-between">
                    <HeaderLeft />
                    <HeaderRight />
                </div>
            </div>
        </header>
    )
}