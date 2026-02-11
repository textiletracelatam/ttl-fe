import Image from "next/image";
import { appConfig } from "../config";

export default function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-10 sm:py-12 lg:px-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo-black.svg"
            alt={appConfig.name}
            width={40}
            height={40}
            className="h-10 w-auto object-contain dark:hidden"
          />
          <Image
            src="/logo-white.svg"
            alt={appConfig.name}
            width={40}
            height={40}
            className="h-10 w-auto object-contain hidden dark:block"
          />
        </div>

        <nav
          aria-label="Footer"
          className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6"
        >
          {appConfig.footerLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <div className="mt-16 flex justify-center gap-x-10">
          {appConfig.socials.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="size-6" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-sm/6 text-neutral-600 dark:text-neutral-400">
          &copy; {new Date().getFullYear()} {appConfig.name}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
