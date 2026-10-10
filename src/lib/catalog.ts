import cover from "@/assets/cover-book.jpg";
import course1 from "@/assets/course-1.jpg";
import course2 from "@/assets/course-2.jpg";

export type Book = {
  slug: string;
  title: string;
  subtitle: string;
  format: "E-book" | "Audiobook";
  detail: string;
  price: number;
  cover: string;
  description: string;
  free?: boolean;
};

export type Course = {
  slug: string;
  title: string;
  tagline: string;
  image: string;
  price: number;
  level: string;
  hours: number;
  learn: string[];
  modules: { title: string; lessons: string[] }[];
  testimonial: { quote: string; name: string };
};

export const books: Book[] = [
  { slug: "the-chair-is-a-business", title: "The Chair Is a Business", subtitle: "Turn your station into a six-figure brand", format: "E-book", detail: "PDF & ePub · 184 pages", price: 29, cover, description: "A practical playbook for pricing, booking, retention and building a clientele that follows you anywhere." },
  { slug: "the-chair-is-a-business-audio", title: "The Chair Is a Business", subtitle: "Narrated edition", format: "Audiobook", detail: "MP3 · 4h 12m", price: 24, cover, description: "The full book, narrated — built for the commute and between cuts." },
  { slug: "booked-solid", title: "Booked Solid", subtitle: "Social media for barbers & stylists", format: "E-book", detail: "PDF · 96 pages", price: 19, cover, description: "Content systems, captions and DM scripts that fill your calendar without paid ads." },
  { slug: "free-chapter", title: "Chapter One, Free", subtitle: "Pricing your worth", format: "E-book", detail: "PDF · 18 pages", price: 0, cover, free: true, description: "Start here. The opening chapter on pricing — yours free." },
];

export const courses: Course[] = [
  {
    slug: "barber-business-masterclass", title: "Barber Business Masterclass", tagline: "From skilled cutter to shop owner.", image: course1, price: 249, level: "Intermediate", hours: 6,
    learn: ["Price services with confidence", "Build a rebooking system", "Hire and lead your first barber", "Read your numbers every week"],
    modules: [
      { title: "Foundations", lessons: ["Welcome to GSWAU", "Your chair, your brand", "Setting your price floor"] },
      { title: "Clientele", lessons: ["The first-visit experience", "Rebooking scripts", "Referral engines"] },
      { title: "Ownership", lessons: ["Booth rent vs. commission", "Hiring right", "Opening your shop"] },
    ],
    testimonial: { quote: "I raised my prices 30% in month one and kept every client.", name: "Marcus T., Atlanta" },
  },
  {
    slug: "stylist-brand-accelerator", title: "Stylist Brand Accelerator", tagline: "Build a name clients search for.", image: course2, price: 199, level: "All levels", hours: 4.5,
    learn: ["Define a signature service", "Shoot portfolio content on a phone", "Launch a waitlist", "Package premium offers"],
    modules: [
      { title: "Identity", lessons: ["Finding your signature", "Visual brand basics"] },
      { title: "Content", lessons: ["Phone photography", "Reels that book", "Posting cadence"] },
      { title: "Offers", lessons: ["Premium packages", "Launching a waitlist"] },
    ],
    testimonial: { quote: "My books filled for three months straight after the waitlist lesson.", name: "Jasmine R., Houston" },
  },
];

export const money = (n: number) => (n === 0 ? "Free" : `$${n}`);
