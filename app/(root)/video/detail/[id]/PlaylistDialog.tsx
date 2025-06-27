'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { usePlaylist } from '@/lib/hooks/usePlaylist';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { api } from '@/lib/api/fetcher';

interface PlaylistDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    videoId: string;
}

type PlaylistVideoResponse = {
    data: string[];
};

export default function PlaylistDialog({ open, onOpenChange, videoId }: PlaylistDialogProps) {
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [playlistsOfVideo, setPlaylistsOfVideo] = useState<string[]>([]);

    const {
        playlists,
        loading: playlistLoading,
        error: playlistError,
        fetchPlaylists,
        createPlaylist,
        addVideoToPlaylist,
        deleteVideoFromPlaylist,
        setError: setPlaylistError,
    } = usePlaylist();

    const fetchVideoInPlaylists = useCallback(async (videoId: string) => {
        try {
            const res = await api(
                API_ENDPOINTS.user.playlistVideo.playlist(videoId), 
                { method: 'GET' }) as PlaylistVideoResponse;
            setPlaylistsOfVideo(res?.data || []);
        } catch (error) {
            console.warn('Không kiểm tra được video trong playlist:', error);
        }
    }, []);

    // Fetch playlists and check which playlists contain this video
    useEffect(() => {
        if (open) {
            fetchPlaylists();
        }
    }, [open]);

    useEffect(() => {
        if (videoId && open) {
            fetchVideoInPlaylists(videoId);
        }
    }, [videoId, open]);

    const handleCreatePlaylist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) return;
        
        const ok = await createPlaylist(newPlaylistName.trim());
        if (ok) {
            toast.success('Tạo playlist thành công!');
            setNewPlaylistName('');
            await fetchPlaylists();
        } else {
            toast.error(playlistError || 'Tạo playlist thất bại!');
        }
    };

    const handlePlaylistToggle = async (playlistId: string, checked: boolean) => {
        // Optimistic update: cập nhật UI ngay lập tức
        if (checked) {
            setPlaylistsOfVideo(prev => [...prev, playlistId]);
        } else {
            setPlaylistsOfVideo(prev => prev.filter(id => id !== playlistId));
        }
        
        try {
            let ok: boolean;
            if (checked) {
                ok = await addVideoToPlaylist(playlistId, videoId);
                if (!ok) {
                    // Rollback nếu lỗi
                    setPlaylistsOfVideo(prev => prev.filter(id => id !== playlistId));
                    toast.error(playlistError || 'Thêm video thất bại!');
                } else {
                    toast.success('Đã thêm video vào playlist!');
                }
            } else {
                ok = await deleteVideoFromPlaylist(playlistId, videoId);
                if (!ok) {
                    // Rollback nếu lỗi
                    setPlaylistsOfVideo(prev => [...prev, playlistId]);
                    toast.error(playlistError || 'Xóa video thất bại!');
                } else {
                    toast.success('Đã xóa video khỏi playlist!');
                }
            }
        } catch (error) {
            // Rollback nếu có lỗi
            if (checked) {
                setPlaylistsOfVideo(prev => prev.filter(id => id !== playlistId));
            } else {
                setPlaylistsOfVideo(prev => [...prev, playlistId]);
            }
            toast.error('Có lỗi xảy ra!');
            console.log('error', error);
        }
    };

    // Check if a playlist contains the video
    const isVideoInPlaylist = (playlistId: string) => {
        return playlistsOfVideo.some(val => val === playlistId);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>Playlist của bạn</DialogTitle>
                    <DialogDescription>
                        Tạo mới hoặc thêm/xóa video khỏi playlist.
                    </DialogDescription>
                </DialogHeader>
                
                {/* Form tạo playlist mới */}
                <form onSubmit={handleCreatePlaylist} className="flex gap-2 mb-4">
                    <Input
                        value={newPlaylistName}
                        onChange={e => {
                            setNewPlaylistName(e.target.value);
                            setPlaylistError(null);
                        }}
                        placeholder="Tên playlist mới"
                        disabled={playlistLoading}
                    />
                    <Button type="submit" disabled={playlistLoading || !newPlaylistName.trim()}>
                        Tạo mới
                    </Button>
                </form>
                
                {/* Danh sách playlist đã có */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {playlistLoading ? (
                        <div>Đang tải...</div>
                    ) : playlists.length === 0 ? (
                        <div>Bạn chưa có playlist nào.</div>
                    ) : (
                        playlists.map((pl) => {
                            const isInPlaylist = isVideoInPlaylist(pl.id);
                            return (
                                <div key={pl.id} className="flex items-center justify-between border rounded px-3 py-2 gap-2">
                                    <span className="truncate max-w-[200px]">{pl.name}</span>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={isInPlaylist}
                                            onCheckedChange={(checked: boolean | 'indeterminate') => {
                                                if (typeof checked === 'boolean') {
                                                    handlePlaylistToggle(pl.id, checked);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                
                {playlistError && <div className="text-red-500 text-sm mt-2">{playlistError}</div>}
                
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 