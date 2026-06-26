"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProductId } from "../hooks/useProductId";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  CloseButton,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const subpages = [
  { title: "Supply Chain", route: "supply-chain" },
  { title: "Composition", route: "composition" },
  { title: "Environmental Impact", route: "environmental-impact" },
  { title: "Social Impact", route: "social-impact" },
  { title: "Material Innovation", route: "material-innovation" },
  { title: "Garment Care", route: "garment-care" },
  { title: "Post Consumption Plan", route: "post-consumption-plan" },
  { title: "Certifications", route: "certifications" },
];

export default function Navigation() {
  const translation = useTranslations("nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const id = useProductId();

  function withId(path: string) {
    return `${path}?id=${encodeURIComponent(id)}`;
  }

  function navigate(path: string) {
    router.push(withId(path), { scroll: false });
    setOpen(false);
  }

  const homePN = `/${locale}`;
  const pdPN = `/${locale}/product-details`;

  return (
    <header className="sticky top-0 z-40 bg-background">
      <nav className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <button onClick={() => navigate(homePN)} className="cursor-pointer">
              <Image
                src="/logo_text-black.svg"
                alt="Logo"
                width={120}
                height={32}
                className="h-8 w-auto dark:hidden"
              />
              <Image
                src="/logo_text-white.svg"
                alt="Logo"
                width={120}
                height={32}
                className="h-8 w-auto hidden dark:block"
              />
            </button>
          </div>

          {/* Desktop nav (lg+) */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {/* Home link */}
            <button
              onClick={() => navigate(homePN)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                pathname === homePN
                  ? "text-primary-700 dark:text-primary-300"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              }`}
            >
              {translation("home")}
            </button>

            {/* Product Details flyout */}
            <Popover className="relative">
              <PopoverButton
                className={`group inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer focus:outline-none ${
                  pathname.startsWith(pdPN)
                    ? "text-primary-700 dark:text-primary-300"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                }`}
              >
                {translation("details")}
                <ChevronDownIcon className="size-4 text-neutral-400 group-data-open:rotate-180 transition-transform" />
              </PopoverButton>

              <PopoverPanel
                focus
                transition
                className="absolute left-1/2 z-50 mt-2 w-64 -translate-x-1/2 rounded-xl bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-neutral-900/10 dark:ring-neutral-700 transition data-closed:opacity-0 data-closed:scale-95 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
              >
                <div className="p-2">
                  {/* Link to main product details page */}
                  <CloseButton
                    as="button"
                    onClick={() => navigate(pdPN)}
                    className="block w-full text-left rounded-lg px-3 py-2 text-sm font-semibold text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    Overview
                  </CloseButton>

                  <div className="my-1 h-px bg-neutral-200 dark:bg-neutral-700" />

                  {/* Subpages */}
                  {subpages.map((sub) => {
                    const subPN = `${pdPN}/${sub.route}`;
                    const isActive = pathname === subPN;
                    return (
                      <CloseButton
                        as="button"
                        key={sub.route}
                        onClick={() => navigate(subPN)}
                        className={`block w-full text-left rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer ${
                          isActive
                            ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                        }`}
                      >
                        {sub.title}
                      </CloseButton>
                    );
                  })}
                  <div className="my-1 h-px bg-neutral-200 dark:bg-neutral-700" />

                  {/* Logo + version */}
                  <div className="flex flex-col items-center gap-1 py-2">
                    <Image
                      src="/logo-black.svg"
                      alt="Company logo"
                      width={32}
                      height={32}
                      className="size-8 object-contain dark:hidden"
                    />
                    <Image
                      src="/logo-white.svg"
                      alt="Company logo"
                      width={32}
                      height={32}
                      className="size-8 object-contain hidden dark:block"
                    />
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                      v{process.env.NEXT_PUBLIC_APP_VERSION}
                    </span>
                  </div>
                </div>
              </PopoverPanel>
            </Popover>

            {/* What's a DPP? */}
            <a
              href="https://textiletracelatam.com/blog/que-es-pasaporte-digital-producto/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
            >
              {translation("dpp")}
            </a>
          </div>

          {/* Mobile actions (< lg) */}
          <div className="flex items-center gap-2 shrink-0 lg:hidden">
            <a
              href="https://textiletracelatam.com/blog/que-es-pasaporte-digital-producto/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100 hover:text-primary-800 dark:text-primary-100 dark:hover:bg-primary-600 dark:hover:text-white"
            >
              What&apos;s a DPP?
            </a>
            <button
              onClick={() => setOpen(true)}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-primary-600 hover:bg-primary-100 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-primary-500 dark:text-primary-100 dark:hover:bg-primary-600 dark:hover:text-white cursor-pointer"
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu dialog */}
      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 z-20 bg-neutral-900/25 duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
        />

        <DialogPanel
          transition
          className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition duration-150 data-closed:scale-95 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
        >
          <div className="divide-y divide-neutral-200 rounded-lg bg-white shadow-lg outline outline-neutral-900/5 dark:divide-neutral-700 dark:bg-neutral-800 dark:shadow-none dark:-outline-offset-1 dark:outline-neutral-700">
            <div className="pt-3 pb-2">
              <div className="flex items-center justify-between px-4">
                <Image
                  src="/logo_text-black.svg"
                  alt="Logo"
                  width={120}
                  height={32}
                  className="h-8 w-auto dark:hidden"
                />
                <Image
                  src="/logo_text-white.svg"
                  alt="Logo"
                  width={120}
                  height={32}
                  className="h-8 w-auto hidden dark:block"
                />
                <div className="-mr-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-500 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary-500 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:hover:text-white dark:focus-visible:outline-primary-400 cursor-pointer"
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {/* Home */}
                <button
                  onClick={() => navigate(homePN)}
                  className={`block w-full text-left rounded-md px-3 py-2 text-base font-medium cursor-pointer ${
                    pathname === homePN
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
                  }`}
                >
                  {translation("home")}
                </button>

                {/* Product Details — collapsible */}
                <Disclosure defaultOpen={pathname.startsWith(pdPN)}>
                  <DisclosureButton
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium cursor-pointer ${
                      pathname.startsWith(pdPN)
                        ? "text-primary-700 dark:text-primary-300"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
                    }`}
                  >
                    {translation("details")}
                    <ChevronDownIcon className="size-5 text-neutral-400 transition-transform ui-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="space-y-1 pl-3">
                    <button
                      onClick={() => navigate(pdPN)}
                      className={`block w-full text-left rounded-md px-3 py-2 text-sm font-semibold cursor-pointer ${
                        pathname === pdPN
                          ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                      }`}
                    >
                      Overview
                    </button>
                    {subpages.map((sub) => {
                      const subPN = `${pdPN}/${sub.route}`;
                      const isActive = pathname === subPN;
                      return (
                        <button
                          key={sub.route}
                          onClick={() => navigate(subPN)}
                          className={`block w-full text-left rounded-md px-3 py-2 text-sm cursor-pointer ${
                            isActive
                              ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                          }`}
                        >
                          {sub.title}
                        </button>
                      );
                    })}
                  </DisclosurePanel>
                </Disclosure>
              </div>
            </div>

            {/* Logo + version */}
            <div className="flex flex-col items-center gap-2 px-4 py-4">
              <Image
                src="/logo-black.svg"
                alt="Company logo"
                width={48}
                height={48}
                className="size-12 object-contain dark:hidden"
              />
              <Image
                src="/logo-white.svg"
                alt="Company logo"
                width={48}
                height={48}
                className="size-12 object-contain hidden dark:block"
              />
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                v{process.env.NEXT_PUBLIC_APP_VERSION}
              </span>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
