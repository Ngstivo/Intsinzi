const INTSINZI_MAIL = {
  endpoint: "https://cnmltsxtxsazxrdrvomn.supabase.co/functions/v1/pull-enquiry-emails",
  key: "__INTSINZI_EMAIL_PULL_KEY__",
  recipient: "nsteveintsinzi@gmail.com",
  intervalMinutes: 1,
};

function installIntsinziEmail() {
  const account = Session.getEffectiveUser().getEmail().toLowerCase();
  if (account !== INTSINZI_MAIL.recipient) {
    throw new Error("Open this script using the Intsinzi Gmail account.");
  }
  callIntsinzi_({ action: "check" });
  const installed = ScriptApp.getProjectTriggers().some(
    trigger => trigger.getHandlerFunction() === "pollIntsinziEnquiries"
  );
  if (!installed) {
    ScriptApp.newTrigger("pollIntsinziEnquiries").timeBased().everyMinutes(INTSINZI_MAIL.intervalMinutes).create();
  }
  pollIntsinziEnquiries();
  console.log("Intsinzi enquiry alerts are installed.");
}

function callIntsinzi_(payload) {
  const result = UrlFetchApp.fetch(INTSINZI_MAIL.endpoint, {
    method: "post",
    contentType: "application/json",
    headers: { "x-intsinzi-pull-key": INTSINZI_MAIL.key },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    followRedirects: false,
  });
  if (result.getResponseCode() !== 200) {
    throw new Error("Intsinzi email queue returned HTTP " + result.getResponseCode());
  }
  return JSON.parse(result.getContentText());
}

function pollIntsinziEnquiries() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(100)) return;
  try {
    let quota = MailApp.getRemainingDailyQuota();
    if (!quota) return;
    const batch = callIntsinzi_({ action: "claim" });
    const properties = PropertiesService.getScriptProperties();
    for (const email of batch.emails) {
      const marker = "sent:" + email.id;
      let delivered = properties.getProperty(marker) === "yes";
      if (!delivered && quota > 0) {
        try {
          const options = { name: "Intsinzi Digital Studio" };
          if (email.replyTo) options.replyTo = email.replyTo;
          MailApp.sendEmail(INTSINZI_MAIL.recipient, email.subject, email.text, options);
          delivered = true;
          quota--;
        } catch {
          console.error("An Intsinzi enquiry email could not be sent and will retry.");
        }
        if (delivered) properties.setProperty(marker, "yes");
      }
      try {
        callIntsinzi_({ action: "finish", id: email.id, worker: batch.worker, delivered });
        if (delivered) properties.deleteProperty(marker);
      } catch {
        console.error("Intsinzi email acknowledgement will retry.");
      }
    }
  } finally {
    lock.releaseLock();
  }
}
