const prisma = require("./prisma");

const POLL_INTERVAL_MS = 60 * 1000; // check every 60 seconds
let _timer = null;

// Filled in by Phase 5 — imported lazily to avoid circular deps at boot time
function getSendCredentialEmail() {
  return require("../services/emailService").sendCredentialEmail;
}

async function processDueJobs() {
  const now = new Date();

  // Fetch all pending jobs whose scheduled_for time has passed
  const dueJobs = await prisma.credential_jobs.findMany({
    where: {
      status: "pending",
      scheduled_for: { lte: now },
    },
  });

  for (const job of dueJobs) {
    // Mark as sent BEFORE sending — prevents duplicate delivery if send is slow
    await prisma.credential_jobs.update({
      where: { id: job.id },
      data: { status: "sent" },
    });

    try {
      const sendCredentialEmail = getSendCredentialEmail();
      await sendCredentialEmail({
        to: job.email,
        studentName: job.student_name,
        enrollmentNo: job.enrollment_no,
      });
    } catch (err) {
      // Mark as failed so it can be investigated — do not retry automatically
      await prisma.credential_jobs.update({
        where: { id: job.id },
        data: { status: "failed" },
      });
    }
  }
}

function startCredentialScheduler() {
  if (_timer) return; // already running

  _timer = setInterval(async () => {
    try {
      await processDueJobs();
    } catch (err) {
      // Swallow top-level errors so the interval keeps running
    }
  }, POLL_INTERVAL_MS);

  // Allow Node process to exit even if the interval is still active
  if (_timer.unref) _timer.unref();
}

function stopCredentialScheduler() {
  if (_timer) {
    clearInterval(_timer);
    _timer = null;
  }
}

module.exports = { startCredentialScheduler, stopCredentialScheduler, processDueJobs };
