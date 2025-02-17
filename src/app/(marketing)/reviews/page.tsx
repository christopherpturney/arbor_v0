interface Review {
  name: string;
  location: string;
  text: string;
  style: string;
  designer: string;
}

const reviews: Review[] = [
  {
    name: "Sarah M.",
    location: "Chapel Hill, NC",
    text: "I was looking for a functional and inexpensive sideboard for my dining room. The designer helped me navigate through countless options and found the perfect piece that fit both my space and budget. Their expertise saved me hours of searching!",
    style: "Modern Farmhouse, Traditional, Coastal",
    designer: "Anne Wagoner"
  },
  {
    name: "Michael P.",
    location: "Durham, NC",
    text: "Needed help with paint colors for my living room built-ins. The designer not only suggested the perfect color palette but also provided detailed guidance on which portions to paint. The result is stunning!",
    style: "Traditional, Serene, Elegant",
    designer: "Blue Shutter Designs"
  },
  {
    name: "Emily R.",
    location: "Raleigh, NC",
    text: "I wanted to update my bedroom on a budget. The designer suggested creative furniture arrangements and affordable updates that completely transformed the space. Amazing what fresh eyes can do!",
    style: "Farmhouse, Boho, Clean designs",
    designer: "Julia Hall"
  },
  {
    name: "James K.",
    location: "Cary, NC",
    text: "The designer helped me select hardware for my powder bathroom that perfectly complements the wallpaper and vanity. Their attention to detail and understanding of my style was impressive.",
    style: "Modern, Industrial, Cozy",
    designer: "Steph Kenning"
  }
];

export default function Reviews() {
  return (
    <div className="min-h-screen bg-cream">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl mb-6">What Our Clients Say</h1>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
            Real stories from homeowners who transformed their spaces with expert design advice.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="bg-soft-white p-8 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-sage" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-charcoal/90 italic mb-4">"{review.text}"</p>
                </div>
                <div className="mt-auto">
                  <div className="border-t border-sage/20 pt-4">
                    <p className="font-medium text-antique-gold">{review.name}</p>
                    <p className="text-sm text-charcoal/70">{review.location}</p>
                    <p className="text-sm text-sage mt-2">Style: {review.style}</p>
                    <p className="text-sm text-sage">Designer: {review.designer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl mb-6">Ready to Transform Your Space?</h2>
          <p className="text-lg text-charcoal/80 mb-8 max-w-2xl mx-auto">
            Join our satisfied clients and get expert design advice tailored to your needs.
          </p>
          <button className="btn-olive text-lg">Get Started</button>
        </div>
      </main>
    </div>
  );
} 