import React from "react";
import { getMedicineStatus } from "./utils/medicineUtils";
import { motion } from "framer-motion";
export default function Dashboard({
  setCurrentPage,
  showAddMed,
  setShowAddMed,
  medicines,
  setMedicines,
  heartRate,
  bloodPressure,
  weight,
  selectedSymptoms,
  notes,
  profileDetails
}) {

  const [medDetails, setMedDetails] = React.useState({
    id: "",
    name: "",
    dosage: "",
    unit: "mg",
    type: "Oral Tablet",
    time: "",
    instructions: "",
    status: false
  })

  const [weeklyData, setWeeklyData] =
    React.useState(
      JSON.parse(localStorage.getItem("weeklyData")) || [
        { day: "Mon", taken: 0, missed: 0 },
        { day: "Tue", taken: 0, missed: 0 },
        { day: "Wed", taken: 0, missed: 0 },
        { day: "Thu", taken: 0, missed: 0 },
        { day: "Fri", taken: 0, missed: 0 },
        { day: "Sat", taken: 0, missed: 0 },
        { day: "Sun", taken: 0, missed: 0 }
      ]
    );


  const missedToday = medicines.filter(
    medicine => getMedicineStatus(medicine) === "MISSED"
  ).length;

  const missedAdherence = medicines.length === 0 ? 0 : Math.round((missedToday / medicines.length) * 100);

  const medicineTypes = new Set(medicines.map(med => med.type)).size;
  const takenToday =
    medicines.filter(
      med => med.status
    ).length;

  const dailyAdherence =
    medicines.length === 0
      ? 0
      : Math.round(
        (takenToday / medicines.length) * 100
      );

  const pendingToday = medicines.filter(
    med => getMedicineStatus(med) === "PENDING"
  ).length;

  const pendingAdherence = medicines.length === 0 ? 0 : Math.round((pendingToday / medicines.length) * 100);

  const totalTaken = weeklyData.reduce(
    (total, day) => total + day.taken,
    0
  );

  const totalMissed = weeklyData.reduce(
    (total, day) => total + day.missed,
    0
  );

  const adherenceRate =
    totalTaken + totalMissed === 0
      ? 0
      : Math.round(
        (totalTaken / (totalTaken + totalMissed)) * 100
      );
  const weeklyAdherenceRate = totalMissed === 0 ? 0 : Math.round((totalMissed / (totalTaken + totalMissed)) * 100);

  function addMedHandleChange() {
    setShowAddMed(prevState => !prevState);
  }

  function handleChange(event) {
    setMedDetails(prevState => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      }
    });
  }
  function addMedicine() {
    const medicine = {
      id: Date.now(),
      name: medDetails.name,
      dosage: medDetails.dosage,
      unit: medDetails.unit,
      type: medDetails.type,
      time: medDetails.time,
      instructions: medDetails.instructions,
      status: false
    };
    if (medicine.name === "" || medicine.time === "") {
      alert("Please fill in medicine name and time");
      return;
    }
    const medicines = JSON.parse(localStorage.getItem("medicines")) || [];
    medicines.push(medicine);
    localStorage.setItem("medicines", JSON.stringify(medicines));
    setMedDetails({
      id: "",
      name: "",
      dosage: "",
      unit: "mg",
      type: "Oral Tablet",
      time: "",
      instructions: "",
    });
    setShowAddMed(prevState => !prevState);
    setMedicines(medicines);
  }

  function dateDisplay() {
    const today = new Date();
    const day = today.toLocaleDateString("en-US", { weekday: "long" });
    const date = today.getDate();
    const month = today.toLocaleDateString("en-US", { month: "long" });
    const year = today.getFullYear();

    const hours = today.getHours();
    let greeting;
    if (hours < 12) {
      greeting = "Good Morning";
    } else if (hours < 18) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good Evening";
    }
    return (
      <div className="dashboard-greeting-container">
        <p className="dashboard-greeting">
          {day}, {date} {month} {year} • {greeting}, {profileDetails?.name || "User"} 👋
        </p>
      </div>
    )
  }



  function deleteMedicine(id) {
    const updatedMedicines =
      medicines.filter(medicine => medicine.id !== id);

    setMedicines(updatedMedicines);

    localStorage.setItem(
      "medicines",
      JSON.stringify(updatedMedicines)
    );
  }

  function statusChange(id) {
    const updatedMedicines = medicines.map(medicine => {
      if (medicine.id === id) {
        return {
          ...medicine,
          status: !medicine.status
        };
      }
      return medicine;
    })

    setMedicines(updatedMedicines);
    localStorage.setItem("medicines", JSON.stringify(updatedMedicines));
  }





  function resetDailyStatus() {
    const today = new Date().toISOString().split("T")[0];
    const lastResetDate = localStorage.getItem("lastResetDate");
    if (lastResetDate === today) {
      return;
    }
    if (!lastResetDate) {
      localStorage.setItem(
        "lastResetDate",
        today
      );
      return;
    }
    const taken =
      medicines.filter(
        med => med.status
      ).length;

    const total = medicines.length;
    const takenPercent =
      total === 0 ? 0 : (taken / total) * 100;

    const missedPercent =
      total === 0 ? 0 : ((total - taken) / total) * 100;

    const lastWeekday = new Date(lastResetDate).toLocaleDateString("en-US", { weekday: "long" });
    let updatedWeeklyData = weeklyData;
    if (lastWeekday === "Monday") {
      updatedWeeklyData = updatedWeeklyData.map(day => ({
        ...day,
        missed: 0,
        taken: 0
      })

      )
      setWeeklyData(updatedWeeklyData);

      localStorage.setItem(
        "weeklyData",
        JSON.stringify(updatedWeeklyData)
      );
    }

    updatedWeeklyData = updatedWeeklyData.map(day => {
      if (day.day === lastWeekday.slice(0, 3)) {
        return {
          ...day,
          taken: takenPercent,
          missed: missedPercent
        };
      }
      return day;
    });


    setWeeklyData(updatedWeeklyData);

    localStorage.setItem(
      "weeklyData",
      JSON.stringify(updatedWeeklyData)
    );

    const updatedMedicines = medicines.map(medicine => ({
      ...medicine,
      status: false
    }));

    localStorage.setItem("medicines", JSON.stringify(updatedMedicines));
    setMedicines(updatedMedicines);


    const existingReminders = JSON.parse(localStorage.getItem("medReminders")) || [];
    const resetReminders = existingReminders.map(r => ({ ...r, notified: false }));
    localStorage.setItem("medReminders", JSON.stringify(resetReminders));
    localStorage.setItem("lastResetDate", today);
  }


  React.useEffect(() => {
    const timer = setTimeout(() => {
      resetDailyStatus();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  return (
    <motion.section
      className="dashboard"
      initial={{ opacity: 0, y: 20, scale: 0.98, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(8px)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-title">Dashboard</div>
          {dateDisplay()}
        </div>
        <div className="dashboard-header-right">

          <div className="addMed-container">
            <button className="addMed-btn" onClick={addMedHandleChange}>+ Add Medicine</button>
          </div>
        </div>
      </div>

      {/* Add medicine Pop-up */}

      {showAddMed && (
        <div className="addMed-overlay">
          <div className="addMed-modal">

            <div className="addMed-header">
              <h2>Add Medicine</h2>

              <button
                className="close-btn"
                onClick={addMedHandleChange}
              >
                ✕
              </button>
            </div>

            <div className="addMed-body">

              <div className="form-group">
                <label>Medicine Name</label>
                <input
                  type="text"
                  placeholder="e.g. Metformin HCl"
                  onChange={handleChange}
                  name="name"
                  value={medDetails.name}
                />
              </div>

              <div className="form-group">
                <label>Dosage</label>

                <div className="dosage-row">
                  <input
                    type="number"
                    placeholder="500"
                    onChange={handleChange}
                    name="dosage"
                    value={medDetails.dosage}
                  />

                  <select
                    onChange={handleChange}
                    name="unit"
                    value={medDetails.unit}>
                    <option>mg</option>
                    <option>ml</option>
                    <option>g</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Type</label>

                <select
                  onChange={handleChange}
                  name="type"
                  value={medDetails.type}>
                  <option>Oral Tablet</option>
                  <option>Capsule</option>
                  <option>Syrup</option>
                  <option>Injection</option>
                </select>
              </div>

              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  onChange={handleChange}
                  name="time"
                  value={medDetails.time} />
              </div>

              <div className="form-group">
                <label>Instructions</label>

                <input
                  type="text"
                  placeholder="e.g. After food"
                  onChange={handleChange}
                  name="instructions"
                  value={medDetails.instructions}
                />
              </div>
              <div className="addMed-footer">
                <button className="save-med-btn" onClick={addMedicine}>
                  Save Medicine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}





      <div className="dashboard-main">
        <div className="progress-cards">
          <div className="total-med-container">
            <div className="totalMed-icon-container"><img className="totalMed-icon" src="totalMed.png"></img></div>
            <div className="recently-added">{medicineTypes} Types</div>
            <div className="totalMed-number">{medicines.length}</div>
            <div className="totalMed-title">Total Medicines</div>
            <div className="present-time">Last updated: {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</div>
          </div>

          <div className="scheduledToday-container">
            <div className="scheduledToday-icon-container"><img className="scheduledToday-icon" src="missedToday.png"></img></div>
            <div className="scheduledToday-day">{missedToday} Missed</div>
            <div className="scheduledToday-number-container">
              <div className="scheduledToday-number">{missedToday}</div>
              <div className="scheduledToday-unit">doses</div>
            </div>
            <div className="scheduledToday-title">Missed Today</div>
            <div className="scheduledToday-progress-bar"><div className="scheduledToday-progress-fill" style={{ width: `${missedAdherence}%` }}></div></div>
          </div>

          <div className="dosesTaken-container">
            <div className="dosesTaken-icon-container"><img className="dosesTaken-icon" src="dosesTaken.png"></img></div>
            <div className="dosesTaken-percent">{dailyAdherence}% Daily</div>
            <div className="dosesTaken-number">{takenToday}</div>
            <div className="dosesTaken-title">Doses Taken</div>
            <div className="dosesTaken-progress-bar"><div className="dosesTaken-progress-fill" style={{ width: `${dailyAdherence}%` }}></div></div>
          </div>

          <div className="remainingDoses-container">
            <div className="remainingDoses-icon-container"><img className="remainingDoses-icon" src="remainingDoses.png"></img></div>
            <div className="remainingDoses-overdue">{pendingToday} overdue</div>
            <div className="remainingDoses-number">{pendingToday}</div>
            <div className="remainingDoses-title">Remaining Doses</div>
            <div className="remainingDoses-progress-bar"><div className="remainingDoses-progress-fill" style={{ width: `${pendingAdherence}%` }}></div></div>
          </div>
        </div>


        <div className="schedule-weeklyAdhere">

          <div className="schedule-container">
            <div className="todaySchedule-header">
              <div className="todaySchedule-header-left">
                <div className="todaySchedule-dot"></div>
                <div className="schedule-title">Today's Schedule</div>
              </div>
              <div className="todaySchedule-header-right">
                <div className="view-all" onClick={() => setCurrentPage("myMedicines")}>View All →</div>
              </div>
            </div>

            {medicines.map(medicine => (
              <div className="medicine-container" key={medicine.id}>
                <div className="capsule-icon">💊</div>
                <div className="details-container">
                  <div className="medName">{medicine.name}</div>
                  <div className="med-time-container">
                    <div className="med-quantity">{medicine.dosage} {medicine.unit.toUpperCase()}</div>
                    <div> • </div>
                    <div className="med-type">{medicine.type}</div>
                    <div> • </div>
                    <div className="med-time">{medicine.instructions}</div>
                  </div>
                </div>
                <div className="time-status">
                  <div className="time">{medicine.time}</div>
                  <div className={getMedicineStatus(medicine) === "TAKEN" ? "status-taken" : (getMedicineStatus(medicine) === "MISSED" ? "status-missed" : "status-pending")}>{getMedicineStatus(medicine)}</div>
                </div>
                <div className="checkbox">{getMedicineStatus(medicine) === "MISSED" ? <input className="missedCheckbox" type="checkbox" checked={medicine.status} onChange={() => statusChange(medicine.id)}></input> : <input type="checkbox" checked={medicine.status} onChange={() => statusChange(medicine.id)}></input>}</div>
                <div className="del-btn-container">
                  <img
                    src="del-btn.png"
                    className="del-btn"
                    onClick={() => deleteMedicine(medicine.id)}>
                  </img>
                </div>

              </div>
            ))}


          </div>

          <div className="adherence-refills">
            <div className="weekly-adherence">
              <div className="weeklyAdherence-header">
                <div className="weeklyAdherence-title">
                  Weekly Adherence
                </div>

                <div className="this-week">
                  THIS WEEK
                </div>
              </div>

              <div className="weeklyAdherence-bar">
                {weeklyData.map((item) => (
                  <div className="day-column" key={item.day}>
                    <div className="day-bars">
                      <div
                        className="taken-bar"
                        style={{ height: `${(item.taken)}%` }}
                      ></div>

                      <div
                        className="missed-bar"
                        style={{ height: `${item.missed}%` }}
                      ></div>
                    </div>

                    <div className="day-label">{item.day}</div>
                  </div>
                ))}
              </div>

              <div className="weeklyAdherence-details">
                <div className="adherence-rate-container">
                  <div className="adherence-rate-value">
                    {adherenceRate}%
                  </div>

                  <div className="adherence-rate">
                    ADHERENCE RATE
                  </div>
                </div>

                <div className="adherence-missed-container">
                  <div className="adherence-missed-value">
                    {weeklyAdherenceRate}%
                  </div>

                  <div className="adherence-missed">
                    MISSED RATE
                  </div>
                </div>
              </div>
            </div>




            <div className="today-summary">
              <div className="today-summary-header">
                <h2>Today's Summary</h2>
              </div>

              <div className="summary-item">
                <div className="summary-left">
                  <span className="summary-dot taken-dot"></span>
                  <div>
                    <div className="summary-title">Taken</div>
                    <div className="summary-subtitle">
                      Completed medications
                    </div>
                  </div>
                </div>

                <div className="summary-value taken-value">
                  {takenToday}
                </div>
              </div>

              <div className="summary-item">
                <div className="summary-left">
                  <span className="summary-dot pending-dot"></span>
                  <div>
                    <div className="summary-title">Pending</div>
                    <div className="summary-subtitle">
                      Yet to take
                    </div>
                  </div>
                </div>

                <div className="summary-value pending-value">
                  {pendingToday}
                </div>
              </div>

              <div className="summary-item">
                <div className="summary-left">
                  <span className="summary-dot missed-dot"></span>
                  <div>
                    <div className="summary-title">Missed</div>
                    <div className="summary-subtitle">
                      Missed medications
                    </div>
                  </div>
                </div>

                <div className="summary-value missed-value">
                  {missedToday}
                </div>
              </div>
            </div>

          </div>
        </div>



        <div className="health-stats">

          <div className="health-card pressure-card">

            <div className="health-card-left">
              <div className="health-card-label">
                BLOOD PRESSURE
              </div>

              <div className="health-card-value">
                {bloodPressure} <span>mmHg</span>
              </div>

              <div className="health-card-status stable">
                ↝ Stable
              </div>
            </div>

            <div className="health-card-icon pressure-icon">
              ❤️
            </div>

          </div>


          <div className="health-card heart-card">

            <div className="health-card-left">
              <div className="health-card-label">
                HEART RATE
              </div>

              <div className="health-card-value">
                {heartRate} <span>BPM</span>
              </div>

              <div className="health-card-status neutral">
                ─ No change
              </div>
            </div>

            <div className="health-card-icon heart-icon">
              💓
            </div>

          </div>


          <div className="health-card weight-card">

            <div className="health-card-left">
              <div className="health-card-label">
                WEIGHT
              </div>

              <div className="health-card-value">
                {weight} <span>kg</span>
              </div>

              <div className="health-card-status warning">
                Current Weight
              </div>
            </div>

            <div className="health-card-icon weight-icon">
              ⚖️
            </div>

          </div>


          <div className="health-card symptoms-card">

            <div className="health-card-left" style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <div className="health-card-label">
                SYMPTOMS & NOTES
              </div>

              <div className="dashboard-symptoms-container">
                {selectedSymptoms && selectedSymptoms.length > 0 ? (
                  <div className="dashboard-symptoms-list">
                    {selectedSymptoms.map((symptom) => (
                      <span key={symptom} className="dashboard-symptom-tag">
                        {symptom}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="no-symptoms">No symptoms reported</span>
                )}

                {notes && (
                  <div className="dashboard-notes-preview">
                    <strong>Notes:</strong> {notes}
                  </div>
                )}
              </div>
            </div>

            <div className="health-card-icon symptoms-icon">
              ✨
            </div>

          </div>

        </div>



      </div>
    </motion.section>
  )
}
