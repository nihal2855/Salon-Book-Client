
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export default function ServiceCard({ service }) {
    return (
        <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
            <div className="relative h-52 w-full overflow-hidden bg-stone-100">
                <img
                    src={
                        service.image ||
                        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={service.serviceName}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-amber-800 shadow-sm">
                    {service.category}
                </span>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-stone-900 line-clamp-1">
                        {service.serviceName}
                    </h3>
                    <span className="text-lg font-bold text-amber-600 shrink-0">
                        ${Number(service.price).toFixed(2)}
                    </span>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-stone-500">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{service.duration} mins</span>
                </div>

                <p className="mt-3 text-sm text-stone-600 line-clamp-2 flex-1">
                    {service.description}
                </p>

                <Link
                    href={`/services/${service._id}`}
                    className="mt-5 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition"
                >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}