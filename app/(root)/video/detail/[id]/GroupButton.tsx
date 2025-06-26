import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsAuthenticated } from "@/lib/hooks/useIsAuthenticated";
import { ThumbsUp, Share2, BookmarkPlus, Download, Ellipsis } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { VideoDetail } from "@/types/video";

export default function GroupButton(
    {
        video,
        isLiked,
        handleLike,
        downloadFile,
        setPlaylistModalOpen,
    }: {
        video: VideoDetail;
        isLiked: boolean;
        handleLike: () => void;
        downloadFile: () => void;
        setPlaylistModalOpen: (open: boolean) => void;
    }
) {
    const isAuthenticated = useIsAuthenticated();
    
    return (
        <div className="mt-4 flex items-center gap-4 mb-4 ">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    if (!isAuthenticated) {
                        toast.warning('Vui lòng đăng nhập để thực hiện chức năng này!');
                        return;
                    }
                    handleLike();
                }}
                className={`flex items-center gap-1 border-primary border-1 border-solid hover:bg-primary hover:text-white ${isLiked ? 'bg-primary text-white' : ''}`}
            >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'text-white' : ''}`} />
                <span className={`text-xs font-bold ${isLiked ? 'text-white' : ''}`}>{video.like}</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    const link = window.location.href;
                    navigator.clipboard.writeText(link);
                    toast.success('Đã sao chép liên kết!');
                }}
                className="flex items-center gap-1 border-[blue] border-1 border-solid hover:bg-[blue]"
            >
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    if (!isAuthenticated) {
                        toast.warning('Vui lòng đăng nhập để sử dụng playlist!');
                        return;
                    }
                    setPlaylistModalOpen(true);
                }}
                className="flex items-center gap-1 border-[green] border-1 border-solid hover:bg-[green] sm:flex hidden"
            >
                <BookmarkPlus className="w-4 h-4" />
                <span>Lưu</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={downloadFile}
                className="flex items-center gap-1 border-[black] border-1 border-solid hover:bg-[black] sm:flex hidden"
            >
                <Download className="w-4 h-4" />
                <span>Tải xuống</span>
            </Button>
            <div className="sm:hidden block border-1 border-solid border-secondary rounded-md">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className=""
                        >
                            <Ellipsis className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => {
                                if (!isAuthenticated) {
                                    toast.warning('Vui lòng đăng nhập để sử dụng playlist!');
                                    return;
                                }
                                setPlaylistModalOpen(true);
                            }}
                            className="cursor-pointer justify-end"
                        >
                            <span>Lưu</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={downloadFile}
                            className="cursor-pointer justify-end"
                        >
                            <span>Tải xuống</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}