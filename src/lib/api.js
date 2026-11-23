const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getAuthToken() {
    const res = await fetch("/api/token", { cache: "no-store" });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Authentication required");
    }
    const data = await res.json();
    return data.token;
}

export async function apiRequest(endpoint, options = {}) {
    const { authRequired = false, headers = {}, ...rest } = options;

    const requestHeaders = {
        "Content-Type": "application/json",
        ...headers,
    };

    if (authRequired) {
        const token = await getAuthToken();
        requestHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: requestHeaders,
        ...rest,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
}