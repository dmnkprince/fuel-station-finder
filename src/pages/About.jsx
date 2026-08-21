import { Link } from "react-router-dom";
import { Map, CheckCircle2, Coins, Car, ShieldCheck, Fuel, MapPin, Lock, Settings, Shield, User, Sparkles, Wrench } from 'lucide-react';

const FEATURES = [
  {
    icon: Map,
    title: "Live Map",
    desc: "Interactive map showing every fuel station near you with real-time status indicators.",
  },
  {
    icon: CheckCircle2,
    title: "Official Updates",
    desc: "Station Managers post verified prices and availability marked with an Official badge you can trust.",
  },
  {
    icon: Coins,
    title: "Price Reports",
    desc: "See current prices per litre from official station updates and community reports before driving.",
  },
  {
    icon: Car,
    title: "Queue Tracking",
    desc: "See queue lengths at each station, skip the long lines and save hours of waiting.",
  },
  {
    icon: ShieldCheck,
    title: "Verification & Flagging",
    desc: "Verify accurate reports with an upvote, or flag inaccurate ones to protect fellow drivers.",
  },
  {
    icon: Fuel,
    title: "Multi-Fuel Support",
    desc: "Track Petrol (PMS), Diesel (AGO), Kerosene (DPK), and Cooking Gas (LPG) availability.",
  },
  {
    icon: MapPin,
    title: "Distance & Directions",
    desc: "See how far each station is from your GPS location, with one-tap Google Maps navigation.",
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    desc: "Admins register stations, Station Managers post official updates, and users verify data accuracy.",
  },
];

const TECH_STACK = [
  { name: "React", desc: "Frontend UI library" },
  { name: "Leaflet", desc: "Interactive mapping" },
  { name: "Node.js", desc: "Backend server" },
  { name: "PostgreSQL", desc: "Database" },
  { name: "JWT", desc: "Authentication" },
  { name: "Tailwind CSS", desc: "Styling" },
  { name: "Vite", desc: "Build tooling" },
];

export default function About() {
  return (
    <div
      id="about-page"
      className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8 sm:gap-12"
    >
      {/* Back Link */}
      <Link
        to="/"
        id="about-back-to-map"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-500 transition-all w-fit"
      >
        ← Back to Map
      </Link>

      {/* Hero Section */}
      <section className="text-center flex flex-col items-center gap-4">
        <Fuel className="w-12 h-12 sm:w-14 sm:h-14 text-amber-500" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-100 leading-tight">
          About{" "}
          <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            FuelFinder NG
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed font-medium text-justify ">
          FuelFinder NG is a{" "}
          <strong className="text-slate-200">
            verified fuel station tracking platform
          </strong>{" "}
          built for Nigeria. In a country where fuel scarcity is a recurring
          challenge, we combine
          <strong className="text-emerald-400">
            {" "}
            official station manager updates
          </strong>{" "}
          with{" "}
          <strong className="text-amber-400">community verification</strong> to
          provide trustworthy, real-time information about fuel availability,
          prices, and queue lengths so you never have to drive blindly from
          station to station again. This project, FuelFinder NG demonstrates
          full-stack web development skills applied to solving a real-world
          Nigerian challenge.
        </p>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-8 flex flex-col gap-5 backdrop-blur-sm">
        <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-500" /> How It Works
        </h2>
        <div className="flex flex-col gap-4 text-sm text-slate-400 leading-relaxed font-medium">
          <div className="flex gap-3 items-start">
            <span className="text-amber-500 font-black text-base shrink-0 mt-0.5">
              1.
            </span>
            <p>
              <strong className="text-slate-200">
                Admin registers stations
              </strong>{" "}
              on the platform and assigns a
              <strong className="text-emerald-400"> Station Manager</strong> to
              each one.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-amber-500 font-black text-base shrink-0 mt-0.5">
              2.
            </span>
            <p>
              <strong className="text-slate-200">
                Station Managers log in
              </strong>{" "}
              and post{" "}
              <strong className="text-emerald-400">official updates</strong>{" "}
              fuel type, current price per litre, availability status, and queue
              length. These updates display an{" "}
              <span className="text-emerald-400 font-bold"> Official</span>{" "}
              badge with a checkmark beside it.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-amber-500 font-black text-base shrink-0 mt-0.5">
              3.
            </span>
            <p>
              <strong className="text-slate-200">
                Community users verify or flag
              </strong>{" "}
              updates. Upvote reports you can confirm to build trust, or flag
              inaccurate updates to warn fellow drivers.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-amber-500 font-black text-base shrink-0 mt-0.5">
              4.
            </span>
            <p>
              <strong className="text-slate-200">Everyone benefits.</strong> The
              map shows color-coded stations{" "}
              <span className="text-emerald-400 font-bold">green</span> for in
              stock, <span className="text-amber-400 font-bold">yellow</span>{" "}
              for long queues,{" "}
              <span className="text-rose-400 font-bold">red</span> for out of
              stock.
            </p>
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-8 flex flex-col gap-5 backdrop-blur-sm">
        <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-500" /> User Roles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <Shield className="w-6 h-6 text-amber-500" />
            <h3 className="text-sm font-black text-slate-100">Admin</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Registers new fuel stations on the platform and assigns Station
              Managers to each one.
            </p>
          </div>
          <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-4 flex flex-col gap-2">
            <Fuel className="w-6 h-6 text-amber-500" />
            <h3 className="text-sm font-black text-slate-100">
              Station Manager
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Logs in to post official price, availability, and queue updates.
              Updates are badged as{" "}
              <span className="text-emerald-400 font-bold inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" /> Official</span>.
            </p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <User className="w-6 h-6 text-amber-500" />
            <h3 className="text-sm font-black text-slate-100">
              Community User
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Views the live map, verifies (upvotes) accurate reports, and flags
              inaccurate information.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="flex flex-col gap-5">
        <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" /> Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {FEATURES.map((f) => {
            const FeatureIcon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-slate-900/60 border text-justify border-slate-800 rounded-xl p-4 flex flex-col gap-2 hover:border-amber-500/40 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <FeatureIcon className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
                  <h3 className="text-sm font-black text-slate-100">{f.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-8 flex flex-col gap-5 backdrop-blur-sm">
        <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-500" /> Built With
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {TECH_STACK.map((t) => (
            <span
              key={t.name}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:border-amber-500/40 transition-all"
              title={t.desc}
            >
              {t.desc} :
              <span className="text-slate-600 text-[10px] font-medium hidden sm:inline">
                {" "}
                {t.name}
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* 3MTT Section
      <section className="bg-linear-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-5 sm:p-8 flex flex-col gap-3 text-center items-center">
        <GraduationCap className="w-8 h-8 text-amber-500" />
        <h2 className="text-lg sm:text-xl font-black text-slate-100">3MTT Project</h2>
        <p className="text-sm text-slate-400 max-w-xl leading-relaxed font-medium">
          This project was built as part of Nigeria's{' '}
          <strong className="text-amber-500">3 Million Technical Talent (3MTT)</strong> initiative 
          a federal government programme aimed at building a critical mass of technical
          talent across the country. 
        </p>
      </section> */}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-4">
        <Link
          to="/"
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm px-6 py-3 rounded-lg transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          <Map className="w-4 h-4" /> Open the Map
        </Link>
        <a
          href="https://github.com/dmnkprince"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm px-6 py-3 rounded-lg border border-slate-700 transition-all"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  );
}
