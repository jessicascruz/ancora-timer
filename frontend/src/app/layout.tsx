import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar, Sidebar } from "@/components"
import { Toaster } from "react-hot-toast"
import LayoutClient from "./layout-client"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Ancora Timer - Pomodoro with AI",
  description: "Intelligent Pomodoro timer with AI-powered note extraction",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-surface text-on-surface">
        <LayoutClient>
          {children}
        </LayoutClient>
        <Toaster />
      </body>
    </html>
  )
}
