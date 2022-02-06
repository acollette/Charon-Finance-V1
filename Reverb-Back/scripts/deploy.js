const hre = require("hardhat");
const { ethers } = require("hardhat");


const cryptocom = '0x6262998Ced04146fA42253a5C0AF90CA02dfd2A3';
const usdc_address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const token_abi = ['function transfer(address,uint256) external',
    'function balanceOf(address) external view returns(uint256)',
    'function approve(address,uint256) external'];

async function getUSD(from, to, amount) {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [from],
    });

    const signer = await ethers.getSigner(from);
    const usdc = new ethers.Contract(usdc_address, token_abi, signer);

    let tx;
    for (let i = 0; i < to.length; i++) {
        tx = await usdc.transfer(to[i], amount);
        await tx.wait();
    }

    await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: [from],
    });

    // console.log('Successfully sent ', amount / 1000000, ' USDC to ', to);
}

async function deploy() {
    const Token = await hre.ethers.getContractFactory("LPToken");
    const token = await Token.deploy();
    await token.deployed();

    console.log('Token deployed successfully at:', token.address)

    const Custodian = await hre.ethers.getContractFactory("Custodian");
    const custodian = await Custodian.deploy(token.address);
    await custodian.deployed()

    console.log('Custodian deployed successfully at:', custodian.address)

    const Repayment = await hre.ethers.getContractFactory("RepaymentPool");
    const repayment = await Repayment.deploy(custodian.address);
    await repayment.deployed()

    console.log('Repayment pool deployed successfully at:', repayment.address)

    await token.transferOwnership(custodian.address);
    console.log('Ownership of LP transferred to custodian');

    return { token: token.address, custodian: custodian.address, repayment: repayment.address };
}

async function main() {
    const addresses = await deploy();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });