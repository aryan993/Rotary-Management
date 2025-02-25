import Navbar from "./dashboard/components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="flex-1 p-4">{children}</main>
      </body>
    </html>
  );
}
