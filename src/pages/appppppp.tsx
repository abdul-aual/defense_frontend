import { useState } from "react";
import "./App.css";
import sixtLogo from "./assets/partners/sixt.png";
import dollarLogo from "./assets/partners/dollar.gif";
import budgetLogo from "./assets/partners/budget.png";
import nationalLogo from "./assets/partners/national.png";
import enterpriseLogo from "./assets/partners/enterprise.png";
import avisLogo from "./assets/partners/avis.png";
import hertzLogo from "./assets/partners/hertz.png";
import aceLogo from "./assets/partners/ace.png";
import alamoLogo from "./assets/partners/alamo.png";
import europcarLogo from "./assets/partners/europcar.png";
import bestDealBanners from "./assets/banners/bestDealBanner.png";


type FAQItemProps = {
  question: string;
  answer: string;
};

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? "faq-open" : ""}`}>
      <button
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>

        <span className="faq-icon">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}

type Review = {
  id: number;
  name: string;
  initials: string;
  rating: number;
  date: string;
  comment: string;
};

const reviewData: Review[] = [
  {
    id: 1,
    name: "Tanvir Ahmed",
    initials: "TA",
    rating: 5,
    date: "September 10, 2026",
    comment:
      "The booking process was very easy and straightforward. I found a comfortable car at a reasonable price and the overall experience was excellent.",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    initials: "NJ",
    rating: 5,
    date: "September 7, 2026",
    comment:
      "Rentwise made my trip much easier. I liked being able to select the city, pick-up point and journey dates before choosing a vehicle.",
  },
  {
    id: 3,
    name: "Sakib Hasan",
    initials: "SH",
    rating: 4,
    date: "September 3, 2026",
    comment:
      "Good service and a simple interface. The vehicle was clean and the booking information was clear.",
  },
  {
    id: 4,
    name: "Farzana Rahman",
    initials: "FR",
    rating: 5,
    date: "August 28, 2026",
    comment:
      "I had a very smooth rental experience. The vehicle was available on time and the whole process was convenient.",
  },
  {
    id: 5,
    name: "Mehedi Hasan",
    initials: "MH",
    rating: 4,
    date: "August 22, 2026",
    comment:
      "The website is easy to navigate and finding vehicles was quick. I would definitely use Rentwise again.",
  },
  {
    id: 6,
    name: "Ayesha Akter",
    initials: "AA",
    rating: 5,
    date: "August 18, 2026",
    comment:
      "Excellent experience with Rentwise. The booking process was simple and the vehicle matched the information shown on the website.",
  },
];

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="review-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "star-filled" : "star-empty"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="review-item">
      <div className="review-avatar">
        {review.initials}
      </div>

      <div className="review-content">
        <h3 className="review-user-name">{review.name}</h3>

        <div className="review-meta">
          <ReviewStars rating={review.rating} />
          <span className="review-date">{review.date}</span>
        </div>

        <p className="review-text">{review.comment}</p>
      </div>
    </div>
  );
}



function App() {
  return (
    <div className="home-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Rentwise</div>

        <button className="login-btn">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="hero">

        {/* Search Card */}
        {/* <section className="search-card"> */}
        <section className="search-card" id="vehicle-search">

          <h2>Find Your Perfect Ride</h2>

          {/* Vehicle Type */}
          <div className="form-group">
            <label>Vehicle Type</label>
            <select>
              <option value="">Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="suv">SUV</option>
              <option value="hiace">HiAce</option>
            </select>
          </div>

          {/* City */}
          <div className="form-group">
            <label>City</label>
            <select>
              <option value="">Select City</option>
              <option value="dhaka">Dhaka</option>
              <option value="rangpur">Rangpur</option>
              <option value="chattogram">Chattogram</option>
            </select>
          </div>

          {/* Pickup Point */}
          <div className="form-group">
            <label>Pick-up Point</label>
            <input
              type="text"
              placeholder="Enter pick-up location"
            />
          </div>


          {/* Dates */}
          <div className="date-row">

            <div className="form-group">
              <label>Journey Start</label>
              <input type="date" />
            </div>

            <div className="form-group">
              <label>Journey End</label>
              <input type="date" />
            </div>

          </div>

          <button className="search-btn">
            Search Vehicles
          </button>

        </section>

        {/* Hero Content */}
        <section className="hero-content">

          <h1>
            Rent a Car Anywhere, Anytime!
          </h1>

          <p>
            Find the right vehicle for your journey
            at the best available price.
          </p>

          <div className="feature-bar">

            <div className="feature">
              <span>✓</span>
              Easy Booking
            </div>

            <div className="divider"></div>

            <div className="feature">
              <span>✓</span>
              Multiple Locations
            </div>

            <div className="divider"></div>

            <div className="feature">
              <span>✓</span>
              Reliable Service
            </div>

          </div>

        </section>

      </main>

      {/* Rental Partners */}
<section className="partners-section">

<div className="section-heading">
  <h5>Our Proud Rental Partners</h5>
</div>

<div className="partners-grid">

  <div className="partner-logo">
    <img src={sixtLogo} alt="SIXT" />
  </div>

  <div className="partner-logo">
    <img src={dollarLogo} alt="Dollar" />
  </div>

  <div className="partner-logo">
    <img src={budgetLogo} alt="Budget" />
  </div>

  <div className="partner-logo">
    <img src={nationalLogo} alt="National" />
  </div>

  <div className="partner-logo">
    <img src={enterpriseLogo} alt="enterprise" />
  </div>

  <div className="partner-logo">
    <img src={avisLogo} alt="avis" />
  </div>

  <div className="partner-logo">
    <img src={hertzLogo} alt="hertz" />
  </div>

  <div className="partner-logo">
    <img src={aceLogo} alt="ace" />
  </div>

  <div className="partner-logo">
    <img src={alamoLogo} alt="alamo" />
  </div>

  <div className="partner-logo">
    <img src={europcarLogo} alt="europcar" />
  </div>

</div>

</section>

{/* Why Choose Rentwise */}
<section className="why-rentwise-section">

  <div className="why-heading">
    <h2>Rental Cars for Every Journey</h2>

    <p>
      Everything you need to find, compare and book the right
      vehicle for your journey.
    </p>
  </div>

  <div className="benefits-grid">

    {/* Card 1 */}
    <div className="benefit-card">
      <div className="benefit-inner">

        <div className="benefit-icon icon-blue">
          <span>৳</span>
        </div>

        <h3>Great Rental Rates</h3>

        <p>
          Find affordable rental options and choose a vehicle
          that fits your journey and budget.
        </p>

      </div>
    </div>

    {/* Card 2 */}
    <div className="benefit-card">
      <div className="benefit-inner">

        <div className="benefit-icon icon-green">
          <span>✓</span>
        </div>

        <h3>Save Time</h3>

        <p>
          Search available vehicles and make your booking
          quickly in just a few simple steps.
        </p>

      </div>
    </div>

    {/* Card 3 */}
    <div className="benefit-card">
      <div className="benefit-inner">

        <div className="benefit-icon icon-purple">
          <span>🚗</span>
        </div>

        <h3>Wide Selection</h3>

        <p>
          Choose from cars, SUVs and HiAce vehicles available
          across multiple cities.
        </p>

      </div>
    </div>

    {/* Card 4 */}
    <div className="benefit-card">
      <div className="benefit-inner">

        <div className="benefit-icon icon-teal">
          <span>★</span>
        </div>

        <h3>Personalized Deals</h3>

        <p>
          Get rental options tailored to your preferred city,
          dates and vehicle type.
        </p>

      </div>
    </div>

  </div>

</section>

{/* Subscribe Section */}
<section className="subscribe-section">

  <div className="subscribe-banner">

    {/* Content */}
    <div className="subscribe-content">

      <h2>Be the first to receive offers.</h2>

      <p>
        Subscribe now to receive alerts about the latest deals,
        special offers, and promotions.
      </p>

      <form className="subscribe-form">
        
        <div className="subscribe-input-wrapper">

          <svg
            className="mail-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>

          <input
            type="email"
            placeholder="Enter email address"
            required
          />

        </div>

        <button type="submit" className="subscribe-btn">
          Subscribe
        </button>

      </form>

    </div>

    {/* Illustration */}
    <div className="subscribe-illustration">

      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >

        <defs>

          <linearGradient
            id="cardGrad1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          <linearGradient
            id="cardGrad2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          <linearGradient
            id="envelopeGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ff0066" />
            <stop offset="100%" stopColor="#d90368" />
          </linearGradient>

          <linearGradient
            id="badgeGrad1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ff0055" />
            <stop offset="100%" stopColor="#cc0044" />
          </linearGradient>

          <linearGradient
            id="badgeGrad2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <linearGradient
            id="purpleBar"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>

        </defs>

        {/* Soft Glow */}
        <path
          d="M150 120 C 200 60, 320 80, 400 30 L 400 300 L 150 300 Z"
          fill="rgba(255,255,255,0.08)"
        />

        {/* White Card */}
        <rect
          x="230"
          y="80"
          width="100"
          height="140"
          rx="12"
          fill="url(#cardGrad2)"
          transform="rotate(-15 280 150)"
          opacity="0.9"
        />

        <circle
          cx="295"
          cy="120"
          r="8"
          fill="#e2e8f0"
          transform="rotate(-15 280 150)"
        />

        {/* Purple Block */}
        <rect
          x="320"
          y="115"
          width="70"
          height="40"
          rx="8"
          fill="url(#purpleBar)"
          transform="rotate(-30 355 135)"
        />

        {/* Blue Card */}
        <rect
          x="230"
          y="150"
          width="110"
          height="130"
          rx="14"
          fill="url(#cardGrad1)"
          transform="rotate(-22 285 215)"
        />

        <circle
          cx="300"
          cy="200"
          r="10"
          fill="#ffffff"
          opacity="0.9"
          transform="rotate(-22 285 215)"
        />

        <path
          d="M230 250 Q270 210 320 230"
          stroke="#ffffff"
          strokeWidth="4"
          opacity="0.4"
          fill="none"
          transform="rotate(-22 285 215)"
        />

        {/* Pink Envelope */}
        <path
          d="M200 180 L360 270 L220 310 Z"
          fill="url(#envelopeGrad)"
        />

        {/* Discount Badge */}
        <g transform="translate(225,55) rotate(-12)">
          <rect
            width="45"
            height="45"
            rx="10"
            fill="url(#badgeGrad1)"
          />
          <text
            x="22.5"
            y="30"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="22"
            fill="white"
            textAnchor="middle"
          >
            %
          </text>
        </g>

        {/* Blue Badge */}
        <g transform="translate(330,40) rotate(18)">
          <rect
            width="42"
            height="42"
            rx="10"
            fill="url(#badgeGrad2)"
          />

          <text
            x="21"
            y="28"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="20"
            fill="white"
            textAnchor="middle"
          >
            %
          </text>
        </g>

        {/* Decorative Elements */}
        <ellipse
          cx="360"
          cy="205"
          rx="20"
          ry="8"
          fill="#60a5fa"
          opacity="0.8"
          transform="rotate(-40 360 205)"
        />

        <rect
          x="375"
          y="85"
          width="16"
          height="4"
          rx="2"
          fill="#38bdf8"
          transform="rotate(-20 375 85)"
        />

        <circle
          cx="310"
          cy="120"
          r="3"
          fill="#ff4081"
        />

      </svg>

    </div>
  </div>

</section>

{/* Download App Section */}
<section className="download-app-section">

  <div className="download-app-content">

    <div className="download-app-text">

      <span className="download-app-label">
        RENTWISE MOBILE APP
      </span>

      <h2>
        Download Rentwise App Now
      </h2>

      <p>
        Easily compare prices and book the best rental car
        with the Rentwise app. Download now and make your
        journey easier.
      </p>

      <div className="app-buttons">

        {/* Google Play */}
        <button className="app-store-btn">
          <div className="store-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.5 2.8c-.3.3-.5.8-.5 1.5v15.4c0 .7.2 1.2.5 1.5L13.4 12 3.5 2.8z" />
              <path d="M14.2 12.8l2.8 2.8 3.4-1.9c.6-.3.9-.7.9-1.1 0-.4-.3-.8-.9-1.1L17 9.6l-2.8 3.2z" />
              <path d="M13.6 12L4.7 3.7 15.2 9.6 13.6 12z" />
              <path d="M4.7 20.3l8.9-8.3 1.6 2.4-10.5 5.9z" />
            </svg>
          </div>

          <div className="store-text">
            <small>GET IT ON</small>
            <strong>Google Play</strong>
          </div>
        </button>

        {/* App Store */}
        <button className="app-store-btn">
          <div className="store-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.95-2.53 4.09zM12.03 7.25C11.88 5.02 13.69 3.18 15.82 3c.3 2.58-2.34 4.5-3.79 4.25z" />
            </svg>
          </div>

          <div className="store-text">
            <small>DOWNLOAD ON THE</small>
            <strong>App Store</strong>
          </div>
        </button>

      </div>

    </div>

    {/* Phone Illustration */}
    <div className="download-app-visual">

      <div className="phone-back"></div>

      <div className="phone">
        <div className="phone-notch"></div>

        <div className="phone-screen">

          <div className="phone-logo">
            Rentwise
          </div>

          <div className="phone-car"></div>

          <div className="phone-line"></div>
          <div className="phone-line short"></div>

          <div className="phone-book-btn">
            Book Now
          </div>

        </div>
      </div>

      <div className="floating-badge badge-one">
        ✓ Easy Booking
      </div>

      <div className="floating-badge badge-two">
        ★ Best Deals
      </div>

    </div>

  </div>

</section>


{/* Compare Rates Banner */}
<section className="compare-rates-section">

  <div
    className="compare-rates-banner"
    onClick={() => {
      document
        .getElementById("vehicle-search")
        ?.scrollIntoView({ behavior: "smooth" });
    }}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        document
          .getElementById("vehicle-search")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }}
  >

    {/* Yellow Curved Shape */}
    <svg
      className="compare-yellow-shape"
      viewBox="0 0 1000 250"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="compareYellowGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ffcc00" />
          <stop offset="60%" stopColor="#ff9900" />
          <stop offset="100%" stopColor="#ff8000" />
        </linearGradient>
      </defs>

      <path
        d="M 460 0 C 410 100, 480 200, 560 250 L 1000 250 L 1000 0 Z"
        fill="url(#compareYellowGradient)"
      />
    </svg>

    {/* Left Content */}
    <div className="compare-banner-left">

      <h3 className="compare-banner-subtitle">
        Compare Rates for the
      </h3>

      <h2 className="compare-banner-title">
        Best deals!
      </h2>

    </div>

    {/* Center Image */}
    <div className="compare-banner-center">

      <img
        src={bestDealBanners}
        alt="Rentwise vehicle rental"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

    </div>

    {/* Right Content */}
    <div className="compare-banner-right">

      <div className="compare-info-list">

        <div className="compare-info-item">
          <span>Get Up to 80% off</span>
          <span className="compare-check-icon">✓</span>
        </div>

        <div className="compare-info-item">
          <span>Free cancellation</span>
          <span className="compare-check-icon">✓</span>
        </div>

      </div>

      <div className="compare-book-btn">
        Book Now
      </div>

    </div>

    {/* Click hint */}
    <span className="compare-click-hint">
      Click to find your vehicle
    </span>

  </div>

</section>


{/* Frequently Asked Questions */}
<section className="faq-section">

  <div className="faq-heading">
    <span>FAQ</span>
    <h2>Frequently Asked Questions</h2>
    <p>
      Find answers to the most common questions about renting a vehicle
      with Rentwise.
    </p>
  </div>

  <div className="faq-container">

    {[
      {
        question: "How can I rent a vehicle through Rentwise?",
        answer:
          "Simply select your preferred vehicle type, city, pick-up point, pick-up time, and journey dates from the search section. Rentwise will show the available vehicles that match your requirements."
      },
      {
        question: "Which types of vehicles are available?",
        answer:
          "Rentwise currently offers Cars, SUVs, and HiAce vehicles. Vehicle availability may vary depending on the selected city and journey dates."
      },
      {
        question: "Which cities are supported by Rentwise?",
        answer:
          "Rentwise currently supports vehicle rentals in Dhaka, Rangpur, and Chattogram."
      },
      {
        question: "Can I choose my pick-up location?",
        answer:
          "Yes. You can enter your preferred pick-up point while searching for a vehicle. The pick-up point is used as part of your booking information."
      },
      {
        question: "Can I select the pick-up time and journey dates?",
        answer:
          "Yes. You can select your preferred pick-up time along with the journey start and end dates when searching for available vehicles."
      },
      {
        question: "How do I know if a vehicle is available?",
        answer:
          "After submitting your search criteria, Rentwise will display vehicles that are available for the selected city, vehicle type, and journey period."
      },
      {
        question: "Can I cancel my booking?",
        answer:
          "Yes. A booking can be cancelled according to the booking policy of Rentwise. Once a valid booking is cancelled, the vehicle can become available for another customer."
      },
      {
        question: "Is my booking information secure?",
        answer:
          "Rentwise uses authenticated access and secure server-side processing to protect customer accounts and booking information."
      }
    ].map((faq, index) => (
      <FAQItem
        key={index}
        question={faq.question}
        answer={faq.answer}
      />
    ))}

  </div>

</section>



{/* Customer Reviews */}
<section className="reviews-section">

  <div className="reviews-heading">
    <span>CUSTOMER REVIEWS</span>

    <h2>What Our Customers Say</h2>

    <p>
      Hear from customers who have used Rentwise for their journeys.
    </p>
  </div>

  <div className="reviews-container">

    {/* Rating Summary */}
    <div className="rating-summary-card">

      <div>
        <h3 className="rating-title">Customer Rating</h3>

        <div className="rating-main">

          <div className="rating-score">
            4.7<span>/5</span>
          </div>

          <div>
            <ReviewStars rating={5} />

            <p className="rating-count">
              Based on {reviewData.length} reviews
            </p>
          </div>

        </div>

        <div className="review-divider"></div>

        {/* Rating Bars */}
        <div className="rating-bars">

          <div className="rating-bar-row">
            <span>5</span>
            <div className="rating-bar">
              <div style={{ width: "82%" }}></div>
            </div>
          </div>

          <div className="rating-bar-row">
            <span>4</span>
            <div className="rating-bar">
              <div style={{ width: "13%" }}></div>
            </div>
          </div>

          <div className="rating-bar-row">
            <span>3</span>
            <div className="rating-bar">
              <div style={{ width: "4%" }}></div>
            </div>
          </div>

          <div className="rating-bar-row">
            <span>2</span>
            <div className="rating-bar">
              <div style={{ width: "1%" }}></div>
            </div>
          </div>

          <div className="rating-bar-row">
            <span>1</span>
            <div className="rating-bar">
              <div style={{ width: "0%" }}></div>
            </div>
          </div>

        </div>
      </div>

      <div className="rating-footer">
        <span>★</span>
        <p>Trusted by Rentwise customers</p>
      </div>

    </div>


    {/* Reviews List */}
    <div className="reviews-list-card">

      {reviewData.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
        />
      ))}

    </div>

  </div>

</section>

{/* Footer */}
<footer className="site-footer">
  <div className="footer-container">

    {/* Scroll to Top */}
    <button
      className="scroll-top-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title="Scroll to top"
      aria-label="Scroll to top"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>


    {/* Footer Navigation */}
    <nav className="footer-nav">

      <a href="#about">About Us</a>

      <span className="footer-nav-divider"></span>

      <a href="#privacy">Privacy Policy</a>

      <span className="footer-nav-divider"></span>

      <a href="#terms">Terms of Use</a>

      <span className="footer-nav-divider"></span>

      <a href="#cookies">Cookie Policy</a>

    </nav>


    {/* Middle Section */}
    <div className="footer-middle">

      {/* Social Links */}
      <div className="social-section">

        <span className="brand-name">
          Rentwise
        </span>

        <div className="social-pill">

          {/* Instagram */}
          <a
            href="#"
            className="social-icon"
            title="Instagram"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>


          {/* Facebook */}
          <a
            href="#"
            className="social-icon"
            title="Facebook"
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
            </svg>
          </a>


          {/* X / Twitter */}
          <a
            href="#"
            className="social-icon"
            title="X"
            aria-label="X"
          >
            <svg viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

        </div>
      </div>


      {/* App Buttons */}
      <div className="app-buttons">

        {/* Google Play */}
        <a href="#" className="app-btn">

          <svg viewBox="0 0 24 24">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734c0-.382.22-.729.609-.92zm11.597 11.6l2.306 2.306-11.82 6.824 9.514-9.13zm2.754-1.414l3.52 2.032c.697.402.697 1.054 0 1.456l-3.52 2.032-2.456-2.456 2.456-2.064zM5.694 3.256l11.818 6.824-2.306 2.306-9.512-9.13z" />
          </svg>

          <div className="app-btn-text">
            <span className="subtitle">
              Get it on
            </span>

            <span className="title">
              Google Play
            </span>
          </div>

        </a>


        {/* App Store */}
        <a href="#" className="app-btn">

          <svg viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.88c.67-.82 1.13-1.96.99-3.11-.97.04-2.17.65-2.86 1.46-.61.71-1.15 1.87-.99 2.99 1.08.08 2.2-.52 2.86-1.34z" />
          </svg>

          <div className="app-btn-text">
            <span className="subtitle">
              Available on the
            </span>

            <span className="title">
              App Store
            </span>
          </div>

        </a>

      </div>

    </div>


    {/* Divider */}
    <div className="footer-line"></div>


    {/* Bottom */}
    <div className="footer-bottom">

      <div className="footer-logo">
        Rentwise
      </div>

      <p className="copyright">
        © 2026 Rentwise | All Rights Reserved
      </p>

    </div>

  </div>
</footer>

    </div>
  );
}

export default App;