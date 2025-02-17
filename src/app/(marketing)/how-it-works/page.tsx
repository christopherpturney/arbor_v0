import Image from "next/image";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-cream">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl mb-6">How Arbor Works</h1>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
            Get expert design advice without the $2-3K initial deposit. Our process is simple, efficient, and tailored to your needs.
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="text-center">
            <div className="bg-sage/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-sage">1</span>
            </div>
            <h3 className="text-xl mb-3">Submit Your Question</h3>
            <p className="text-charcoal/80">
              Share your design dilemma, upload photos, and tell us about your style preferences.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-sage/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-sage">2</span>
            </div>
            <h3 className="text-xl mb-3">Get Matched</h3>
            <p className="text-charcoal/80">
              We'll pair you with an expert designer who specializes in your style and project type.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-sage/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-sage">3</span>
            </div>
            <h3 className="text-xl mb-3">Receive Expert Advice</h3>
            <p className="text-charcoal/80">
              Within 48 hours, get personalized recommendations, product links, and detailed guidance.
            </p>
          </div>
        </div>

        {/* Example Questions Section */}
        <section className="mb-20">
          <h2 className="text-3xl text-center mb-12">Types of Questions We Answer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-soft-white p-8 rounded-lg">
              <h3 className="text-xl mb-4 text-antique-gold">Space Planning</h3>
              <p className="text-charcoal/80 mb-4">
                "Looking to make updates to the bedroom on a budget. Perhaps arranging furniture in a different way, a new carpet and new bedding."
              </p>
              <p className="text-sage italic">Style: Farmhouse, Boho, Clean designs</p>
            </div>
            <div className="bg-soft-white p-8 rounded-lg">
              <h3 className="text-xl mb-4 text-antique-gold">Hardware Selection</h3>
              <p className="text-charcoal/80 mb-4">
                "Need advice about hardware for a powder bathroom, have wallpaper and vanity but want expert advice on complementary hardware."
              </p>
              <p className="text-sage italic">Style: Traditional, Elegant, European</p>
            </div>
            <div className="bg-soft-white p-8 rounded-lg">
              <h3 className="text-xl mb-4 text-antique-gold">Paint & Color</h3>
              <p className="text-charcoal/80 mb-4">
                "Need help selecting paint colors for living room built-ins and guidance on what portions should be painted."
              </p>
              <p className="text-sage italic">Style: Modern Farmhouse, Traditional, Coastal</p>
            </div>
            <div className="bg-soft-white p-8 rounded-lg">
              <h3 className="text-xl mb-4 text-antique-gold">Furniture & Decor</h3>
              <p className="text-charcoal/80 mb-4">
                "Looking for a functional sideboard within budget. Need help navigating options and finding the right piece."
              </p>
              <p className="text-sage italic">Style: Modern Farmhouse, Traditional, Coastal</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-20">
          <h2 className="text-3xl mb-6">Ready to Transform Your Space?</h2>
          <p className="text-lg text-charcoal/80 mb-8 max-w-2xl mx-auto">
            Get personalized design advice from experienced professionals at a fraction of the cost.
          </p>
          <button className="btn btn-primary btn-lg">Start Your Design Session</button>
        </section>
      </main>
    </div>
  );
} 