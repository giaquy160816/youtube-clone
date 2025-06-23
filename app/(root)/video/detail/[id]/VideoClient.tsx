'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import type { VideoDetail, VideoResponse } from '@/types/video';
import getFullPath from '@/lib/utils/get-full-path';
import ReactPlayer from 'react-player/lazy';
import { ThumbsUp, Share2, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsAuthenticated } from '@/lib/hooks/useIsAuthenticated';
import { api } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { RelatedVideoItemOnPlayer } from '@/components/video/item-video';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { usePlaylist } from '@/lib/hooks/usePlaylist';

export default function VideoClient({
    id,
    video,
    relatedVideos,
}: {
    id: string;
    video: VideoDetail | null;
    relatedVideos: VideoResponse[] | null;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const rawAuth = useIsAuthenticated();
    const [isLiked, setIsLiked] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const router = useRouter();
    const playerRef = useRef<ReactPlayer>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const description = video ? video.description : null;
    const [expanded, setExpanded] = useState(false);
    const length = 100;
    const words = description ? description.trim().split(/\s+/) : null;
    const isLong = words ? words.length > length : false;
    const shortText = words ? words.slice(0, length).join(' ') : null;
    const displayText = expanded || !isLong
        ? description
        : shortText;
    const handleVideoEnd = () => {
        setShowOverlay(true);
        setIsPlaying(false);
    };
    const handlePlay = () => {
        // If user presses play again after video ends, hide overlay
        setShowOverlay(false);
        setIsPlaying(true);
    };
    useEffect(() => {
        if (rawAuth) setIsAuthenticated(true);
    }, [rawAuth]);

    useEffect(() => {
        if (!video || !rawAuth) return;

        const checkLike = async () => {
            try {
                const res = await api(API_ENDPOINTS.user.video.checkLike(id), { method: 'GET' }) as { isLiked: boolean };
                setIsLiked(res?.isLiked || false);
            } catch (err) {
                console.warn('Không kiểm tra được like:', err);
            }
        };

        const checkWatched = async () => {
            try {
                const resCKW = await api(API_ENDPOINTS.user.video.checkWatched(id), { method: 'GET' }) as { isWatched: boolean };
                if (resCKW?.isWatched === false) {
                    sendWatched();
                }
            } catch (err) {
                console.warn('Không kiểm tra được watched:', err);
            }
        };

        const sendWatched = async () => {
            try {
                await api(API_ENDPOINTS.user.video.watched, { method: 'POST' }, { id: parseInt(id) });
            } catch (err) {
                console.warn('Không gửi được watched:', err);
            }
        };
        checkWatched();
        checkLike();
    }, [id, video, rawAuth]);

    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [addToId, setAddToId] = useState<string | null>(null);
    const [editPlaylistId, setEditPlaylistId] = useState<string | null>(null);
    const {
        playlists,
        loading: playlistLoading,
        error: playlistError,
        fetchPlaylists,
        createPlaylist,
        addVideoToPlaylist,
        setError: setPlaylistError,
        updatePlaylist,
        deletePlaylist,
    } = usePlaylist();

    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Fetch playlists when modal opens
    useEffect(() => {
        if (playlistModalOpen) {
            fetchPlaylists();
        }
    }, [playlistModalOpen]);

    if (!video) return <div className="p-4 text-red-500">Không tìm thấy video</div>;
    return (
        <div className="w-full">
            <div className="w-full max-w-4xl mx-auto">
                <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-lg">
                    <ReactPlayer
                        ref={playerRef}
                        // key={retryKey}
                        url={getFullPath(video.path)}
                        width="100%"
                        height="100%"
                        playing={isPlaying}
                        controls
                        muted
                        className="absolute top-0 left-0"
                        // onError={(e) => {
                        //     console.warn('Retrying video load...');
                        //     console.error('Video load error:', e);
                        //     setTimeout(() => setRetryKey((k) => k + 1), 500);
                        // }}
                        onEnded={handleVideoEnd}
                        onPlay={handlePlay}
                    />
                    {showOverlay && relatedVideos && (
                        <div className="absolute inset-0 bg-[#000000]/80 flex flex-col h-full w-full text-white">
                            <div className="flex-1 w-full flex items-center justify-center p-4">
                                <div className="grid grid-cols-2 flex-1 grid-rows-2 gap-4 w-full h-full max-w-2xl">
                                    {relatedVideos.slice(0, 4).map((video) => (
                                        <div key={video.id} className="flex flex-col h-full min-h-0 bg-transparent">
                                            <RelatedVideoItemOnPlayer video={video} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 w-full items-center justify-center my-2 h-[30px] min-h-[30px] max-h-[30px]">
                                <Button variant="secondary" onClick={() => router.back()} className="h-[30px] px-4">Quay về</Button>
                                <Button variant="default" onClick={() => {
                                    setShowOverlay(false);
                                    setIsPlaying(true);
                                    if (playerRef.current) playerRef.current.seekTo(0, 'seconds');
                                }} className="h-[30px] px-4">Xem lại</Button>
                                <Button variant="outline" className="bg-muted text-primary h-[30px] px-4"
                                    disabled={!relatedVideos || relatedVideos.length === 0}
                                    onClick={() => {
                                        if (!relatedVideos || relatedVideos.length === 0) return;
                                        const randomIdx = Math.floor(Math.random() * relatedVideos.length);
                                        const randomVideo = relatedVideos[randomIdx];
                                        if (randomVideo && randomVideo.id) router.push(`/video/detail/${randomVideo.id}`);
                                    }}>
                                    Video ngẫu nhiên
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div className="relative w-[50px] h-[50px] me-4">
                            <Image
                                src={getFullPath(video.avatar)}
                                alt={video.author}
                                width={400}
                                height={400}
                                className="rounded-full object-cover w-full h-full"
                            />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                            <div className="text-sm text-muted-foreground mb-2">{video.author}</div>
                            <div className="text-sm text-muted-foreground mb-2">
                                {video.views?.toLocaleString()} lượt xem • {video.createdAt}
                            </div>

                            <div className="mt-4 flex items-center gap-4 mb-4">
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
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>{isLiked ? 'Đã thích' : 'Thích'}</span>
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
                                    className="flex items-center gap-1 border-[green] border-1 border-solid hover:bg-[green]"
                                >
                                    <span>Thêm vào playlist</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* Description Block */}
                    <div className="p-4 rounded-lg mb-3 w-full border border-border">
                        <div className="font-semibold mb-2 text-base">Mô tả</div>
                        <p className="whitespace-pre-wrap text-sm text-foreground">
                            {displayText}
                            {isLong && !expanded && (
                                <span
                                    className="text-blue-600 hover:underline cursor-pointer" style={{ paddingLeft: '10px' }}
                                    onClick={() => setExpanded(true)}
                                >
                                    ...Xem thêm
                                </span>
                            )}
                            {isLong && expanded && (
                                <p
                                    className="text-blue-600 hover:underline cursor-pointer" style={{ paddingTop: '20px' }}
                                    onClick={() => setExpanded(false)}
                                >
                                    Thu gọn
                                </p>
                            )}
                        </p>
                    </div>
                    {/* Tags Block */}
                    {video.tags && video.tags.length > 0 && (
                        <div className="rounded-lg">
                            <div className="font-semibold mb-2 text-base">Tags</div>
                            <div className="flex flex-wrap gap-2">
                                {video.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium shadow-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Dialog/modal playlist */}
            <Dialog open={playlistModalOpen} onOpenChange={setPlaylistModalOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Playlist của bạn</DialogTitle>
                        <DialogDescription>
                            Tạo mới hoặc thêm video vào playlist đã có.
                        </DialogDescription>
                    </DialogHeader>
                    {/* Form tạo playlist mới */}
                    <form
                        onSubmit={async (e) => {
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
                        }}
                        className="flex gap-2 mb-4"
                    >
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
                            playlists.map((pl) => (
                                <div key={pl.id} className="flex items-center justify-between border rounded px-3 py-2 gap-2">
                                    {editId === pl.id ? (
                                        <>
                                            <Input
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                className="max-w-[120px]"
                                                disabled={playlistLoading}
                                            />
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={playlistLoading || !editName.trim()}
                                                    onClick={async () => {
                                                        const ok = await updatePlaylist(pl.id, editName.trim());
                                                        if (ok) {
                                                            toast.success('Đã sửa tên playlist!');
                                                            setEditId(null);
                                                            setEditName('');
                                                        } else {
                                                            toast.error(playlistError || 'Sửa tên thất bại!');
                                                        }
                                                    }}
                                                >
                                                    Lưu
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setEditId(null);
                                                        setEditName('');
                                                    }}
                                                >
                                                    Huỷ
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="truncate max-w-[100px]">{pl.name}</span>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={playlistLoading || addToId === pl.id}
                                                    onClick={async () => {
                                                        setAddToId(pl.id);
                                                        const ok = await addVideoToPlaylist(pl.id, id);
                                                        setAddToId(null);
                                                        if (ok) {
                                                            toast.success('Đã thêm video vào playlist!');
                                                        } else {
                                                            toast.error(playlistError || 'Thêm video thất bại!');
                                                        }
                                                    }}
                                                >
                                                    {addToId === pl.id ? 'Đang thêm...' : '+'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditId(pl.id);
                                                        setEditName(pl.name);
                                                    }}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={async () => {
                                                        if (window.confirm('Bạn chắc chắn muốn xoá playlist này?')) {
                                                            setDeleteId(pl.id);
                                                            const ok = await deletePlaylist(pl.id);
                                                            setDeleteId(null);
                                                            if (ok) {
                                                                toast.success('Đã xoá playlist!');
                                                            } else {
                                                                toast.error(playlistError || 'Xoá playlist thất bại!');
                                                            }
                                                        }
                                                    }}
                                                    disabled={playlistLoading || deleteId === pl.id}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
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
        </div>
    );

    async function handleLike() {
        try {
            if (isLiked) {
                await api(API_ENDPOINTS.user.video.dislike(id), { method: 'DELETE' });
                setIsLiked(false);
                toast.error('Bạn đã bỏ thích video này!');
                return;
            }
            await api(API_ENDPOINTS.user.video.like, { method: 'POST' }, { video_id: parseInt(id) });
            setIsLiked(true);
            toast.success('Bạn đã thích video này!');
        } catch (error) {
            console.error('Error liking video:', error);
        }
    }
}