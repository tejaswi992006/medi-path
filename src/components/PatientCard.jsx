import { Link } from "react-router-dom";

function PatientCard({ patient }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">

      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {patient.name}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Patient ID: {patient.id}
          </p>
        </div>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          {patient.gender}
        </span>

      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm">

        <p>
          <strong>Age:</strong> {patient.age}
        </p>

        <p>
          <strong>Phone:</strong> {patient.phone}
        </p>

        <p>
          <strong>Village:</strong> {patient.village}
        </p>

        <p>
          <strong>Medical History:</strong>{" "}
          {patient.medicalHistory || "None"}
        </p>

      </div>

      <Link
        to={`/patients/${patient.id}`}
        className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-5"
      >
        View Patient Profile
      </Link>

    </div>
  );
}

export default PatientCard;