"use client";

import { BarChart, Compass, Layout, List } from "lucide-react"
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoute = [
    {
        icon: Layout,
        label: 'Dashboard',
        href: '/'
    },
    {
        icon: Compass,
        label: 'Browse',
        href: '/search'
    },
];

const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: '/teacher/courses'
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: '/teacher/analytics'
    }
]

export const SlidebarRoute = () => {

    const pathname = usePathname()

    const isTeacherRoute = pathname?.includes('/teacher')

    const routes = isTeacherRoute ? teacherRoutes : guestRoute;



    return(
        <>
            <div className="w-full flex flex-col">
                {
                    routes.map((route) => (
                        <SidebarItem 
                            key={route.href}
                            icon={route.icon}
                            label={route.label}
                            href={route.href}
                        />
                    ))
                }
            </div>
        </>
    )
}