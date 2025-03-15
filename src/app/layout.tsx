import type React from "react"
import { Inter } from "next/font/google"
// import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Document Classification System",
  description: "Secure document management and classification for banking",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}
          <SidebarProvider>
            <div className="flex min-h-screen gap-4">
              <AppSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
            <Toaster />
          </SidebarProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

