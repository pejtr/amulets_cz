import { sendWeeklyOfflineMessagesReport } from './weeklyOfflineMessagesReport';

let weeklyReportScheduled = false;

/**
 * Schedule automatic weekly report every Monday at 8:00 AM CET
 */
export function scheduleWeeklyReport(): void {
  if (weeklyReportScheduled) return;
  weeklyReportScheduled = true;
  
  const checkAndSendReport = async () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Send weekly report every Monday at 8:00 AM (with 5 minute window)
    if (dayOfWeek === 1 && hours === 8 && minutes >= 0 && minutes < 5) {
      console.log('[Weekly Report] Sending scheduled weekly offline messages report...');
      try {
        const result = await sendWeeklyOfflineMessagesReport();
        if (result.success) {
          console.log('[Weekly Report] ✅', result.message);
        } else {
          console.error('[Weekly Report] ❌', result.message);
        }
      } catch (error) {
        console.error('[Weekly Report] Failed to send:', error);
      }
    }
  };
  
  // Check every 5 minutes
  setInterval(checkAndSendReport, 5 * 60 * 1000);
  
  console.log('[Weekly Report] Scheduled for every Monday at 8:00 AM');
}

// Auto-start scheduler when module loads
scheduleWeeklyReport();
