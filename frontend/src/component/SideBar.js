function Sidebar() {
  return (
    <div className="bg-white border shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold mb-2">Filter Jobs</h3>
        <hr className="my-4" />
        <div className="mb-4">
          <h4 className="text-gray-600 text-sm font-semibold mb-2">Job Type</h4>
          <div className="flex flex-col">
            <label className="inline-flex items-center mb-2">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Full-time</span>
            </label>
            <label className="inline-flex items-center mb-2">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Part-time</span>
            </label>
            <label className="inline-flex items-center mb-2">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Contract</span>
            </label>
          </div>
        </div>
        <div>
          <h4 className="text-gray-600 text-sm font-semibold mb-2">Location</h4>
          <div className="flex flex-col">
            <label className="inline-flex items-center mb-2">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Remote</span>
            </label>
            <label className="inline-flex items-center mb-2">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">On-site</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
