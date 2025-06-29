'use client';
import { useParams } from "next/navigation";
import { usePlaylist } from "@/lib/hooks/usePlaylist";
import { useEffect, useState, useCallback } from "react";
import { Playlist } from "@/types/api";
import { VideoDetail, videoSmall } from "@/types/video";
import { getVideoDetail } from "@/features/videos/get-video-detail";
import VideoClient from "./Video";
import { RelatedVideoListPlaylist } from "@/components/video/relatedvideo";


export default function MePlaylistIdPage() {
    const { id } = useParams();
    const { getPlaylistDetail, deleteVideoFromPlaylist } = usePlaylist();
    const [video, setVideo] = useState<VideoDetail | null>(null);
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
    const [relatedVideos, setRelatedVideos] = useState<videoSmall[]>([]);
    
    // Hàm xử lý khi chuyển sang video khác
    const handleVideoChange = useCallback((videoId: string) => {
        setCurrentVideoId(videoId);
        // Cập nhật hash mà không reload trang
        if (window.location.hash !== `#${videoId}`) {
            window.history.pushState(null, '', `#${videoId}`);
        }
    }, []);
    
    // Hàm xóa video khỏi playlist
    const handleDeleteVideo = async (videoId: number) => {
        if (!playlist) return;
        
        if (window.confirm('Bạn có chắc chắn muốn xóa video này khỏi playlist?')) {
            try {
                const updatedVideos = playlist.videos?.filter(v => v.id !== videoId) || [];
                setPlaylist({ ...playlist, videos: updatedVideos });
                deleteVideoFromPlaylist(id as string, videoId.toString());
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
            setPlaylist({ ...playlist, videos });
        } catch (error) {
            console.error('Lỗi khi di chuyển video:', error);
        }
    };

    // Hàm xử lý hash change
    const handleHashChange = useCallback(() => {
        const hash = window.location.hash.replace("#", "");
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
        } else if (hash) {
            setCurrentVideoId(hash);
        }
    }, [playlist]);
    
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
                        const firstVideoId = firstVideo.id.toString();
                        
                        // Kiểm tra hash hiện tại
                        const currentHash = window.location.hash.replace("#", "");
                        if (currentHash && playlistData.videos.some(v => v.id.toString() === currentHash)) {
                            setCurrentVideoId(currentHash);
                        } else {
                            setCurrentVideoId(firstVideoId);
                            window.location.hash = `#${firstVideoId}`;
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching playlist:', error);
            }
        };
        
        fetchPlaylist();
    }, [id]);

    // Lắng nghe hash change events
    useEffect(() => {
        window.addEventListener("hashchange", handleHashChange);
        window.addEventListener("popstate", handleHashChange);
        
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
            window.removeEventListener("popstate", handleHashChange);
        };
    }, [handleHashChange]);

    // Khi currentVideoId thay đổi, lấy video tương ứng
    useEffect(() => {
        if (currentVideoId) {
            getVideoDetail(currentVideoId).then((res) => {
                if (res && !('error' in res)) {
                    setVideo(res);
                } else {
                    setVideo(null);
                }
            });
        }
    }, [currentVideoId]);

    // Cập nhật relatedVideos khi playlist thay đổi
    useEffect(() => {
        if (playlist) {
            setRelatedVideos(playlist.videos || []);
        }
    }, [playlist]);
    
    return (
        <div>
            <div className="lg:p-6 space-y-6">
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
                            onDeleteVideo={handleDeleteVideo}
                            onMoveVideo={handleMoveVideo}
                            onVideoChange={handleVideoChange}
                            currentVideoId={currentVideoId}
                        />
                    </aside>
                </div>
            </div>
        </div>
    )
}