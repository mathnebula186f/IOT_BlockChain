export default function Verdict(requestInfo){
    return (
      <div>
        {requestInfo && requestInfo.verdict === "Success" ? (
          <div>Successfully Service Provided to Client</div>
        ) : (
          <div>Loading....</div>
        )}
        {requestInfo && requestInfo.verdict === "AbortByClient" ? (
          <div>This Was Aborted By Client</div>
        ) : (
          <div>Loading....</div>
        )}
        {requestInfo && requestInfo.verdict === "AbortByServiceProvider" ? (
          <div>This Was Aborted By ServiceProvider</div>
        ) : (
          <div>Loading....</div>
        )}
        {requestInfo && requestInfo.verdict === "MaliciousClient" ? (
          <div>Client is Malicious</div>
        ) : (
          <div>Loading....</div>
        )}
        {requestInfo && requestInfo.verdict === "MaliciousServiceProvider" ? (
          <div>ServiceProvider is Malicious</div>
        ) : (
          <div>Loading....</div>
        )}
      </div>
    );
}