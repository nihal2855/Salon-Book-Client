import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        if (session.user.isBlocked) {
            return NextResponse.json(
                { success: false, message: "Your account has been blocked." },
                { status: 403 }
            );
        }

        const token = jwt.sign(
            {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role || "customer",
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            success: true,
            token,
            user: session.user,
        });
    } catch (error) {
        console.error("JWT Bridge Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create session token" },
            { status: 500 }
        );
    }
}