import Link from "next/link";
import Image from "next/image";

export default function AuthNavigation() {
  return (
    <nav className="navbar bg-base-100 border-b border-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/arbor_design_logo.png" 
            alt="Arbor Design Advice" 
            width={32} 
            height={32}
            priority
          />
          <span className="text-xl font-medium text-antique-gold">Arbor Design Advice</span>
        </Link>
      </div>
    </nav>
  );
} 