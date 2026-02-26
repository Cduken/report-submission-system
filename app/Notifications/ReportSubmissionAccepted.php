<?php

namespace App\Notifications;

use App\Models\ReportSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReportSubmissionAccepted extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public ReportSubmission $report_submission)
    {

    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {

        $channels = ['database'];

        // if ($notifiable->wantsEmailFor('report_submitted')) {
        //     $channels[] = 'mail';
        // }

        // if (config('broadcasting.default') !== 'null') {
        //     $channels[] = 'broadcast';
        // }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'       => 'report_submission_accepted',
            'title'      => 'Your Report Submission Has Accepted',
            'message'    => "{$this->report_submission->fieldOfficer->name} you report submission for \"{$this->report_submission->report->title}\" has been accepted",
            'report_submission_id'  => $this->report_submission->id,
            'report_title' => $this->report_submission->title,
            'action_url' => route('field-officer.programs.reports.report-submissions', [
                'program' => $this->report_submission->report->program,
                'report' => $this->report_submission->report
            ]),
            'icon'       => 'document',
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}