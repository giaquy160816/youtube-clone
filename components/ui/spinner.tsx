// components/ui/spinner.tsx
export function Spinner() {
    return (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu, vui lòng chờ…</p>
        </div>
    );
}

// components/ui/skeleton-table.tsx
type Props = { rows?: number };

export function SkeletonTable({ rows = 6 }: Props) {
    return (
        <div className="overflow-x-auto rounded-lg border dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <table className="min-w-full divide-y divide-transparent text-sm">
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i} className="animate-pulse divide-x divide-transparent">
                            {Array.from({ length: 4 }).map((_, j) => (
                                <td key={j} className="px-4 py-4">
                                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}