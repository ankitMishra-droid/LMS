"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export const NavbarItem = () => {
    const pathname = usePathname()

    const isTeacher = pathname?.startsWith('/teacher')
    const isPalyerPage = pathname?.includes('/chapter')
    
    return(
        <div className="flex gap-x-2 ml-auto">
            {isTeacher || isPalyerPage ? (
                <Link href="/">
                <Button size='sm' variant='ghost'>
                    <LogOut className="h-4 w-4 mr-2"/>
                    Exit
                </Button>
                </Link>
            ) : (
                <Link href="/teacher/courses">
                    <Button size="sm" variant="ghost">
                        Teacher Mode
                    </Button>
                </Link>
            )}
            <UserButton 
                afterSignOutUrl="/"
            />
        </div>
    )
}