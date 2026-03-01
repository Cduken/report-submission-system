<?php

namespace App\Notifications;

use App\Models\ReportSubmission;
use Illuminate\Bus\Queueable;
// use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ReportSubmissionSubmittedForFocalPerson extends Notification
{
    use Queueable;

    public function __construct(
        public ReportSubmission $reportSubmission
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [

            'type' => 'report_submission_submitted',

            'title' => 'New Report Submission',

            'message' =>
                "{$this->reportSubmission->fieldOfficer->name} submitted a report for \"{$this->reportSubmission->report->title}\"",

            'report_submission_id' =>
                $this->reportSubmission->id,

            'report_id' =>
                $this->reportSubmission->report_id,

            'program_id' =>
                $this->reportSubmission->report->program_id,

            'submitted_by' =>
                $this->reportSubmission->fieldOfficer->name,

            'action_url' =>
                route('focal-person.programs.reports.report-submissions', [
                    'program' => $this->reportSubmission->report->program,
                    'report' => $this->reportSubmission->report,
                ]),

            'icon' => 'document',

            'priority' => 'high',

        ];
    }

    public function toArray(object $notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}
