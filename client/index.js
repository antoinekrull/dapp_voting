import Web3 from 'web3';
import contractInfo from '../build/contracts/Voting.json';
let userAccount;
ethereum.request({ method: 'eth_requestAccounts' })
  .then(accounts => {
    // Handle the user's accounts
    userAccount = accounts[0];
  })
  .catch(error => {
    // Handle error
    console.error(error);
  });
const web3 = new Web3(window.ethereum);

// address of the contract
const contractAddress = contractInfo.networks['5777'].address;

// TODO: thats not what the IDE proposed me, try .contractAbi
const contractABI = contractInfo.abi;
// Get a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

export async function submitForm(){
    var statekey = document.getElementById("statekey").value;
    var errorMessageElement = document.getElementById("error-message");
    // length of the oracle key + 2 for leading 0x
    const expectedLength = 66;
    if(statekey.length != expectedLength){
        errorMessageElement.innerHTML = "Input is not valid oracle key.";
        errorMessageElement.style.display = "block";
        return;
    }
    await safeStateKeyInContract(statekey);
    window.location.href = './voting.html';
}

async function safeStateKeyInContract(statekey){
    console.log(userAccount)
    contract.methods.createVoter(statekey).send({ from: userAccount })
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

      const key = await contract.methods.getKey().call({ from: userAccount })
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
