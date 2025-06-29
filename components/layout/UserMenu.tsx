// components/layout/UserMenu.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { PATH } from "@/lib/constants/paths";
import { useUser } from "@/lib/context/UserContext";
import getFullPath from "@/lib/utils/get-full-path";

export function UserMenu() {
    const { user } = useUser();

    const handleLoginClick = () => {
        // Lưu URL hiện tại để redirect về sau khi login
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('return_url', window.location.href);
        }
    };

    if (!user) {
        return (
            <Link href={PATH.LOGIN} onClick={handleLoginClick}>
                <Avatar className="cursor-pointer">
                    <AvatarFallback>?</AvatarFallback>
                </Avatar>
            </Link>
        );
    }
    const avatarUrl = getFullPath(user.avatar || '');
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage src={avatarUrl} alt={user.fullname} />
                    <AvatarFallback>{user.fullname.charAt(0)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                    {user.fullname || user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer hover:text-white">
                    <Link href={PATH.ME.PROFILE}>
                        Cập nhật thông tin
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:text-white">
                    <Link href={PATH.ME.VIDEO_MANAGE}>
                        Video của tôi
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:text-white">
                    <Link href={PATH.ME.VIDEO_POST}>
                        Đăng video
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer hover:text-white">
                    <Link href={PATH.ME.LOGOUT}>
                        Đăng xuất
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserMenu;