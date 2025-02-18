import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-charcoal/40 z-[1]"></div>
        <Image
          src="/hero.webp"
          alt="Beautiful interior design"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-medium mb-6 text-cream drop-shadow-lg">
            Get expert design opinions whenever you need it.
          </h1>
          <p className="text-cream text-xl mb-12 max-w-2xl mx-auto drop-shadow-lg font-medium">
            Space planning, product sourcing, paint selections and more — unbiased feedback on all things home design.
          </p>
          <Link 
            href="/auth" 
            className="btn btn-primary btn-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Example Section */}
      <section className="bg-base-200 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-normal mb-8">CHECK OUT THIS EXAMPLE</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl mb-4">The Question</h3>
              <p className="text-neutral/80">
                This homeowner had questions about seating for their family&apos;s dining area.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-4">The Session</h3>
              <p className="text-neutral/80">
                Our expert designer provided detailed recommendations and product links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <h3 className="text-lg mb-2">Space Planning</h3>
            </div>
            <div className="text-center p-4">
              <h3 className="text-lg mb-2">Color Planning</h3>
            </div>
            <div className="text-center p-4">
              <h3 className="text-lg mb-2">Hardware</h3>
            </div>
            <div className="text-center p-4">
              <h3 className="text-lg mb-2">Buying Furniture</h3>
            </div>
            <div className="text-center p-4">
              <h3 className="text-lg mb-2">Lighting</h3>
            </div>
            <div className="text-center p-4">
              <h3 className="text-lg mb-2">Window Treatment</h3>
            </div>
            <div className="text-center p-4">
              <h3 className="text-lg mb-2">Garden</h3>
            </div>
            <div className="text-center p-4">
              <h3 className="text-lg mb-2">Styling</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-base-200 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-normal mb-6">Subscribe to our newsletter</h2>
          <p className="mb-8">Sign up with your email address to receive news and updates.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="input input-bordered w-full max-w-xs bg-base-100"
            />
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-100 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-normal mb-4">Arbor Design Advice</h2>
          <p className="mb-2">hello@arbordesignadvice.com</p>
          <p className="mb-4">P.O. Box 3002</p>
          <p>Chapel Hill, NC. USA</p>
          <p className="mt-8 text-sm">Arbor Design Advice, LLC. All Rights Reserved. Est. 2024</p>
        </div>
      </footer>
    </main>
  );
} 