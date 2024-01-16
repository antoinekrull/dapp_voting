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
    var statekey = document.getElementById("statekey").value;
    var errorMessageElement = document.getElementById("error-message");
    // length of the oracle key
    const expectedLength = 64;
    if(statekey.length != expectedLength){
        errorMessageElement.innerHTML = "Input is not valid oracle key.";
        errorMessageElement.style.display = "block";
        return;
    }
    safeStateKeyInContract(statekey);
    window.location.href = './voting.html';
}

function safeStateKeyInContract(statekey){
    contract.methods.safeStateKey(statekey).send({ from: address })
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
