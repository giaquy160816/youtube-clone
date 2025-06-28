'use client';
import { useParams, usePathname } from "next/navigation";
import { usePlaylist } from "@/lib/hooks/usePlaylist";
import { useEffect, useState } from "react";
import { Playlist } from "@/types/api";
import { VideoDetail, videoSmall } from "@/types/video";
import { getVideoDetail } from "@/features/videos/get-video-detail";
import VideoClient from "./Video";
import { RelatedVideoListPlaylist } from "@/components/video/relatedvideo";


export default function MePlaylistIdPage() {
    const { id } = useParams();
    const pathname = usePathname();
    const { getPlaylistDetail, deleteVideoFromPlaylist } = usePlaylist();
    const [video, setVideo] = useState<VideoDetail | null>(null);
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
    const [relatedVideos, setRelatedVideos] = useState<videoSmall[]>([]);
    
    // Hàm xử lý khi chuyển sang video khác
    const handleVideoChange = (videoId: string) => {
        setCurrentVideoId(videoId);
        window.location.hash = `#${videoId}`;
    };
    
    // Hàm xóa video khỏi playlist
    const handleDeleteVideo = async (videoId: number) => {
        if (!playlist) return;
        
        if (window.confirm('Bạn có chắc chắn muốn xóa video này khỏi playlist?')) {
            try {
                const updatedVideos = playlist.videos?.filter(v => v.id !== videoId) || [];
                setPlaylist({ ...playlist, videos: updatedVideos });
                console.log('playlistid', id, 'videoId', videoId);
                
                deleteVideoFromPlaylist(id as string, videoId.toString());
                
                // Nếu video bị xóa là video hiện tại, chuyển sang video đầu tiên
                if (currentVideoId === videoId.toString()) {
                    const firstVideo = updatedVideos[0];
                    if (firstVideo) {
                        handleVideoChange(firstVideo.id.toString());
                    }
                }
            } catch (error) {
                console.error('Lỗi khi xóa video:', error);
            }
        }
    };
    
    // Hàm di chuyển video trong playlist
    const handleMoveVideo = async (videoId: number, direction: 'up' | 'down') => {
        if (!playlist || !playlist.videos) return;
        
        const videos = [...playlist.videos];
        const currentIndex = videos.findIndex(v => v.id === videoId);
        
        if (currentIndex === -1) return;
        
        let newIndex: number;
        if (direction === 'up' && currentIndex > 0) {
            newIndex = currentIndex - 1;
        } else if (direction === 'down' && currentIndex < videos.length - 1) {
            newIndex = currentIndex + 1;
        } else {
            return;
        }
        
        // Hoán đổi vị trí
        [videos[currentIndex], videos[newIndex]] = [videos[newIndex], videos[currentIndex]];
        
        try {
            // TODO: Gọi API để cập nhật thứ tự video trong playlist
            console.log('Di chuyển video', videoId, direction, 'trong playlist', playlist.id);
            
            // Cập nhật UI
            setPlaylist({ ...playlist, videos });
        } catch (error) {
            console.error('Lỗi khi di chuyển video:', error);
        }
    };
    
    // Lấy thông tin playlist
    useEffect(() => {
        if (!id) return;
        
        const fetchPlaylist = async () => {
            try {
                const playlistData = await getPlaylistDetail(id as string);
                if (playlistData) {
                    setPlaylist(playlistData);
                    
                    // Lấy video đầu tiên nếu có
                    if (playlistData.videos && playlistData.videos.length > 0) {
                        const firstVideo = playlistData.videos[0];
                        setCurrentVideoId(firstVideo.id.toString());
                        
                        // Lấy thông tin chi tiết video đầu tiên
                        const videoDetail = await getVideoDetail(firstVideo.id.toString());
                        if (videoDetail && !('error' in videoDetail)) {
                            setVideo(videoDetail);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching playlist:', error);
            }
        };
        
        fetchPlaylist();
    }, [id]);
    
    // Lắng nghe hash trên URL để lấy videoId
    useEffect(() => {
        function handleHashChange() {
            const hash = window.location.hash.replace("#", "");
            console.log('hash', hash);
            // Kiểm tra xem videoId có tồn tại trong playlist không
            if (playlist && hash) {
                const videoExists = playlist.videos?.some(v => v.id.toString() === hash);
                if (videoExists) {
                    setCurrentVideoId(hash);
                } else {
                    // Nếu videoId không tồn tại, set về video đầu tiên
                    const firstVideoId = playlist.videos?.[0]?.id?.toString();
                    if (firstVideoId) {
                        window.location.hash = `#${firstVideoId}`;
                        setCurrentVideoId(firstVideoId);
                    }
                }
            } else {
                setCurrentVideoId(hash || null);
            }
        }
        
        // Lắng nghe cả hashchange và popstate events
        window.addEventListener("hashchange", handleHashChange);
        window.addEventListener("popstate", handleHashChange);
        
        // Lấy hash lần đầu khi load trang
        handleHashChange();
        console.log('playlist', playlist);
        
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
            window.removeEventListener("popstate", handleHashChange);
        };
    }, []);

    // Kiểm tra thay đổi hash mỗi 100ms để bắt các thay đổi không trigger events
    useEffect(() => {
        let lastHash = window.location.hash;
        
        const checkHashChange = () => {
            const currentHash = window.location.hash;
            if (currentHash !== lastHash) {
                console.log('Hash changed from', lastHash, 'to', currentHash);
                lastHash = currentHash;
                const hash = currentHash.replace("#", "");
                
                if (playlist && hash) {
                    const videoExists = playlist.videos?.some(v => v.id.toString() === hash);
                    if (videoExists) {
                        setCurrentVideoId(hash);
                    }
                }
            }
        };

        const interval = setInterval(checkHashChange, 100);
        
        return () => clearInterval(interval);
    }, []);

    // Lắng nghe thay đổi URL (bao gồm cả hash) mà không reload trang
    useEffect(() => {
        const handleUrlChange = () => {
            const hash = window.location.hash.replace("#", "");
            console.log('URL changed, new hash:', hash);
            if (playlist && hash) {
                const videoExists = playlist.videos?.some(v => v.id.toString() === hash);
                if (videoExists) {
                    setCurrentVideoId(hash);
                }
            }
        };

        // Sử dụng MutationObserver để lắng nghe thay đổi URL
        const observer = new MutationObserver(handleUrlChange);
        observer.observe(document, { subtree: true, childList: true });

        // Cũng lắng nghe sự kiện popstate
        window.addEventListener('popstate', handleUrlChange);

        return () => {
            observer.disconnect();
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, [pathname]);

    // Khi playlist hoặc currentVideoId thay đổi, lấy video tương ứng
    useEffect(() => {
        if (playlist) {
            let videoId: string | null = currentVideoId;
            if (!videoId) {
                videoId = playlist.videos?.[0]?.id?.toString() ?? null;
                // Nếu không có hash, set hash về video đầu tiên
                if (videoId) {
                    window.location.hash = `#${videoId}`;
                    setCurrentVideoId(videoId);
                }
            }
            if (videoId) {
                getVideoDetail(videoId).then((res) => {
                    if (res && !('error' in res)) {
                        setVideo(res);
                    } else {
                        setVideo(null);
                    }
                });
            }

            setRelatedVideos(playlist.videos || []);
        }
    }, [currentVideoId]);
    console.log('relatedVideos', relatedVideos);
    
    return (
        <div>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold">Video trong playlist: {playlist?.name}</h1>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-8 max-w-6xl mx-auto mt-10 px-2">
                    <div className="flex-1 min-w-0">
                        <VideoClient 
                            id={currentVideoId as string} 
                            video={video} 
                            videos={playlist?.videos || []}
                            currentVideoId={currentVideoId}
                            onVideoChange={handleVideoChange}
                        />
                    </div>
                    <aside className="w-full md:w-[320px] flex-shrink-0">
                        <div className="font-semibold text-lg mb-3">Danh sách</div>
                        <RelatedVideoListPlaylist 
                            videos={relatedVideos} 
                            playlistId={Number(id)}
                            onDeleteVideo={handleDeleteVideo}
                            onMoveVideo={handleMoveVideo}
                            currentVideoId={currentVideoId}
                        />
                    </aside>
                </div>
            </div>
        </div>
    )
    
    
}