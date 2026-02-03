// components/timeliness-badge.tsx
export default function TimelinessBadge({
    timeliness,
}: {
    timeliness: string | null;
}) {
    if (!timeliness) return null;

    const styles =
        timeliness === 'early'
            ? 'bg-blue-100 text-blue-700 border-blue-300'
            : timeliness === 'on_time'
              ? 'bg-green-100 text-green-700 border-green-300'
              : 'bg-red-100 text-red-700 border-red-300';

    const label =
        timeliness === 'early'
            ? 'Early'
            : timeliness === 'on_time'
              ? 'On Time'
              : 'Late';

    return (
        <span
            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${styles}`}
        >
            {label}
        </span>
    );
}
