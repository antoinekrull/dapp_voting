// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.8.0;


contract MockOracle {

    function generateKeyUsingAddress(address userAddress) public view returns (bytes32) {
        require(userAddress != address(0), "Invalid address");

        // Combining user's address, current block's hash, and current timestamp
        // to generate a pseudo-random bytes32 value
        return keccak256(
            abi.encodePacked(
                userAddress,
                blockhash(block.number - 1),
                block.timestamp
            )
        );
    }
}
