import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "GitHub", icon: faGithub, url: "https://github.com/dmnkprince" },
    {
      name: "Twitter",
      icon: faTwitter,
      url: "https://twitter.com/your-handle",
    },
    {
      name: "LinkedIn",
      icon: faLinkedin,
      url: "https://linkedin.com/in/your-profile",
    },
  ];

  return (
    <footer className="flex items-center justify-between px-4 sm:px-6 h-12 bg-slate-900/90 border-t border-slate-800 z-50 backdrop-blur-md shrink-0 text-sm text-slate-400">
      {/* Left side — always visible */}
      <div>
        © {currentYear} <Link to="/" className="font-semibold text-slate-200 hover:text-emerald-400 transition-colors">FuelFinder</Link>. All rights reserved.
      </div>

      {/* Right side — visible on md+ */}
      <div className="hidden md:flex flex-col items-center gap-2 lg:flex-row">
        <div>Designed by Dmnk</div>
        <div className="flex items-center gap-2">
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
              <FontAwesomeIcon icon={link.icon} className="text-lg" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
