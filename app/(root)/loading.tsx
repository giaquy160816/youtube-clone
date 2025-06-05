// app/(route)/loading.tsx
export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 animate-fade-in">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Đang tải dữ liệu, vui lòng chờ...</p>
        </div>
    );
}
