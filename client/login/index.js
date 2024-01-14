import Web3 from 'web3';
import contractInfo from '../../contracts/Voting.sol';
const web3 = new Web3(Web3.givenProvider);

// address of the contract
const contractAddress = contractInfo.networks['5777'].address;

// TODO: thats not what the IDE proposed me, try .contractAbi
const contractABI = contractInfo.abi;

// Get a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

export function submitForm(){
    var address = document.getElementById("address").value;
    var errorMessageElement = document.getElementById("error-message");
    if(!isValidBlockchainAddress(address)){
        errorMessageElement.innerHTML = "Input is not valid ethereum address.";
        errorMessageElement.style.display = "block";
        return;
    }
    safeAddressInContract(address);
    window.location.href = '../voting/index.html';
    console.log("address: " + address);
}

function isValidBlockchainAddress(address) {
    // eth address consists of 40 hexadecimal signs
    const ethAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;

    return ethAddressRegex.test(address);
}

function safeAddressInContract(address){
    contract.methods.safeUserAddress().send({ from: address })
        .on('transactionHash', function (hash) {
            console.log('Transaction Hash:', hash);
        })
        .on('confirmation', function (confirmationNumber, receipt) {
            console.log('Confirmation:', confirmationNumber, receipt);
        })
        .on('receipt', function (receipt) {
            console.log('Receipt:', receipt);
        })
        .on('error', function (error) {
            console.error('Error:', error);
        });
}

// document.addEventListener('DOMContentLoaded', function () {
//     document.querySelector('button').addEventListener('click', submitForm);
// });