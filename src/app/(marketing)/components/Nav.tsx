import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <div className="navbar fixed top-0 z-50 bg-base-100/95 backdrop-blur-sm">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/" className="nav-link py-2">Home</Link></li>
            <li><Link href="/how-it-works" className="nav-link py-2">How it Works</Link></li>
            <li><Link href="/reviews" className="nav-link py-2">Reviews</Link></li>
            <li><Link href="/designers" className="nav-link py-2">Designers</Link></li>
            <li><Link href="/auth" className="nav-link py-2">Get Started</Link></li>
          </ul>
        </div>
        <Link href="/" className="hidden lg:flex items-center space-x-4">
          <Image 
            src="/arbor_design_logo.png" 
            alt="Arbor Design Advice" 
            width={48} 
            height={48}
            className="w-12 h-12"
            priority
          />
          <span className="text-antique-gold text-xl font-light">Arbor Design Advice</span>
        </Link>
      </div>
      <div className="navbar-end flex items-center gap-8">
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-8">
            <li><Link href="/" className="nav-link">Home</Link></li>
            <li><Link href="/how-it-works" className="nav-link">How it Works</Link></li>
            <li><Link href="/reviews" className="nav-link">Reviews</Link></li>
            <li><Link href="/designers" className="nav-link">Designers</Link></li>
          </ul>
        </div>
        <Link href="/" className="flex lg:hidden items-center space-x-4">
          <Image 
            src="/arbor_design_logo.png" 
            alt="Arbor Design Advice" 
            width={48} 
            height={48}
            className="w-12 h-12"
            priority
          />
          <span className="text-antique-gold text-xl font-light hidden sm:inline-block">Arbor Design Advice</span>
        </Link>
        <Link href="/auth" className="btn btn-primary hidden lg:inline-flex">Get Started</Link>
      </div>
    </div>
  );
} 