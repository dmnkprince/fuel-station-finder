import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faWhatsapp,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "WhatsApp",
      icon: faWhatsapp,
      url: "https://wa.me/2348147656232",
    },
    { name: "GitHub", icon: faGithub, url: "https://github.com/dmnkprince" },
    {
      name: "LinkedIn",
      icon: faLinkedin,
      url: "https://www.linkedin.com/in/dominic-etim-36766238a",
    },
  ];

  return (
    <footer className="px-4 sm:px-6 py-2.5 sm:py-2 bg-slate-900/90 border-t border-slate-800 z-50 backdrop-blur-md shrink-0 text-sm text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
        {/* Left side — copyright */}
        <div className="text-center sm:text-left text-xs sm:text-sm">
          © {currentYear}{" "}
          <Link
            to="/"
            className="font-semibold text-slate-200 hover:text-emerald-400 transition-colors"
          >
            FuelFinder
          </Link>
          . All rights reserved.
        </div>

        {/* Center — About link */}
        <Link
          to="/about"
          className="text-xs font-semibold text-slate-400 hover:text-amber-500 transition-colors order-first sm:order-none"
        >
          About FuelFinder
        </Link>

        {/* Right side — designer credit + social links */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span>Designed by Dmnk</span>
          <div className="flex items-center gap-1.5">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors p-1"
                aria-label={link.name}
                title={link.name}
              >
                <FontAwesomeIcon
                  icon={link.icon}
                  className="text-base sm:text-lg"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
