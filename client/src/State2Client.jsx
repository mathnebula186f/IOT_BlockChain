export default function State2Client(requestInfo) {
  return (
    <div>
      <>
        <h2 className="text-xl font-bold mb-2">
          Requested Service Information:
        </h2>
        {requestInfo ? (
          <div className="border p-4 rounded-md shadow-md">
            <p className="text-lg font-semibold mb-2">
              Request ID: {Number(requestInfo.requestID)}
            </p>
            {/* Display the information fetched from the smart contract */}
            <p>State: {Number(requestInfo.state)}</p>
            <p>From: {requestInfo.from}</p>
            <p>To: {requestInfo.to}</p>
            <p>Service ID: {Number(requestInfo.serviceID)}</p>
            <h1 className="text-2xl">
              We Have Confirmed HashS1 and Now Waiting For Service Provider to Give S2
            </h1>
          </div>
        ) : (
          <p>Loading request information...</p>
        )}
      </>
    </div>
  );
}
