'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserInfo = {
    email: string;
    fullname: string;
    avatar?: string;
};

export function UserMenu() {
    const router = useRouter();
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user_info");
            if (raw) {
                const parsed = JSON.parse(raw);
                setUser(parsed);
            }
        } catch (err) {
            console.error("❌ Failed to parse user_info:", err);
        }
    }, []);

    if (!user) {
        return (
            <Avatar onClick={() => router.push("/login")} className="cursor-pointer">
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage src={user.avatar || ""} alt={user.fullname} />
                    <AvatarFallback>{user.fullname.charAt(0)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                    {user.fullname || user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>Hồ sơ</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>Cài đặt</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                    localStorage.clear();
                    router.push("/login");
                }}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserMenu;