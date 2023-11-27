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
        string hashS;
        string hashS1;
        string name;
        uint serviceID;
        address serviceProviderAddress;
        string s2;
        bytes tempS;
        bytes tempS1;
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

    function registerServiceProvider(string calldata _name1, string calldata _name2, string calldata _hash1,bytes calldata _tempS) external {
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
            hashS1: "",  // Placeholder, replace with the actual hash value
            name: _name2,
            serviceID: serviceCount,
            serviceProviderAddress:msg.sender,
            s2:"",
            tempS:_tempS,
            tempS1:"123"
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
    function setHashS1(uint _requestID, string calldata _hashS1,bytes calldata _tempS1) external onlyIfVerdictIsNo(_requestID){
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");
        // Find the corresponding service ID from the request
        uint serviceID = requests[_requestID].serviceID;

        // Update HashS2 for the service
        services[serviceID].hashS1 = _hashS1;
        services[serviceID].tempS1=_tempS1;

        // Update the state of the request
        requests[_requestID].state++;
    }

    function displayHashS1(uint _serviceID) external view returns (bytes memory) {
        require(_serviceID > 0 && _serviceID <= serviceCount, "Invalid service ID");
        return services[_serviceID].tempS1;
    }

    function confirmHashS1(uint _requestID) external onlyIfVerdictIsNo(_requestID) {
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

    function publishS2(uint _requestID, string calldata _s2) external onlyIfVerdictIsNo(_requestID){
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");

        // Find the corresponding service ID from the request
        uint serviceID = requests[_requestID].serviceID;
        requests[_requestID].state++;
        // Update S1 for the service
        services[serviceID].s2 = _s2;
    }

    function displayS2(uint _requestID) external view returns (string memory) {
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");

        // Find the corresponding service ID from the request
        uint serviceID = requests[_requestID].serviceID;

        // Return the S1 parameter of the service
        return services[serviceID].s2;
    }

     function confirmS2(uint _requestID) external onlyIfVerdictIsNo(_requestID) {
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");

        // Update the state of the request
        requests[_requestID].state++;

        // Update the verdict to "Success"
        requests[_requestID].verdict = "Success";
    }

    // function resetClient() external {
    //     require(clients[msg.sender].clientAddress != address(0), "Only clients can reset");

    //     // Update the requestID of the client to 0
    //     clients[msg.sender].requestID = 0;
    // }

    // function resetSp() external {
    //     require(serviceProviders[msg.sender].serviceProviderAddress != address(0), "Only service providers can reset");

    //     // Update the requestID of the service provider to 0
    //     serviceProviders[msg.sender].requestID = 0;
    // }
    function resetUser() external {
        if (clients[msg.sender].clientAddress != address(0)) {
            // If it is a client, update the verdict to "AbortByClient"
            clients[msg.sender].requestID = 0;
        } else if (serviceProviders[msg.sender].serviceProviderAddress != address(0)) {
            // If it is a service provider, update the verdict to "AbortByServiceProvider"
            serviceProviders[msg.sender].requestID = 0;
        }
    }
    
    function computeVerdict(bytes calldata _s, uint _requestID) external returns (string memory) {
        require(_requestID > 0 && _requestID <= requestCount, "Invalid request ID");

        // Find the corresponding service ID from the request
        uint serviceID = requests[_requestID].serviceID;

        // Compute the hashS for the service
        requests[_requestID].state++;

        //string memory computedHashS = services[serviceID].hashS;
        bytes memory computedTemp = services[serviceID].tempS;
        if (_s.length != computedTemp.length) {
            requests[_requestID].verdict = "MaliciousClient";
            return "Yes";
        }

        for (uint256 i = 0; i < _s.length; i++) {
            if (_s[i] != computedTemp[i]) {
                requests[_requestID].verdict = "MaliciousServiceProvider";
                return "No";
            }
        }
        requests[_requestID].verdict = "MaliciousClient";
        return "Yes";
        
        // // Compare the computed hashS with the input string _s
        // if (keccak256(abi.encodePacked(computedHashS)) == keccak256(abi.encodePacked(_s))) {
        //     requests[_requestID].verdict = "MaliciousClient";
        //     return "Yes"; // Match
        // } else {
        //     requests[_requestID].verdict = "MaliciousServiceProvider";
        //     return "No"; // No match
        // }
    }
}