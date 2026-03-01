<?php

namespace App\Notifications;

use App\Models\Report;
use App\Models\ReportSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReportAdded extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Report $report)
    {
        //
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
            'type'       => 'new_report_submission_required',
            'title'      => 'New report submission required',
            'message'    => "A new report \"{$this->report->title}\" has been assigned to you. Please submit it before the deadline.",
            'report_id'  => $this->report->id,
            'report_title' => $this->report->title,
            'action_url' => route('field-officer.programs.reports.report-submissions', [
                'program' => $this->report->program,
                'report' => $this->report
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