import "./MedicalRecords.css";

import React from 'react'

export default function MedicalRecords() {
    const [ recordsSearch, setRecordsSearch] = useState("");
    const [ record, setRecord ] = useState();

    useEffect(() => {
        if (recordsSearch.length > 1) {
          $.ajax({
            url: `http://localhost:3000/patients/get-patients-by-name?search=${recordsSearch}`,
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            },
            success: function (data) {
              if (Array.isArray(data)) {
                setPatients(data);
              } else {
                setPatients([]);
              }
            },
            error: function (err) {
              console.error("Error fetching records:", err);
              setPatients([]);
            }
          });
        } else {
          setPatients([]);
        }
      }, [recordsSearch]);

  return (
    <div>
      
    </div>
  )
}
