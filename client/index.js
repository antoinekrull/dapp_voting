import Web3 from 'web3';
import contractInfo from '../build/contracts/Voting.json';
const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

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
    window.location.href = './voting.html';
}    

function isValidBlockchainAddress(address) {
    // eth address consists of 40 hexadecimal signs
    const ethAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;

    return ethAddressRegex.test(address);
}

function safeAddressInContract(address){
    contract.methods.safeUserAddress(address).send({ from: address })
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

async function getOracleKey() {
    try {
      const accounts = await web3.eth.getAccounts();
      // is the address of the browser who uses the contract alwyas at accounts[0]?
      const senderAddress = accounts[0];

      const key = await contract.methods.getKey().call({ from: senderAddress });
  
      console.log('Oracle Key:', key);
      return key;
    } catch (error) {
      console.error('Error during the oracle key request:', error);
    }
}

export const getAndSetOracleKey = async () => {
    try {
        const oracleKey = await getOracleKey();

        document.getElementById('statekey').value = oracleKey;

        console.log('Oracle Key set as input:', oracleKey);
    } catch (error) {
        console.error('Error during setting the oracleKey as input:', error);
    }
}
