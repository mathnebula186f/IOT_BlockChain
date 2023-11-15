// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract Contract {
    struct ServiceProvider {
        address serviceProviderAddress;
        string name;
        uint serviceProviderID;
        uint requestID;
    }

    struct Service {
        bytes32 hashS;
        bytes32 hashS2;
        string name;
        uint serviceID;
        address serviceProviderAddress;
        string s1;
    }

    struct Client {
        string name;
        address clientAddress;
        uint clientID;
        uint requestID;
    }

    struct Request {
        uint requestID;
        uint state;
        address from;
        address to;
        uint serviceID;
        string verdict;
    }

    uint public serviceProviderCount;
    uint public clientCount;
    uint public serviceCount;
    uint private requestCount;

    mapping(address => ServiceProvider) private serviceProviders;
    mapping(uint => Service) public services;
    mapping(address => Client) private clients;
    mapping(uint => Request) private requests;

    function registerServiceProvider(string calldata _name1, string calldata _name2, bytes32 _hash1,bytes32 _hash2) external {
        serviceProviderCount++;
        serviceProviders[msg.sender] = ServiceProvider({
            serviceProviderAddress: msg.sender,
            name: _name1,
            serviceProviderID: serviceProviderCount,
            requestID:0
        });
        serviceCount++;
        services[serviceCount] = Service({
            hashS: _hash1,  // Placeholder, replace with the actual hash value
            hashS2: _hash2,  // Placeholder, replace with the actual hash value
            name: _name2,
            serviceID: serviceCount,
            serviceProviderAddress:msg.sender,
            s1:""
        });

    }

    function registerClient(string calldata _name) external {
       // require(clients[msg.sender].clientAddress == address(0), "Client already registered");
        clientCount++;
        clients[msg.sender] = Client({
            name:_name,
            clientAddress: msg.sender,
            clientID: clientCount,
            requestID:0
        });
        
    }

    function checkAccount() external view returns (string memory) {
        if (clients[msg.sender].clientAddress != address(0)) {
            return "client";
        } else if (serviceProviders[msg.sender].serviceProviderAddress != address(0)) {
            return "serviceProvider";
        } else {
            return "no";
        }
    }

    function requestService(uint _serviceID) external {
        require(clients[msg.sender].clientAddress != address(0), "Only clients can request services");
        Service memory service = services[_serviceID];
        address serviceProviderAddress = service.serviceProviderAddress;
        // Increment requestCount
        requestCount++;

        // Create a new Request
        requests[requestCount] = Request({
            requestID: requestCount,
            state: 0,  // You can set the initial state as needed
            from: msg.sender,
            to: serviceProviderAddress,
            serviceID: _serviceID,
            verdict:"No"
        });

        // Update requested service in ServiceProvider
        serviceProviders[serviceProviderAddress].requestID = requestCount;

        // Update requested service in Client
        clients[msg.sender].requestID = requestCount;
    }

    function checkRequestedServiceForClient() external view returns (uint) {
        require(clients[msg.sender].clientAddress != address(0), "Only clients can check requested services");
        return clients[msg.sender].requestID;
    }

    function checkRequestedServiceForProvider() external view returns (uint) {
        require(serviceProviders[msg.sender].serviceProviderAddress != address(0), "Only service providers can check requested services");
        return serviceProviders[msg.sender].requestID;
    }

    function getRequestInfo(uint _requestID) external view returns (Request memory) {
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");
        return requests[_requestID];
    }
    modifier onlyIfVerdictIsNo(uint _requestID) {
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");
        require(keccak256(abi.encodePacked(requests[_requestID].verdict)) == keccak256(abi.encodePacked("No")), "Verdict must be 'No'");
        _;
    }
    function setHashS2(uint _requestID, bytes32 _hashS2) external onlyIfVerdictIsNo(_requestID){
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");
        // Find the corresponding service ID from the request
        uint serviceID = requests[_requestID].serviceID;

        // Update HashS2 for the service
        services[serviceID].hashS2 = _hashS2;

        // Update the state of the request
        requests[_requestID].state++;
    }

    function displayHashS2(uint _serviceID) external view returns (bytes32) {
        require(_serviceID > 0 && _serviceID <= serviceCount, "Invalid service ID");
        return services[_serviceID].hashS2;
    }

    function confirmHashS2(uint _requestID) external onlyIfVerdictIsNo(_requestID) {
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");

        // Update the state of the request
        requests[_requestID].state++;
    }
     function declineRequest(uint _requestID) external onlyIfVerdictIsNo(_requestID){
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");

        // Update the state of the request to 4
        requests[_requestID].state = 4;

        // Check if the requester is a client or a service provider
        if (clients[msg.sender].clientAddress != address(0)) {
            // If it is a client, update the verdict to "AbortByClient"
            requests[_requestID].verdict = "AbortByClient";
        } else if (serviceProviders[msg.sender].serviceProviderAddress != address(0)) {
            // If it is a service provider, update the verdict to "AbortByServiceProvider"
            requests[_requestID].verdict = "AbortByServiceProvider";
        }
    }

    function publishS1(uint _requestID, string calldata _s1) external onlyIfVerdictIsNo(_requestID){
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");

        // Find the corresponding service ID from the request
        uint serviceID = requests[_requestID].serviceID;
        requests[_requestID].state++;
        // Update S1 for the service
        services[serviceID].s1 = _s1;
    }

    function displayS1(uint _requestID) external view returns (string memory) {
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");

        // Find the corresponding service ID from the request
        uint serviceID = requests[_requestID].serviceID;

        // Return the S1 parameter of the service
        return services[serviceID].s1;
    }

     function confirmS1(uint _requestID) external onlyIfVerdictIsNo(_requestID) {
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");

        // Update the state of the request
        requests[_requestID].state++;

        // Update the verdict to "Success"
        requests[_requestID].verdict = "Success";
    }

    function resetClient() external {
        require(clients[msg.sender].clientAddress != address(0), "Only clients can reset");

        // Update the requestID of the client to 0
        clients[msg.sender].requestID = 0;
    }

    function resetSp() external {
        require(serviceProviders[msg.sender].serviceProviderAddress != address(0), "Only service providers can reset");

        // Update the requestID of the service provider to 0
        serviceProviders[msg.sender].requestID = 0;
    }
}