import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ApiProvider from "@/components/providers/api-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SÀI GÒN VALVE | Professional Industrial Solutions",
  description: "Sài Gòn Valve chuyên cung cấp valve và phụ kiện đường ống, giải pháp IOT quản trị tập trung cho ngành nước.",
  keywords: ["Sài Gòn Valve", "Van công nghiệp", "Giải pháp IoT", "Ngành nước"],
  icons: {
    icon: "https://saigonvalve.vn/uploads/files/2024/08/05/NH-_PH-N_PH-I_-C_QUY-N__25_-removebg-preview.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ApiProvider>
            {children}
            <Toaster position="top-right" richColors />
          </ApiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
