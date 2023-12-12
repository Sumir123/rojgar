const Error = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="mt-[-15rem] text-center">
          <h1 className="text-4xl font-bold mb-4">404 Error</h1>
          <p className="text-lg text-gray-500 mb-4">Page not found</p>
          <a href="/" className="text-blue-500 hover:underline">
            Go back to homepage
          </a>
        </div>
      </div>
    </>
  );
};

export default Error;
