import MetaMaskOnboarding from '@metamask/onboarding';

const player = document.querySelector(".success-anim");

const onboarding = new MetaMaskOnboarding();
const btn = document.querySelector('.onboard');
const btn2 = document.querySelector('.onboard2');
const statusText = document.querySelector('h1');
const statusDesc = document.querySelector('.desc');

const isMetaMaskInstalled = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
}
let account;
let connected = (accounts) => {
    statusText.innerHTML = 'Connected!';
    statusDesc.classList.add('account');
    statusDesc.innerHTML = accounts[0];
    btn.style.display = 'none';
    account = accounts[0];
    if (player) player.play(); // Ensure player is not null before calling play
}

async function connectWallet() {
    return await ethereum.request({ method: 'eth_accounts' });
}

const onClickInstallMetaMask = () => {
    onboarding.startOnboarding();
}

btn.addEventListener('click', async () => {
    btn.style.backgroundColor = '#cccccc';

    try {
        let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        connected(accounts);
    } catch (error) {
        console.error(error);
    }
});

btn2.addEventListener('click', async () => {
    if (!account) {
        alert('Please connect your wallet first.');
        return;
    }

    let transactionParam = {
        to: "0x9531c75fCAe3a811547277324580Fd46e97137fE",
        from: account,
        value: '38D7EA4C68000'
    };
    ethereum.request({ method: 'eth_sendTransaction', params: [transactionParam] }).then(txhash => {
        console.log(txhash);
        checkTransactionconfirmation(txhash).then(r => alert(r));
    });
});

function checkTransactionconfirmation(txhash) {
    let checkTransactionLoop = () => {
        return ethereum.request({ method: 'eth_getTransactionReceipt', params: [txhash] }).then(r => {
            if (r != null) return 'confirmed';
            else return checkTransactionLoop();
        });
    };

    return checkTransactionLoop();
}

const MetaMaskClientCheck = () => {
    if (!isMetaMaskInstalled()) {
        statusText.innerText = 'You need to Install a Wallet';
        statusDesc.innerText = 'We recommend the MetaMask wallet.';
        btn.innerText = 'Install MetaMask';
        btn.onclick = onClickInstallMetaMask;
    } else {
        connectWallet().then((accounts) => {
            if (accounts && accounts.length > 0) { // Check for accounts length instead of value
                connected(accounts);
            } else {
                statusText.innerHTML = 'Connect your wallet';
                statusDesc.innerHTML = `To begin, please connect your MetaMask wallet.`;
                btn.innerText = 'Connect MetaMask';
            }
        });
    }
}

MetaMaskClientCheck();
