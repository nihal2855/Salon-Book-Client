"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Upload, Link as LinkIcon, Save, Shield } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/imgbb";

export default function ProfileForm() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [imageMode, setImageMode] = useState("url");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await apiRequest("/users/me", { authRequired: true });
                setProfile(data.user);
                setName(data.user.name || "");
                setPhone(data.user.phone || "");
                setImageUrl(data.user.image || "");
            } catch (err) {
                toast.error(err.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Name cannot be empty.");
            return;
        }

        setSaving(true);
        try {
            let finalImage = imageUrl.trim();

            if (imageMode === "upload" && imageFile) {
                finalImage = await uploadImageToImgBB(imageFile);
                setImageUrl(finalImage);
                setImageFile(null);
            }

            const data = await apiRequest("/users/me", {
                method: "PATCH",
                authRequired: true,
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim(),
                    image: finalImage,
                }),
            });

            // Sync Better Auth session cache so Navbar updates immediately
            await authClient.updateUser({
                name: name.trim(),
                image: finalImage,
            });

            setProfile(data.user);
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error(err.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">My Profile</h2>
                <p className="text-sm text-stone-500 mt-1">
                    Manage your personal details and profile photo.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
                {/* Profile Header Preview */}
                <div className="flex items-center gap-4 pb-6 mb-6 border-b border-stone-100">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="h-16 w-16 rounded-full object-cover border border-stone-200"
                        />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-600 text-xl font-bold text-white">
                            {name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-bold text-stone-900">{profile?.name}</h3>
                        <p className="text-sm text-stone-500">{profile?.email}</p>
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-700 capitalize">
                            <Shield className="w-3 h-3 text-amber-600" />
                            Role: {profile?.role}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Email Address (Read-Only)
                            </label>
                            <input
                                type="email"
                                disabled
                                value={profile?.email || ""}
                                className="w-full rounded-xl border border-stone-200 bg-stone-100 px-3.5 py-2.5 text-sm text-stone-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Account Role (Read-Only)
                            </label>
                            <input
                                type="text"
                                disabled
                                value={profile?.role || "customer"}
                                className="w-full rounded-xl border border-stone-200 bg-stone-100 px-3.5 py-2.5 text-sm text-stone-500 capitalize cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 234-5678"
                            className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-stone-700">
                                Profile Image
                            </label>
                            <div className="flex gap-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setImageMode("upload")}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${imageMode === "upload"
                                            ? "bg-amber-100 text-amber-800 font-semibold"
                                            : "text-stone-500 hover:text-stone-700"
                                        }`}
                                >
                                    <Upload className="w-3 h-3" /> Upload File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageMode("url")}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${imageMode === "url"
                                            ? "bg-amber-100 text-amber-800 font-semibold"
                                            : "text-stone-500 hover:text-stone-700"
                                        }`}
                                >
                                    <LinkIcon className="w-3 h-3" /> Image URL
                                </button>
                            </div>
                        </div>

                        {imageMode === "upload" ? (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="w-full text-sm text-stone-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 border border-stone-300 rounded-xl p-1"
                            />
                        ) : (
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-amber-600 focus:outline-none"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition disabled:opacity-60"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving Changes..." : "Save Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}