import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useVideoSearch } from "@/lib/hooks/useVideoSearch";

export default function SidebarSearch({ onClose }: { onClose?: () => void }) {
    const { searchVideos, loading } = useVideoSearch({
        onAfterSearch: onClose,
    });
    const [searchQuery, setSearchQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        searchVideos(searchQuery);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full border border-input bg-background rounded-full overflow-hidden relative"
        >
            <input
                type="text"
                placeholder="Tìm kiếm video..."
                className="flex-1 px-4 py-2 bg-transparent text-sm outline-none h-[30px] w-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center absolute right-0 w-[40px] h-full p-0"
                disabled={loading}
            >
                <FaSearch className="text-white text-sm" />
            </button>
        </form>
    );
}