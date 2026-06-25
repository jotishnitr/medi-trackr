import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import MyMedicines from "./MyMedicines";
import SearchMedicine from "./SearchMedicine";
import Reminders from "./Reminders";
import HealthLog from "./HealthLog";
import ProfileModal from "./ProfileModal";


import React from "react";
import { AnimatePresence } from "framer-motion";

export default function App() {

  React.useEffect(() => {

    if ("Notification" in window) {

      Notification.requestPermission()
        .then(permission => {
          console.log(permission);
        });

    }

  }, []);




  const [medicines, setMedicines] = React.useState(JSON.parse(localStorage.getItem("medicines")) || []);

  const [showAddMed, setShowAddMed] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Profile modal states
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [profileDetails, setProfileDetails] = React.useState(() => {
    const stored = localStorage.getItem("profileDetails");
    return stored ? JSON.parse(stored) : {
      name: "User Name",
      age: "",
      bloodType: "",
      height: "",
      weight: "",
      allergies: "",
      emergencyContact: ""
    };
  });

  // Lifted vitals and symptoms state with safe initializers
  const [heartRate, setHeartRate] = React.useState(() => localStorage.getItem("heartRate") || "0");
  const [bloodPressure, setBloodPressure] = React.useState(() => localStorage.getItem("bloodPressure") || "0/0");
  const [weight, setWeight] = React.useState(() => localStorage.getItem("weight") || "0");
  const [selectedSymptoms, setSelectedSymptoms] = React.useState(() => {
    const stored = localStorage.getItem("selectedSymptoms");
    return stored ? stored.split(",").filter(Boolean) : ["Fatigue"];
  });
  const [notes, setNotes] = React.useState(() => localStorage.getItem("notes") || "");

  React.useEffect(() => {
    const existingReminders = JSON.parse(localStorage.getItem("medReminders")) || [];
    const updatedReminders = medicines.map(medicine => {
      const existing = existingReminders.find(r => r.id === medicine.id);
      if (existing) {
        return {
          ...medicine,
          reminder: existing.reminder,
          notified: existing.notified
        };
      }
      return {
        ...medicine,
        reminder: true,
        notified: false
      };
    });
    localStorage.setItem("medReminders", JSON.stringify(updatedReminders));
  }, [medicines])

  React.useEffect(() => {
    const interval = setInterval(() => {
      const medReminders = JSON.parse(localStorage.getItem("medReminders")) || []
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hours}:${minutes}`;

      medReminders.forEach((reminder) => {
        const notificationStatus = JSON.parse(localStorage.getItem("notificationStatus"));
        const soundStatus = JSON.parse(localStorage.getItem("soundStatus"));
        if (reminder.time === currentTime && reminder.status === false && reminder.reminder && !reminder.notified && notificationStatus === true) {
          if (Notification.permission === "granted") {
            new Notification("Time for medicine", {
              body: `Time to take ${reminder.name}`
            });
          }
          if (soundStatus) {
            const sound = new Audio("notificationSound.mp3");
            sound.play();
          }
          reminder.notified = true;
          localStorage.setItem("medReminders", JSON.stringify(medReminders));
          localStorage.setItem("medicines", JSON.stringify(medicines));
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [medicines]);

  return (
    <>
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        profileDetails={profileDetails}
        setShowProfileModal={setShowProfileModal}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <AnimatePresence mode="wait">
        {currentPage === "Dashboard" && (
          <Dashboard
            key="Dashboard"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            showAddMed={showAddMed}
            setShowAddMed={setShowAddMed}
            medicines={medicines}
            setMedicines={setMedicines}
            heartRate={heartRate}
            bloodPressure={bloodPressure}
            weight={weight}
            selectedSymptoms={selectedSymptoms}
            notes={notes}
            profileDetails={profileDetails}
          />
        )}
        {currentPage === "myMedicines" && (
          <MyMedicines
            key="myMedicines"
            setShowAddMed={setShowAddMed}
            showAddMed={showAddMed}
            medicines={medicines}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === "Remainders" && (
          <Reminders
            key="Remainders"
            medicines={medicines}
            setMedicines={setMedicines}
            setCurrentPage={setCurrentPage}
            setShowAddMed={setShowAddMed}
          />
        )}

        {currentPage === "SearchMedicines" && (
          <SearchMedicine
            key="SearchMedicines"
            setCurrentPage={setCurrentPage}
            setShowAddMed={setShowAddMed}
          />
        )}

        {currentPage === "HealthLog" && (
          <HealthLog
            key="HealthLog"
            setCurrentPage={setCurrentPage}
            setShowAddMed={setShowAddMed}
            heartRate={heartRate}
            setHeartRate={setHeartRate}
            bloodPressure={bloodPressure}
            setBloodPressure={setBloodPressure}
            weight={weight}
            setWeight={setWeight}
            selectedSymptoms={selectedSymptoms}
            setSelectedSymptoms={setSelectedSymptoms}
            notes={notes}
            setNotes={setNotes}
          />
        )}
      </AnimatePresence>

      {showProfileModal && (
        <ProfileModal
          profileDetails={profileDetails}
          setProfileDetails={setProfileDetails}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}