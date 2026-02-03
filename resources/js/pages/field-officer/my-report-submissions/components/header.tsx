export default function Header() {
    return (
        <>
            <div className="mb-3">
                <h1 className="text-lg font-semibold">
                    My All Submissions Report
                </h1>
            </div>
            {/* filters */}
            <div className="flex gap-3 border-b pb-3 text-sm">
                <p>Pending</p>
                <p>Rejected</p>
                <p>Acccepted</p>
            </div>
        </>
    );
}
