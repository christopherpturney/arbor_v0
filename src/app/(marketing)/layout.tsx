import "./marketing.css";
import Nav from "./components/Nav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-100">
      <Nav />
      {children}
    </div>
  );
} 