
"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

const navLinks: { name: string, href: string }[] = [
    { name: "Food Partner", href: "/for-restaurants" },
    { name: "Delivery Partners", href: "/for-delivery-partners" },
]

const moreLinks = [
    { name: "About Us", href: "/about" },
    { name: "Investor Relations", href: "/investor-relations" },
    { name: "Blogs", href: "/blog" },
    { name: "Career", href: "/career" },
    { name: "Announcement", href: "/announcement" },
    { name: "Cities we are available", href: "/cities" },
]

export default function Header() {
  const pathname = usePathname();
  const showLogin = pathname === '/for-restaurants' || pathname === '/for-chefs';

  return (
    <header className="w-full bg-background">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
            <Logo className="w-40 h-auto" />
        </Link>
        <div className="flex items-center gap-2">
          {showLogin && <Button variant="outline" className="font-headline">Login</Button>}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-[300px] sm:w-[340px]">
                <SheetTitle className="sr-only">Menu</SheetTitle>
               <div className="flex h-full flex-col">
                <div className="flex items-center p-6 border-b">
                   <Link href="/" className="flex items-center gap-3">
                      <Logo />
                  </Link>
                </div>
                <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                  <nav className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <Link 
                            key={link.href} 
                            href={link.href} 
                            className={cn(
                                "font-semibold text-lg hover:text-primary transition-colors",
                                pathname === link.href ? "text-primary" : "text-foreground"
                            )}
                        >
                          {link.name}
                        </Link>
                      ))}
                  </nav>
                  
                   <nav className="flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">More</h3>
                    {moreLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href} 
                            className={cn(
                                "font-medium text-muted-foreground hover:text-primary transition-colors",
                                pathname === link.href ? "text-primary" : ""
                            )}
                        >
                          {link.name}
                        </Link>
                      ))}
                  </nav>
                </div>
                <div className="p-6 border-t">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact-us">Contact us</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
