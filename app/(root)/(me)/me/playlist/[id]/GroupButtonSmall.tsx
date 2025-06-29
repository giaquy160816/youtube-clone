import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsAuthenticated } from "@/lib/hooks/useIsAuthenticated";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";
import { ThumbsUp, Share2, BookmarkPlus, Download, Ellipsis } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { VideoDetail } from "@/types/video";

export default function GroupButtonSmall(
    {
        video,
        isLiked,
        handleLike,
        downloadFile,
    }: {
        video: VideoDetail;
        isLiked: boolean;
        handleLike: () => void;
        downloadFile: () => void;
    }
) {
    const isAuthenticated = useIsAuthenticated();
    const { redirectToLogin } = useAuthRedirect();
    
    return (
        <div className="mt-4 flex items-center gap-4 mb-4 ">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    if (!isAuthenticated) {
                        redirectToLogin('Vui lòng đăng nhập để thực hiện chức năng này!');
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
                onClick={downloadFile}
                className="flex items-center gap-1 border-[black] border-1 border-solid hover:bg-[black] sm:flex hidden"
            >
                <Download className="w-4 h-4" />
                <span className="md:block hidden">Tải xuống</span>
            </Button>
        </div>
    )
}