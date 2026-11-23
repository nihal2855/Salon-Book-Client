"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";
import ServiceForm from "@/components/dashboard/ServiceForm";

export default function EditServicePage() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchService() {
            try {
                const data = await apiRequest(`/services/${id}`);
                setService(data.service);
            } catch (err) {
                toast.error(err.message || "Failed to load service.");
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchService();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
            </div>
        );
    }

    if (!service) {
        return <p className="text-sm text-red-600">Service not found.</p>;
    }

    return <ServiceForm initialData={service} />;
}