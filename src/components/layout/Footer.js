import Link from "next/link";

const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Browse services" },
    { href: "/sign-in", label: "Sign in" },
    { href: "/sign-up", label: "Create account" },
];

const socials = [
    { href: "https://instagram.com", label: "Instagram" },
    { href: "https://facebook.com", label: "Facebook" },
    { href: "https://twitter.com", label: "Twitter" },
];

const hours = [
    { days: "Monday to Friday", time: "9:00 AM – 8:00 PM" },
    { days: "Saturday and Sunday", time: "10:00 AM – 6:00 PM" },
];

const linkClass =
    "text-stone-400 underline-offset-4 transition hover:text-amber-500 hover:underline focus-visible:text-amber-500 focus-visible:underline focus-visible:outline-none";

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Top: statement + booking call to action */}
                <div className="flex flex-col gap-8 border-b border-stone-800 py-14 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-xl">
                        <Link
                            href="/"
                            className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
                        >
                            Salon<span className="text-amber-500">Book</span>
                        </Link>
                        <p className="mt-4 text-base leading-relaxed text-stone-400">
                            Modern haircuts, skin therapies, and spa treatments. Pick a
                            service and book your appointment online in seconds.
                        </p>
                    </div>
                    <Link
                        href="/services"
                        className="inline-flex w-fit items-center rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                    >
                        Book an appointment
                    </Link>
                </div>

                {/* Middle: information columns */}
                <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
                    <nav aria-label="Footer">
                        <h3 className="text-sm font-semibold text-white">Explore</h3>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            {quickLinks.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className={linkClass}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h3 className="text-sm font-semibold text-white">Visit us</h3>
                        <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-stone-400">
                            <p>420 Madison Avenue, Suite 300</p>
                            <p>New York, NY 10017</p>
                        </address>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white">Get in touch</h3>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            <li>
                                <a href="tel:+12125550194" className={linkClass}>
                                    +1 (212) 555-0194
                                </a>
                            </li>
                            <li>
                                <a href="mailto:hello@salonbook.com" className={linkClass}>
                                    hello@salonbook.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white">Opening hours</h3>
                        <dl className="mt-4 space-y-3 text-sm">
                            {hours.map((slot) => (
                                <div key={slot.days}>
                                    <dt className="font-medium text-stone-200">{slot.days}</dt>
                                    <dd className="text-stone-400">{slot.time}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                {/* Bottom: legal + socials */}
                <div className="flex flex-col items-start justify-between gap-4 border-t border-stone-800 py-6 text-xs text-stone-500 sm:flex-row sm:items-center">
                    <p>
                        &copy; {new Date().getFullYear()} SalonBook. All rights reserved.
                    </p>
                    <ul className="flex items-center gap-5">
                        {socials.map((social) => (
                            <li key={social.label}>
                                <a
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-stone-400 transition hover:text-amber-500 focus-visible:text-amber-500 focus-visible:outline-none"
                                >
                                    {social.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}