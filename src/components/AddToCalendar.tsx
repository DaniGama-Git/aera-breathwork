/**
 * AddToCalendar — Dialog component for scheduling a breathwork session
 * to Google Calendar, Microsoft Outlook, or .ics download.
 */

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AddToCalendarProps {
  sessionTitle: string;
  sessionSubtitle: string;
  sessionCategory: string;
  durationMinutes: number;
}

/** Format a Date + time string to a Google Calendar datetime string (YYYYMMDDTHHmmss) */
function toCalendarDatetime(date: Date, time: string): string {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function getEndDatetime(date: Date, time: string, durationMinutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m + durationMinutes, 0, 0);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function openExternalCalendarLink(url: string): boolean {
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (!popup) return false;
  popup.opener = null;
  return true;
}

function buildGoogleCalendarUrl(
  title: string,
  description: string,
  date: Date,
  time: string,
  durationMinutes: number,
): string {
  const start = toCalendarDatetime(date, time);
  const end = getEndDatetime(date, time, durationMinutes);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    dates: `${start}/${end}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildOutlookUrl(
  title: string,
  description: string,
  date: Date,
  time: string,
  durationMinutes: number,
): string {
  const [h, m] = time.split(":").map(Number);
  const start = new Date(date);
  start.setHours(h, m, 0, 0);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + durationMinutes);

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    body: description,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    reminderminutesbeforestart: "5",
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function generateICS(
  title: string,
  description: string,
  sessionLink: string,
  date: Date,
  time: string,
  durationMinutes: number,
): string {
  const start = toCalendarDatetime(date, time);
  const end = getEndDatetime(date, time, durationMinutes);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aera//Breathwork//EN",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `URL:${escapeIcsText(sessionLink)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT5M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Session starting in 5 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(
  title: string,
  description: string,
  sessionLink: string,
  date: Date,
  time: string,
  durationMinutes: number,
) {
  const ics = generateICS(title, description, sessionLink, date, time, durationMinutes);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

const AddToCalendar = ({
  sessionTitle,
  sessionSubtitle,
  sessionCategory,
  durationMinutes,
}: AddToCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("09:00");
  const [open, setOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const sessionLink = `https://aera-breathwork.lovable.app${window.location.pathname}`;
  const description = `${sessionCategory} Breathwork: ${sessionSubtitle} (${durationMinutes} min)\n\nOpen session: ${sessionLink}`;
  const eventTitle = `Āera — ${sessionTitle}`;

  const isReady = !!date;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center gap-1.5 px-2.5 h-[25px] border border-white/40 rounded-full text-white/70 font-body font-normal text-[16px] transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Add to calendar"
        >
          <Plus className="w-3.5 h-3.5" />
          Add to Calendar
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[360px] bg-[#1D1D1C] border-white/10 text-white rounded-2xl p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="font-body text-lg font-semibold text-white">
            Schedule Session
          </DialogTitle>
          <DialogDescription className="sr-only">
            Pick a date and time, then add this session to your calendar.
          </DialogDescription>
          <p className="text-white/50 text-sm font-display mt-1">
            {sessionCategory} · {sessionTitle}
          </p>
        </DialogHeader>

        <div className="px-5 pb-5 space-y-4">
          {/* Date picker */}
          <div className="space-y-1.5">
            <label className="text-xs text-white/50 font-display">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full h-10 px-3 rounded-md inline-flex items-center justify-start text-left font-normal bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:text-white",
                    !date && "text-white/40",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "EEE, MMM d, yyyy") : "Pick a date"}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-[#1D1D1C] border-white/10"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="p-3 pointer-events-auto text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time picker */}
          <div className="space-y-1.5">
            <label className="text-xs text-white/50 font-display">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white font-body text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>

          {/* Duration display */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50 font-display">Duration</span>
            <span className="text-white font-display">{durationMinutes} min</span>
          </div>

          {/* Calendar buttons */}
          <div className="space-y-2 pt-2">
            <button
              disabled={!isReady}
              onClick={() => {
                if (!date) return;

                const opened = openExternalCalendarLink(
                  buildGoogleCalendarUrl(eventTitle, description, date, time, durationMinutes),
                );

                if (!opened) {
                  const msg = "Popup blocked. Please allow popups and try again.";
                  setStatusMessage(msg);
                  toast.error(msg);
                  return;
                }

                setOpen(false);
                setStatusMessage("Google Calendar opened in a new tab.");
                toast.success("Google Calendar opened.");
              }}
              className="w-full h-11 rounded-xl bg-white text-[#1D1D1C] font-body font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/90 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google Calendar
            </button>

            <button
              disabled={!isReady}
              onClick={() => {
                if (!date) return;

                const opened = openExternalCalendarLink(
                  buildOutlookUrl(eventTitle, description, date, time, durationMinutes),
                );

                if (!opened) {
                  const msg = "Popup blocked. Please allow popups and try again.";
                  setStatusMessage(msg);
                  toast.error(msg);
                  return;
                }

                setOpen(false);
                setStatusMessage("Outlook Calendar opened in a new tab.");
                toast.success("Outlook Calendar opened.");
              }}
              className="w-full h-11 rounded-xl bg-[#0078D4] text-white font-body font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0078D4]/90 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.57-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.33.75.1.43.1.87zm-3.15 2.55l.49-.13q.22.63.66.97.45.34 1.07.34.55 0 .96-.23.4-.24.67-.65.27-.42.41-.97.15-.56.15-1.2 0-.64-.15-1.18-.14-.55-.41-.95-.27-.41-.66-.63-.39-.23-.95-.23-.46 0-.84.18-.37.17-.64.47l-.55-.42L5.8 7h4.35v.93H6.58l-.46 2.36q.27-.27.66-.45.39-.18.87-.18.68 0 1.2.29.52.29.87.76.35.47.53 1.07.18.61.18 1.28 0 .73-.2 1.36-.19.62-.56 1.08-.37.46-.9.73-.52.26-1.18.26-.57 0-1.04-.18-.46-.19-.8-.51-.34-.33-.54-.76-.2-.44-.24-.95l.64-.14z" />
                <path d="M24 5.5v13c0 1.93-1.57 3.5-3.5 3.5H3.5C1.57 22 0 20.43 0 18.5v-13C0 3.57 1.57 2 3.5 2h17C22.43 2 24 3.57 24 5.5zm-1 0C23 4.12 21.88 3 20.5 3h-17C2.12 3 1 4.12 1 5.5v13C1 19.88 2.12 21 3.5 21h17c1.38 0 2.5-1.12 2.5-2.5v-13z" />
              </svg>
              Outlook Calendar
            </button>

            <button
              disabled={!isReady}
              onClick={() => {
                if (!date) return;
                const msg = "ICS downloaded with a 5-minute reminder and session link.";
                setStatusMessage(msg);
                toast.success(msg, { duration: 10000 });
                downloadICS(eventTitle, description, sessionLink, date, time, durationMinutes);
              }}
              className="w-full h-11 rounded-xl bg-white/10 text-white font-body font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/15 transition-colors"
            >
              <CalendarIcon className="w-4 h-4" />
              Download .ics File
            </button>
          </div>

          {statusMessage && (
            <p className="text-xs text-white/60 font-display" role="status" aria-live="polite">
              {statusMessage}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCalendar;
