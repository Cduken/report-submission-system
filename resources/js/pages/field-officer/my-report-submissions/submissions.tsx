// submissions.tsx
import { ReportSubmission } from '@/types';
import { usePage } from '@inertiajs/react';
import { SubmissionCard } from './components/submission-card';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Search, Filter, ListFilter, Grid3x3, FileText, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Submissions() {
    const { mySubmissions } = usePage<{ mySubmissions: ReportSubmission[] }>()
        .props;

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    // Filter submissions
    const filteredSubmissions = mySubmissions.filter(submission => {
        const matchesSearch = !search ||
            submission.id.toLowerCase().includes(search.toLowerCase()) ||
            (submission.report?.title && submission.report.title.toLowerCase().includes(search.toLowerCase())) ||
            (submission.report?.program?.name && submission.report.program.name.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Get status counts based on actual data
    const getStatusCount = (status: string) => {
        return mySubmissions.filter(s => status === 'all' ? true : s.status === status).length;
    };

    return (
        <div className="space-y-6">
            {/* Filters and Controls */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>My Submissions</CardTitle>
                            <CardDescription>
                                {filteredSubmissions.length} of {mySubmissions.length} submissions
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex border rounded-md">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    className="rounded-r-none"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid3x3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    className="rounded-l-none"
                                    onClick={() => setViewMode('list')}
                                >
                                    <ListFilter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by ID, report title, or program..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status ({getStatusCount('all')})
                                    </SelectItem>
                                    <SelectItem value="draft">
                                        Draft ({getStatusCount('draft')})
                                    </SelectItem>
                                    <SelectItem value="submitted">
                                        Submitted ({getStatusCount('submitted')})
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending Review ({getStatusCount('pending')})
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        Approved ({getStatusCount('approved')})
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejected ({getStatusCount('rejected')})
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button asChild>
                                <a href="/field-officer/programs">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Submission
                                </a>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submissions List */}
            {filteredSubmissions.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                {mySubmissions.length === 0 ? 'No submissions yet' : 'No matching submissions'}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {mySubmissions.length === 0
                                    ? 'Start by browsing programs and submitting your first report.'
                                    : 'Try adjusting your search or filter criteria.'}
                            </p>
                            <Button asChild>
                                <a href="/field-officer/programs">
                                    Browse Programs
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className={viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                    : 'space-y-4'
                }>
                    {filteredSubmissions.map((submission) => (
                        <SubmissionCard
                            key={submission.id}
                            submission={submission}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
