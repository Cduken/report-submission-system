<?php

namespace App\Notifications;

use App\Models\ReportSubmission;
use Illuminate\Bus\Queueable;
// use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;


class ReportSubmissionSubmittedConfirmation extends Notification
{
    use Queueable;

    public function __construct(
        public ReportSubmission $reportSubmission
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [

            'type' => 'report_submission_confirmation',

            'title' => 'Report Successfully Submitted',

            'message' =>
                "Your report \"{$this->reportSubmission->report->title}\" has been submitted successfully and is awaiting review",

            'report_submission_id' =>
                $this->reportSubmission->id,

            'report_id' =>
                $this->reportSubmission->report_id,

            'program_id' =>
                $this->reportSubmission->report->program_id,

            'action_url' => route('field-officer.programs.reports.report-submissions', [
                'program' => $this->reportSubmission->report->program,
                'report' => $this->reportSubmission->report
            ]),
        ];
    }

    public function toArray(object $notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}