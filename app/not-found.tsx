import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 text-center">
                <h1 className="text-5xl font-bold mb-4">404</h1>
                <p className="text-xl mb-6">Trang bạn tìm kiếm không tồn tại hoặc đã bị xoá.</p>
                <Link
                    href="/"
                    className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                >
                    Quay về trang chủ
                </Link>
            </div>
        </>
    );
}