import { useCallback, useState } from 'react';
import { api } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import type {
    Playlist,
    PlaylistListResponse,
    CreatePlaylistRequest,
    AddVideoToPlaylistRequest,
    PlaylistDetailResponse,
} from '@/types/api';

export function usePlaylist() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // KHÔNG dùng useCallback ở đây
    async function fetchPlaylists() {
        setLoading(true);
        setError(null);
        try {
            const res = await api(API_ENDPOINTS.user.playlist.list, { method: 'GET' }) as PlaylistListResponse;
            setPlaylists(res.data || []);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi khi lấy danh sách playlist';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    // Tạo playlist mới
    const createPlaylist = useCallback(async (name: string) => {
        setLoading(true);
        setError(null);
        try {
            await api(API_ENDPOINTS.user.playlist.create, { method: 'POST' }, { name } as CreatePlaylistRequest);
            await fetchPlaylists();
            return true;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tạo playlist';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Thêm video vào playlist
    const addVideoToPlaylist = useCallback(async (playlistId: string, videoId: string) => {
        // setLoading(true);
        setError(null);
        try {
            await api(
                API_ENDPOINTS.user.playlistVideo.add, 
                { method: 'POST' }, 
                { playlistId: Number(playlistId), videoId: Number(videoId) } as AddVideoToPlaylistRequest
            );
            return true;
        } catch {
            return false;
        }
    }, []);
    
    // Xoa video khỏi playlist
    const deleteVideoFromPlaylist = useCallback(async (playlistId: string, videoId: string) => {
        setError(null);
        try {
            await api(
                API_ENDPOINTS.user.playlistVideo.delete(playlistId, videoId), 
                { method: 'DELETE' }
            );
            return true;
        } catch {
            return false;
        }
    }, []);

    // Sửa tên playlist
    const updatePlaylist = async (id: string, name: string) => {
        setLoading(true);
        setError(null);
        try {
            await api(API_ENDPOINTS.user.playlist.update(id), { method: 'PATCH' }, { name });
            await fetchPlaylists();
            return true;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi khi sửa playlist';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Xoá playlist
    const deletePlaylist = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await api(API_ENDPOINTS.user.playlist.delete(id), { method: 'DELETE' });
            await fetchPlaylists();
            return true;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi khi xoá playlist';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getPlaylistDetail = async (id: string) => {
        const res = await api(API_ENDPOINTS.user.playlist.detail(id), { method: 'GET' }) as PlaylistDetailResponse;
        return res.data;
    }

    return {
        playlists,
        loading,
        error,
        fetchPlaylists,
        createPlaylist,
        addVideoToPlaylist,
        setError,
        updatePlaylist,
        deletePlaylist,
        getPlaylistDetail,
        deleteVideoFromPlaylist,
    };
} 