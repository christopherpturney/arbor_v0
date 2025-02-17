import Image from "next/image";
import Link from "next/link";

const benefits = [
  {
    title: "Flexible Schedule",
    description: "Work when you want, where you want. Take on projects that fit your schedule and interests.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Steady Income",
    description: "Earn competitive rates for your expertise. Most projects range from $150-$300.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Build Your Portfolio",
    description: "Grow your client base and showcase your work to attract more opportunities.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    title: "Simple Process",
    description: "Our platform handles all the logistics so you can focus on what you do best - designing.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];

const requirements = [
  "Professional design experience",
  "Strong communication skills",
  "Portfolio of completed projects",
  "Passion for helping others create beautiful spaces"
];

export default function Designers() {
  return (
    <div className="min-h-screen bg-base-100">
      <main className="pt-20">
        {/* Header Section */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-8 text-5xl lg:text-6xl font-medium text-charcoal">
              Join Our Network of Expert Designers
            </h1>
            <p className="mb-12 text-xl text-charcoal/80 font-medium max-w-2xl mx-auto">
              Help homeowners create spaces they love while building your business on your own terms.
            </p>
            <Link 
              href="/apply" 
              className="btn btn-primary btn-lg"
            >
              Apply Now
            </Link>
          </div>
        </div>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-medium mb-4">Why Join Arbor Design Advice?</h2>
              <p className="text-lg text-charcoal/70">Join our community of expert designers and start earning today.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="card-body items-center text-center">
                    {benefit.icon}
                    <h3 className="card-title text-xl text-antique-gold">{benefit.title}</h3>
                    <p className="text-charcoal/80">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-base-200">
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full max-w-5xl mx-auto">
            <div className="stat">
              <div className="stat-figure text-sage">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="stat-title">Active Designers</div>
              <div className="stat-value">50+</div>
              <div className="stat-desc">Growing community</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-sage">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-title">Average Project</div>
              <div className="stat-value">$200</div>
              <div className="stat-desc">Per design consultation</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-sage">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="stat-title">Response Time</div>
              <div className="stat-value">48h</div>
              <div className="stat-desc">Average turnaround</div>
            </div>
          </div>
        </section>

        {/* Application Steps */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-medium mb-4">How It Works</h2>
              <p className="text-lg text-charcoal/70">Three simple steps to start earning</p>
            </div>
            <ul className="steps steps-vertical lg:steps-horizontal w-full">
              <li className="step step-primary">Submit Application</li>
              <li className="step step-primary">Portfolio Review</li>
              <li className="step step-primary">Start Earning</li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-base-200">
          <div className="max-w-3xl mx-auto text-center">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-3xl justify-center mb-4">Ready to Join?</h2>
                <p className="text-lg mb-8">Start earning by sharing your design expertise with clients who need your help.</p>
                <div className="card-actions justify-center">
                  <Link href="/apply" className="btn btn-primary btn-lg">Apply Now</Link>
                </div>
                <div className="divider">OR</div>
                <p className="text-sm text-charcoal/70">Want to learn more?</p>
                <Link href="/contact" className="link link-primary">Schedule a call with our team</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 