'use client';
import { useEffect, useState, useRef } from "react";
import { usePlaylist } from "@/lib/hooks/usePlaylist";
import { Playlist } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

const PlaylistItem = ({
    playlist,
    updatePlaylist,
    deletePlaylist,
    fetchPlaylists,
}: {
    playlist: Playlist,
    updatePlaylist: (id: string, name: string) => Promise<boolean>,
    deletePlaylist: (id: string) => Promise<boolean>,
    fetchPlaylists: () => Promise<void>,
}) => {
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [playlistName, setPlaylistName] = useState(playlist.name);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEdit = () => {
        setEditId(playlist.id);
        setEditName(playlist.name);
        
    }

    const handleSave = async () => {
        if (editName.trim() && editId) {
            const ok = await updatePlaylist(editId, editName.trim());
            if (ok) {
                setEditId(null);
                setPlaylistName(editName);
                fetchPlaylists();
            }
        }
    };

    const handleCancel = () => {
        setEditId(null);
    }

    const handleDelete = async () => {
        if (window.confirm('Bạn chắc chắn muốn xoá playlist này?')) {
            const ok = await deletePlaylist(playlist.id);
            if (ok) {
                fetchPlaylists();
            }
        }
    };

    useEffect(() => {
        if (editId === playlist.id && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editId, playlist.id]);

    return <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
        <td className="px-4 py-2">{playlist.id}</td>
        <td className="px-4 py-2">
            {editId === playlist.id ? (
                <Input
                    ref={inputRef}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSave();
                        }
                    }}
                />
            ) : (
                <Link href={`/me/playlist/${playlist.id}`} className="hover:text-blue-500 hover:underline">
                    <span className="truncate max-w-[100px]">{playlist.name}</span>
                </Link>
            )}
        </td>
        <td className="px-4 py-2">
            {editId === playlist.id ? (
                <div className="flex items-center gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={handleSave}>Lưu</Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>Huỷ</Button>
                </div>
            ) : (
                <div className="flex items-center gap-2 justify-end">
                    <Link href={`/me/playlist/${playlist.id}`} className="">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Xem</TooltipContent>
                        </Tooltip>
                    </Link>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={handleEdit}>
                                <Edit className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Sửa</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={handleDelete}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Xóa</TooltipContent>
                    </Tooltip>
                </div>
            )}
        </td>
    </tr>;
}

export default function MePlaylistPage() {
    const { playlists, loading, error, fetchPlaylists, updatePlaylist, deletePlaylist } = usePlaylist();
    useEffect(() => {
        fetchPlaylists();
    }, []);
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Quản lý Playlist</h1>
            </div>

            <div className="overflow-x-auto rounded-lg border dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700 text-sm">
                    <thead className="bg-zinc-100 dark:bg-zinc-800">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium uppercase w-[70px]">ID</th>
                            <th className="px-4 py-3 text-left font-medium uppercase">Tiêu đề</th>
                            <th className="px-4 py-3 text-left font-medium uppercase w-[150px]">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                        {playlists.map((playlist) => (
                            <PlaylistItem
                                key={playlist.id}
                                playlist={playlist}
                                updatePlaylist={updatePlaylist}
                                deletePlaylist={deletePlaylist}
                                fetchPlaylists={fetchPlaylists}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}