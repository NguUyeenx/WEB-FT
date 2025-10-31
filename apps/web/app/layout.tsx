export const metadata = {
  title: 'ShoeParadise - Modern Shoe Store',
  description: 'A modern e-commerce experience for shoes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
