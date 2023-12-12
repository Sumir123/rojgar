import React from "react";
import { useStoreState } from "../../store";
import Link from "next/link";
const origin = process.env.NEXT_PUBLIC_API_URL;

const ApplicationCard = ({ applications }) => {
  const { currentUser } = useStoreState();
  const groupedApplications = applications.reduce((acc, application) => {
    const jobTitle = application.job_title;
    if (!acc[jobTitle]) {
      acc[jobTitle] = [];
    }
    acc[jobTitle].push(application);
    return acc;
  }, {});

  const handleSelect = (applicationID, user_name, user_email, jobTitle) => {
    const shouldSelect = window.confirm(
      "Are you sure you want to call " + user_name + " for interview"
    );
    if (shouldSelect) {
   
      // Prepare and send email
      const jobDetails =
        "Job Details: \n\n" +
        "Job Title: " +
        jobTitle +
        "\n" +
        "Employer: " +
        currentUser?.name +
        "\n" +
        "Location: [Insert Job Location]\n\n" +
        "Add more details here...\n";

      const emailContent = `Dear ${user_name},\n\nCongratulations! You have been called for interview.\n\n${jobDetails}`;
      const emailSubject = "Call for Interview";

      // Send the email using your preferred method (e.g., API call, email library)
      sendEmail(user_email, emailSubject, emailContent);
    }
  };

  const sendEmail = (recipient, subject, content) => {
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(content)}`;
    window.open(mailtoUrl);
  };

  return (
    <div>
      {Object.entries(groupedApplications).map(
        ([jobTitle, jobApplications]) => (
          <div key={jobTitle} className="mb-8">
            <h2 className="text-xl font-semibold mt-4 mb-2">{jobTitle}</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {jobApplications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white border shadow-sm rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <Link
                      href={`/employer/applicant/${application.user_id}`}
                      className="text-lg font-medium hover:underline"
                    >
                      <h3>{application.user_name}</h3>
                    </Link>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-0.5 px-4 rounded-md "
                      onClick={() =>
                        handleSelect(
                          application._id,
                          application.user_name,
                          application.user_email,
                          jobTitle
                        )
                      }
                    >
                      Call for interview
                    </button>
                  </div>
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-700">Resume:</p>
                      <a
                        href={`${origin}/api/application/resume/${application._id}`}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        {application.resume_filename.replace("uploads\\", "")}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">Cover Letter:</p>
                      <a
                        href={`${origin}/api/application/cover_letter/${application._id}`}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        {application.cover_letter_filename.replace(
                          "uploads\\",
                          ""
                        )}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ApplicationCard;
