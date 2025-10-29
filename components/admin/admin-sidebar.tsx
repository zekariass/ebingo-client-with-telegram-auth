// "use client"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { LayoutDashboard, Users, GamepadIcon, Settings, BarChart3, Shield, LogOut, Mic, X, Home } from "lucide-react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { useEffect } from "react"


// const sidebarItems = [
//   {
//     title: "Home",
//     href: "/",
//     icon: Home,
//   },
//   {
//     title: "Dashboard",
//     href: "/admin",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "Rooms",
//     href: "/admin/rooms",
//     icon: GamepadIcon,
//   },
//   {
//     title: "Games",
//     href: "/admin/games",
//     icon: Settings,
//   },
//   {
//     title: "Manual Calling",
//     href: "/admin/manual-calling",
//     icon: Mic,
//   },
//   {
//     title: "Players",
//     href: "/admin/players",
//     icon: Users,
//   },
//   {
//     title: "Analytics",
//     href: "/admin/analytics",
//     icon: BarChart3,
//   },
// ]

// interface AdminSidebarProps {
//   isOpen?: boolean
//   onClose?: () => void
// }

// /**
//  * Admin Sidebar Component
//  *
//  * Responsive navigation sidebar for admin dashboard. Shows as fixed sidebar on desktop
//  * and slide-in drawer on mobile/tablet devices.
//  *
//  * @param isOpen - Controls visibility of mobile drawer
//  * @param onClose - Callback function to close mobile drawer
//  * @returns JSX element containing the navigation sidebar
//  */
// export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
//   const pathname = usePathname()

//   // Removed auto-close on pathname change to prevent drawer from closing immediately
//   useEffect(() => {
//     if (onClose) {
//       onClose()
//     }
//   }, [pathname, onClose])

//   return (
//     <>
//       {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} aria-hidden="true" />}

//       <div
//         className={cn(
//           "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 ease-in-out lg:hidden",
//           isOpen ? "translate-x-0" : "-translate-x-full",
//         )}
//       >
//         <div className="flex flex-col h-full">
//           <div className="p-4 flex items-center justify-between border-b">
//             <div className="flex items-center gap-2">
//               <Shield className="h-5 w-5 text-primary" />
//               <span className="font-bold text-base">Bingo Admin</span>
//             </div>
//             <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close menu">
//               <X className="h-4 w-4" />
//             </Button>
//           </div>

//           <ScrollArea className="flex-1 px-3 py-2">
//             <div className="space-y-1">
//               {sidebarItems.map((item) => (
//                 <Button
//                   key={item.href}
//                   variant={pathname === item.href ? "secondary" : "ghost"}
//                   className={cn("w-full justify-start text-sm py-2", pathname === item.href && "bg-secondary")}
//                   asChild
//                   onClick={onClose} // Close drawer when navigation item is clicked
//                 >
//                   <Link href={item.href}>
//                     <item.icon className="mr-2 h-4 w-4" />
//                     {item.title}
//                   </Link>
//                 </Button>
//               ))}
//             </div>
//           </ScrollArea>

//           <div className="p-3 border-t">
//             <Button
//               variant="ghost"
//               className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-sm py-2"
//             >
//               <LogOut className="mr-2 h-4 w-4" />
//               Sign Out
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="hidden lg:flex lg:w-64 lg:flex-col lg:bg-card lg:border-r">
//         <div className="p-6 border-b">
//           <div className="flex items-center gap-2">
//             <Shield className="h-6 w-6 text-primary" />
//             <span className="font-bold text-lg">Bingo Admin</span>
//           </div>
//         </div>

//         <ScrollArea className="flex-1 px-3 py-2">
//           <div className="space-y-1">
//             {sidebarItems.map((item) => (
//               <Button
//                 key={item.href}
//                 variant={pathname === item.href ? "secondary" : "ghost"}
//                 className={cn("w-full justify-start", pathname === item.href && "bg-secondary")}
//                 asChild
//               >
//                 <Link href={item.href}>
//                   <item.icon className="mr-2 h-4 w-4" />
//                   {item.title}
//                 </Link>
//               </Button>
//             ))}
//           </div>
//         </ScrollArea>

//         <div className="p-3 border-t">
//           <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
//             <LogOut className="mr-2 h-4 w-4" />
//             Sign Out
//           </Button>
//         </div>
//       </div>
//     </>
//   )
// }



"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Users, GamepadIcon, Settings, BarChart3, Shield, LogOut, Mic, Home, X, Wallet, DollarSign } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  { title: "Home", href: "/", icon: Home },
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Rooms", href: "/admin/rooms", icon: GamepadIcon },
  {title: "Deposits", href: "/admin/deposits", icon: Wallet},
  {title: "Withdrawals", href: "/admin/withdrawals", icon: DollarSign},
  // { title: "Games", href: "/admin/games", icon: Settings },
  // { title: "Manual Calling", href: "/admin/manual-calling", icon: Mic },
  // { title: "Players", href: "/admin/players", icon: Users },
  // { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
]

interface AdminSidebarProps {
  isMobile?: boolean
  onLinkClick?: () => void
}

export function AdminSidebar({ isMobile = false, onLinkClick }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 ease-in-out flex flex-col h-full bg-card ${isMobile ? "w-64" : "w-64 lg:w-64"}`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Shield className={isMobile ? "h-5 w-5 text-primary" : "h-6 w-6 text-primary"} />
          <span className={isMobile ? "font-bold text-base" : "font-bold text-lg"}>Bingo Admin</span>
        </div>
        {isMobile && onLinkClick && (
          <Button variant="ghost" size="sm" onClick={onLinkClick} aria-label="Close menu">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Menu */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start text-sm py-2", pathname === item.href && "bg-secondary")}
              asChild
              onClick={onLinkClick}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Sign Out */}
      <div className="p-3 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-sm py-2"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
