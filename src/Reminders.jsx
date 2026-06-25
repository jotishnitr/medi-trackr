import React from "react";
import { getMedicineStatus } from "./utils/medicineUtils";
import { motion } from "framer-motion";

export default function Reminders({ medicines, setMedicines, setCurrentPage, setShowAddMed }) {
  // Helper to format time to { time: "HH:MM", ampm: "AM/PM" }
  const formatTime = (timeStr) => {
    if (!timeStr) return { time: "--:--", ampm: "" };
    const [hoursStr, minutesStr] = timeStr.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    return { time: `${formattedHours}:${minutesStr}`, ampm };
  };

  // Calculate stats dynamically from medicines prop
  const takenCount = medicines.filter((m) => getMedicineStatus(m) === "TAKEN").length;
  const pendingCount = medicines.filter((m) => getMedicineStatus(m) === "PENDING").length;
  const missedCount = medicines.filter((m) => getMedicineStatus(m) === "MISSED").length;

  // Calculate adherence rate for tip card
  const weeklyData = JSON.parse(localStorage.getItem("weeklyData")) || [
    { day: "Mon", taken: 0, missed: 0 },
    { day: "Tue", taken: 0, missed: 0 },
    { day: "Wed", taken: 0, missed: 0 },
    { day: "Thu", taken: 0, missed: 0 },
    { day: "Fri", taken: 0, missed: 0 },
    { day: "Sat", taken: 0, missed: 0 },
    { day: "Sun", taken: 0, missed: 0 }
  ];
  const totalWeeklyTaken = weeklyData.reduce((total, day) => total + day.taken, 0);
  const totalWeeklyMissed = weeklyData.reduce((total, day) => total + day.missed, 0);
  const adherencePercent = (totalWeeklyTaken + totalWeeklyMissed === 0)
    ? 0
    : Math.round((totalWeeklyTaken / (totalWeeklyTaken + totalWeeklyMissed)) * 100);

  const handleStatusChange = (id) => {
    if (!setMedicines) return;
    const updatedMedicines = medicines.map((med) => {
      if (med.id === id) {
        return {
          ...med,
          status: !med.status
        };
      }
      return med;
    });
    setMedicines(updatedMedicines);
    localStorage.setItem("medicines", JSON.stringify(updatedMedicines));

    const existingReminders = JSON.parse(localStorage.getItem("medReminders")) || [];
    const updatedReminders = existingReminders.map((r) =>
      r.id === id ? { ...r, status: !r.status } : r
    );
    localStorage.setItem("medReminders", JSON.stringify(updatedReminders));
    setReminders(updatedReminders);
  };

  // Notification System

  React.useEffect(() => {
    const updated = JSON.parse(localStorage.getItem("medReminders")) || [];
    setReminders(updated);
  }, [medicines]);

  const [reminders, setReminders] = React.useState(JSON.parse(localStorage.getItem("medReminders")) || []);
  function toggleNotification(id) {
    const updatedReminders = reminders.map((reminder) => {
      if (reminder.id === id) {
        return {
          ...reminder,
          reminder: !reminder.reminder
        };
      }
      return reminder;
    });
    localStorage.setItem("medReminders", JSON.stringify(updatedReminders));
    setReminders(updatedReminders);
  }
  const [notificationStatus, setNotificationStatus] = React.useState(JSON.parse(localStorage.getItem("notificationStatus")));
  const [soundStatus, setSoundStatus] = React.useState(JSON.parse(localStorage.getItem("soundStatus")));
  function toggleNotificationStatus() {
    setNotificationStatus(prevState => !prevState);
  }
  React.useEffect(() => {
    localStorage.setItem("notificationStatus", notificationStatus);
  }, [notificationStatus]);

  function toggleSoundStatus() {
    setSoundStatus(prevState => !prevState);
  }
  React.useEffect(() => {
    localStorage.setItem("soundStatus", soundStatus);
  }, [soundStatus]);



  return (
    <motion.section
      className="reminders"
      initial={{ opacity: 0, y: 20, scale: 0.98, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(8px)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="reminders-header">
        <div className="reminders-header-left">
          <h1>Reminders</h1>
          <p>Manage your daily schedules and alert configurations</p>
        </div>
        <div className="reminders-header-right">
          <button className="add-med-btn" onClick={() => {
            setCurrentPage("Dashboard");
            setShowAddMed(true);
          }}>
            + Add Medicine
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="reminders-main-grid">
        {/* Left Column: Stats and Today's Schedule */}
        <div className="reminders-left-col">
          {/* Stats Boxes */}
          <div className="reminders-stats-row">
            <div className="reminder-stat-card taken">
              <span className="stat-label">TAKEN</span>
              <span className="stat-value">{takenCount}</span>
            </div>
            <div className="reminder-stat-card pending">
              <span className="stat-label">PENDING</span>
              <span className="stat-value">{pendingCount}</span>
            </div>
            <div className="reminder-stat-card missed">
              <span className="stat-label">MISSED</span>
              <span className="stat-value">{missedCount}</span>
            </div>
          </div>

          {/* Today's Schedule Panel */}
          <div className="schedule-panel">
            <div className="schedule-panel-header">
              <div className="schedule-title-area">
                <h2>Today's Schedule</h2>
                <span className="pending-badge">{pendingCount} PENDING</span>
              </div>
              <div className="schedule-controls">

              </div>
            </div>

            {medicines.length === 0 ? (
              <div className="empty-schedule">
                <p>No medicines scheduled for today. Add medicines to get started.</p>
              </div>
            ) : (
              <div className="timeline-wrapper">
                <div className="timeline-line"></div>
                <div className="timeline-list">
                  {reminders.map((med) => {
                    const status = getMedicineStatus(med);
                    const timeInfo = formatTime(med.time);

                    // Determine CSS class modifiers based on status
                    let statusClass = "pending";
                    if (status === "TAKEN") statusClass = "taken";
                    if (status === "MISSED") statusClass = "missed";

                    return (
                      <div key={med.id} className={`timeline-item ${statusClass}`}>
                        {/* Timeline Node on Left */}
                        <div className="timeline-node">
                          <div className={`node-circle ${statusClass}`}></div>
                        </div>

                        {/* Medicine Card Content */}
                        <div className={`timeline-card ${statusClass}`}>
                          {/* Time display block */}
                          <div className="time-block">
                            <span className="time-value">{timeInfo.time}</span>
                            <span className="time-ampm">{timeInfo.ampm}</span>
                          </div>

                          {/* Medicine Name and Instructions */}
                          <div className="med-info-block">
                            <span className="medicine-name">{med.name}</span>
                            <span className="medicine-instructions">
                              <span className="fork-icon">🍴</span> {med.instructions || "No instructions"}
                            </span>
                          </div>

                          {/* Controls (Toggle Notifications & Taken Action) */}
                          <div className="card-actions">
                            <div className="toggle-notification-wrap">
                              <span className="toggle-label">ENABLED</span>
                              <label className="toggle-switch">
                                <input
                                  type="checkbox"
                                  defaultChecked={med.reminder}
                                  onChange={() => toggleNotification(med.id)}
                                />
                                <span className="slider-round"></span>
                              </label>
                            </div>

                            {status === "TAKEN" ? (
                              <button
                                className="check-btn taken"
                                title="Mark as Pending"
                                onClick={() => handleStatusChange(med.id)}
                              >
                                <span className="material-symbols-outlined">check_circle</span>
                              </button>
                            ) : (
                              <button
                                className="check-btn action"
                                title="Mark as Taken"
                                onClick={() => handleStatusChange(med.id)}
                              >
                                <span className="material-symbols-outlined">check</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Settings and Tips */}
        <div className="reminders-right-col">
          {/* Notification Settings Panel */}
          <div className="settings-panel">
            <div className="settings-header">
              <span className="material-symbols-outlined settings-icon">settings</span>
              <h2>Notification Settings</h2>
            </div>

            <div className="settings-options">


              {/* Browser Alerts */}
              <div className="setting-row">
                <div className="setting-info">
                  <h3>Browser Alerts</h3>
                  <p>Instant push notifications</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked={notificationStatus} onChange={() => toggleNotificationStatus()} />
                  <span className="slider-round"></span>
                </label>
              </div>

              {/* Notification Sound */}
              <div className="setting-row">
                <div className="setting-info">
                  <h3>Notification Sound</h3>
                  <p>Gentle alert tone</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked={soundStatus} onChange={() => toggleSoundStatus()} />
                  <span className="slider-round"></span>
                </label>
              </div>


            </div> {/* Close settings-options */}
          </div> {/* Close settings-panel */}

          {/* Adherence Tip Box */}
          <div className="adherence-tip-box">
            <h3>Adherence Tip</h3>
            <p>
              Consistency is key! You have maintained an {adherencePercent}% adherence rate this week.
              Keep taking your medications at the same time daily for better blood pressure and overall health control.
            </p>
          </div>
        </div> {/* Close reminders-right-col */}
      </div> {/* Close reminders-main-grid */}
    </motion.section>
  );
}
