// Local Navbar for Signup Page Only
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SignUpNavbar() {
    return (
        <header className="container px-8">
            <nav className="border-b">
                <Link href="/">
                    <Avatar className="w-[70px] h-[70px]">
                        <AvatarImage className="w-full h-full" src="/greentoad.png" alt="@GreenToad" />
                        <AvatarFallback className="text-xl">GT</AvatarFallback>
                    </Avatar>
                </Link>
            </nav>
        </header>
    );
}
