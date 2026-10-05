export type Project = {
  number: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  year: string;

  // Case Study
  overview: string;
  role: string;
  features: string[];
  challenges: string[];
  outcome: string;

  // Project
  nda?: boolean;
  url?: string;
  gallery?: string[];
};

export const projects: Project[] = [
  {
    number: "01",

    title: "BombayDesk",

    slug: "bombaydesk",

    category: "Restaurant Technology",

    description:
      "A connected restaurant operations platform covering POS, tables, orders, kitchen workflows, KOT and real-time operations.",

    image: "/images/projects/bombaydesk.jpg",

    technologies: [
      "Next.js",
      "Supabase",
      "WebSocket",
    ],

    year: "2026",

    // Client project — covered by NDA.
    nda: true,

    gallery: [
      "/images/projects/bombaydesk/pos.jpg",
      "/images/projects/bombaydesk/orders.jpg",
      "/images/projects/bombaydesk/tables.jpg",
      "/images/projects/bombaydesk/kitchen.jpg",
    ],

    overview:
      "BombayDesk is a restaurant technology platform designed to connect front-of-house and kitchen operations through one unified system. The platform covers POS operations, table management, order management, kitchen workflows and Kitchen Order Tickets while keeping operational data synchronized in real time.",

    role:
      "Product architecture, UI/UX design, frontend development, backend integration and real-time system development.",

    features: [
      "Point of Sale",
      "Table Management",
      "Order Management",
      "Kitchen Management",
      "Kitchen Order Tickets (KOT)",
      "Real-Time Order Updates",
      "Branch-Based Operations",
      "Menu Management",
      "Order Status Management",
      "Restaurant Workflow Management",
    ],

    challenges: [
      "Keeping POS and kitchen operations synchronized in real time.",
      "Managing restaurant branches and their operational data.",
      "Handling live order status changes across multiple interfaces.",
      "Creating a workflow connecting POS, kitchen and printing systems.",
      "Making restaurant operations simple enough for day-to-day staff usage.",
    ],

    outcome:
      "Built a connected restaurant operations platform that brings POS, tables, orders and kitchen workflows together through real-time communication.",
  },

  {
    number: "02",

    title: "Education ERP",

    slug: "education-erp",

    category: "ERP / SaaS",

    description:
      "A centralized education management platform connecting admissions, student operations, fees, staff, accounts, reports and institutional workflows.",

    image: "/images/projects/education-erp.jpg",

    technologies: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "REST API",
    ],

    year: "2026",

    url: "https://edu-erp-ecru.vercel.app/",

    gallery: [
      "/images/projects/education-erp/dashboard.png",
      "/images/projects/education-erp/admission.png",
      "/images/projects/education-erp/staff.png",
      "/images/projects/education-erp/fees.png",
    ],

    overview:
      "An education-focused ERP platform designed to centralize institutional operations inside a single system. The platform brings together admissions, student management, fee operations, staff management, attendance, accounts, reports and administrative workflows through a structured dashboard experience.",

    role:
      "Product architecture, UI/UX design, frontend development, backend integration, data architecture and ERP workflow development.",

    features: [
      "Dashboard & Analytics",
      "Admission Management",
      "Student Management",
      "Admission Status Tracking",
      "Fee & Deposit Management",
      "Staff Management",
      "Staff Attendance",
      "Teaching Subject Management",
      "Accounts & Statements",
      "Purchase Order Management",
      "Inventory Management",
      "Reports & Analytics",
      "Role-Based Workflows",
      "Centralized Data Management",
    ],

    challenges: [
      "Bringing multiple institutional workflows into one structured platform.",
      "Designing a scalable information architecture across admissions, fees, staff and operations.",
      "Keeping complex administrative workflows simple enough for daily users.",
      "Creating consistent data flows across different ERP modules.",
      "Building a centralized system that can scale as institutional operations grow.",
    ],

    outcome:
      "Built a centralized ERP experience that connects core educational and administrative operations into one structured platform, reducing fragmented workflows and creating a unified operational interface.",
  },
];