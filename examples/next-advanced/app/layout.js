import '../styles/demo.css';

export const metadata = {
  title: 'Next.js App Router Advanced Example',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
