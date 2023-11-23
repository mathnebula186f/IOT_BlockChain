import React from "react";

export default function State1Sp(requestInfo) {
  return (
    <div className="bg-gray-200 p-4 rounded-md shadow-md">
      <p className="font-bold text-blue-500 mb-2">Request Information:</p>
      {requestInfo ? (
        <div>
          <p>Request ID: {Number(requestInfo.requestID)}</p>
          <p>State: {Number(requestInfo.state)}</p>
          <p>From: {requestInfo.from}</p>
          <p>To: {requestInfo.to}</p>
          <p>Service ID: {Number(requestInfo.serviceID)}</p>

          {/* Form for HashS2 */}
          <h1>Waiting for Client to Approve the HashS1</h1>
        </div>
      ) : (
        <p>Loading request information...</p>
      )}
    </div>
  );
}
