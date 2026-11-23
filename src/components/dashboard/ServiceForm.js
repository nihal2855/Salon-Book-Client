"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { apiRequest } from "@/lib/api";

export default function ServiceForm({ initialData = null }) {
    const router = useRouter();
    const isEditing = Boolean(initialData?._id);

    const [serviceName, setServiceName] = useState(initialData?.serviceName || "");
    const [category, setCategory] = useState(
        initialData?.category || SERVICE_CATEGORIES[0]
    );
    const [description, setDescription] = useState(initialData?.description || "");
    const [price, setPrice] = useState(initialData?.price || "");
    const [duration, setDuration] = useState(initialData?.duration || "");
    const [status, setStatus] = useState(initialData?.status || "active");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initialData?.image || "");
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const numericPrice = Number(price);
        const numericDuration = Number(duration);

        if (isNaN(numericPrice) || numericPrice <= 0) {
            toast.error("Price must be a positive number.");
            return;
        }

        if (isNaN(numericDuration) || numericDuration <= 0) {
            toast.error("Estimated duration must be a positive number.");
            return;
        }

        if (!isEditing && !imageFile) {
            toast.error("Please upload a service image.");
            return;
        }

        setSubmitting(true);
        try {
            let finalImageUrl = initialData?.image || "";

            if (imageFile) {
                finalImageUrl = await uploadImageToImgBB(imageFile);
            }

            const payload = {
                serviceName: serviceName.trim(),
                category,
                description: description.trim(),
                price: numericPrice,
                duration: numericDuration,
                image: finalImageUrl,
                status,
            };

            if (isEditing) {
                await apiRequest(`/services/${initialData._id}`, {
                    method: "PATCH",
                    authRequired: true,
                    body: JSON.stringify(payload),
                });
                toast.success("Service updated successfully!");
            } else {
                await apiRequest("/services", {
                    method: "POST",
                    authRequired: true,
                    body: JSON.stringify(payload),
                });
                toast.success("Service created successfully!");
            }

            router.push("/dashboard/admin/services");
            router.refresh();
        } catch (err) {
            toast.error(err.message || "Failed to save service.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <Link
                href="/dashboard/admin/services"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Manage Services
            </Link>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">
                    {isEditing ? "Update Salon Service" : "Add New Salon Service"}
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                    {isEditing
                        ? "Modify service details, pricing, availability, or upload a new photo."
                        : "Create a new salon service to display to customers."}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5"
            >
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Service Name *
                    </label>
                    <input
                        type="text"
                        required
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="Signature Balayage & Gloss"
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Service Category *
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                        >
                            {SERVICE_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Service Status *
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Price (USD) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="85.00"
                            className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Estimated Duration (minutes) *
                        </label>
                        <input
                            type="number"
                            min="1"
                            required
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="60"
                            className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Description *
                    </label>
                    <textarea
                        rows={4}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what is included in this salon service..."
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Service Image (File Upload) {isEditing ? "(Optional to replace)" : "*"}
                    </label>
                    <label className="mt-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-5 cursor-pointer hover:border-amber-500 transition">
                        <Upload className="w-6 h-6 text-amber-600 mb-1.5" />
                        <span className="text-sm font-medium text-stone-700">
                            {imageFile ? imageFile.name : "Click to choose an image file"}
                        </span>
                        <span className="text-xs text-stone-400 mt-0.5">
                            PNG, JPG, or WEBP uploaded via ImgBB
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    {previewUrl && (
                        <div className="mt-3">
                            <p className="text-xs text-stone-500 mb-1">Image Preview:</p>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-36 w-56 rounded-xl object-cover border border-stone-200"
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700 transition disabled:opacity-60"
                >
                    <Save className="w-4 h-4" />
                    {submitting
                        ? "Saving Service..."
                        : isEditing
                            ? "Update Service"
                            : "Create Service"}
                </button>
            </form>
        </div>
    );
}