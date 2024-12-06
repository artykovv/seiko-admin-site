import "./globals.css";

export const metadata = {
  title: "Seiko Global",
  description: "Admin panel Seiko Global",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
