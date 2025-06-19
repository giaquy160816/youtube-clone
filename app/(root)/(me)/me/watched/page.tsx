// app/(root)/(me)/me/manage/page.tsx
'use client';

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

import { PATH } from "@/lib/constants/paths";
import { API_ENDPOINTS } from "@/lib/api/end-points";
import { api, apiGet } from "@/lib/api/fetcher";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getFullPath } from "@/lib/utils/get-full-path";
import { responseSuccess } from "@/types/api";

type VideoItem = {
    id: number;
    title: string;
    image: string;
};

type VideoResponse = {
    data: VideoItem[];
    total: number;
};

export default function MeWatchedPage() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [showPagination, setShowPagination] = useState(false);
    const limit = 20;

    const fetchVideos = useCallback(async () => {
        setLoading(true);
        const query = `?page=${page}&limit=${limit}`;
        const res = await apiGet<VideoResponse>(`${API_ENDPOINTS.user.video.watched}${query}`);

        if (!res || "error" in res) {
            setVideos([]);
            toast.error(res?.error || "Không thể tải danh sách video");
        } else {
            setVideos(Array.isArray(res.data) ? res.data : []);
            setTotal(res.total || 0);
            setShowPagination(res.total > limit);
        }

        setLoading(false);
    }, [page, limit]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleDelete = async (videoId: string) => {
        const confirmDelete = confirm('Bạn có chắc chắn muốn xoá video này?');
        if (!confirmDelete) return;

        try {
            const res = await api<responseSuccess>(API_ENDPOINTS.user.video.deleteWatched(videoId), { method: 'DELETE' });
            if (!res || "error" in res) {
                toast.error(res?.error || 'Xoá video thất bại');
                return;
            }
            console.log(res.message);
            
            toast.success(res.message || 'Xoá video thành công!');
            // Reload lại dữ liệu video sau khi xoá
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const hasNext = page * limit < total;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Quản lý Video đã xem</h1>
            </div>

            <div className="overflow-x-auto rounded-lg border dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700 text-sm">
                    <thead className="bg-zinc-100 dark:bg-zinc-800">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium uppercase w-[70px]">ID</th>
                            <th className="px-4 py-3 text-left font-medium uppercase">Tiêu đề</th>
                            <th className="px-4 py-3 text-left font-medium uppercase w-[150px]">Hình ảnh</th>
                            <th className="px-4 py-3 text-left font-medium uppercase w-[150px]">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                        {loading ? (
                            Array.from({ length: limit }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
                                    <td className="px-4 py-3"><Skeleton className="h-4 w-[120px]" /></td>
                                    <td className="px-4 py-3"><Skeleton className="h-[45px] w-[80px] rounded" /></td>
                                    <td className="px-4 py-3"><Skeleton className="h-4 w-[100px]" /></td>
                                </tr>
                            ))
                        ) : (
                            videos.map((video) => (
                                <tr key={video.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                                    <td className="px-4 py-2">{video.id}</td>
                                    <td className="px-4 py-2">{video.title}</td>
                                    <td className="px-4 py-2">
                                        <Image
                                            src={getFullPath(video.image)}
                                            alt={video.title}
                                            width={80}
                                            height={45}
                                            className="rounded object-cover border"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={PATH.VIDEO_DETAIL(video.id)}>
                                                        <Button size="icon" variant="secondary" className="w-8 h-8">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Xem Lại</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        className="w-8 h-8"
                                                        onClick={() => handleDelete(video.id.toString())}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Xoá</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {showPagination && (
                <div className="flex justify-center gap-4 mt-4">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                        Trang trước
                    </Button>
                    <Button variant="outline" size="sm" disabled={!hasNext} onClick={() => setPage(page + 1)}>
                        Trang tiếp
                    </Button>
                </div>
            )}
        </div>
    );
}