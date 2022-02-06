
import { ethers } from 'ethers'
import { round } from '~/utilities/utils'

const multiplicator = 10**6

const usdcAddress = '0x2058a9d7613eee744279e3856ef0eada5fcbaa7e';
const lpAddress = '0xD5Cc83402802577352E7D2aA0eaDE9925f221cE6';

const tokenAbi = ['function transfer(address,uint256) external',
    'function balanceOf(address) external view returns(uint256)',
    'function approve(address,uint256) external'];

const custodianAbi = ['function deposit(uint256 amount, address onBehalfOf) external',
    'function redeem(uint256 lpAmount) external',
    'function getPoolData(address user) external view returns (address, uint256, uint256, uint256, uint256, uint256)',
    'function calculateUsdcToLp(uint256 usdcAmount) external view returns (uint256)',
    'function aavePool() external view returns(address)',
    'function repaymentPool() external view returns(address)'];

const repaymentAbi = ['function dealList(uint256) external view returns(uint256,uint256,uint256,uint256,uint256,uint16,uint16,string)',
    'function getLastDealId() external view returns(uint256)',
    'function createDeal(uint256,uint256,uint256,uint16,uint16,string memory) external']

const poolAddress = '0x8341FC22C1935B8443BB4b5AC26a1dC99e608940'
const repaymentAddress = '0x2c607cF62a1482550311F03Dc3C13631AFEF10e2'


async function fetchPoolData(poolAddress, userAddress, signer) {
    const pool = new ethers.Contract(poolAddress, custodianAbi, signer);
    const data = await pool.getPoolData(userAddress);

    return data;
}

async function fetchActiveDeals(repaymentAddress, signer) {
    const repayment = new ethers.Contract(repaymentAddress, repaymentAbi, signer);
    const dealId = await repayment.getLastDealId();

    const dealList = [];
    for (let i = 1; i <= dealId; i++) {
        const deal = await repayment.dealList(i);
        if (deal[1] > deal[0]) {
            dealList.push(deal);
        }
    }
    return dealList;
}

const roundAmount = (amount) => {
    return Math.round(amount * multiplicator)
}

export async function _approveUsdc(amount, signer) {
    const usdc = new ethers.Contract(usdcAddress, tokenAbi, signer);
    const tx = await usdc.approve(poolAddress, roundAmount(amount));
    await tx.wait();
}

export async function _approveLp(lpAmount, signer) {
    const lp = new ethers.Contract(lpAddress, tokenAbi, signer);
    const tx = await lp.approve(poolAddress, roundAmount(lpAmount).toString());
    await tx.wait();
}

export async function _usdcBalance(signer) {
    const usdc = new ethers.Contract(usdcAddress, tokenAbi, signer);
    const signerAddress = await signer.getAddress()
    return (await usdc.balanceOf(signerAddress)).toNumber() / multiplicator;
}

export async function _deposit(amount, signer) {
    const pool = new ethers.Contract(poolAddress, custodianAbi, signer);
    const signerAddress = await signer.getAddress()
    const tx = await pool.deposit(roundAmount(amount), signerAddress);
    await tx.wait();
}

export async function _withdraw(lpAmount, signer) {
    const pool = new ethers.Contract(poolAddress, custodianAbi, signer);
    const tx = await pool.redeem(roundAmount(lpAmount).toString());
    await tx.wait();
}

export async function _fetchPool(signer) {
    const signerAddress = await signer.getAddress()
    const data = await fetchPoolData(poolAddress, signerAddress, signer);
    const deals = await fetchActiveDeals(repaymentAddress, signer);
    return formatPoolData(data, deals)
}

function formatPoolData(data, deals) {
    const formattedDeals = deals.slice(2).map((deal) => { // HACK: HIDE TWO FIRST DEALS
        return {
            id: deal[4].toNumber(),
            customer: deal[7],
            amount: deal[1].toNumber() / multiplicator,
            apr: deal[6] / 1000,
            currency: 'USDC',
            pool: data[0]
        }
    });

    const dealsApr = 0.082
    const dealBalance =  (data[1].toNumber() - data[2].toNumber()) / multiplicator
    const unallocatedApr = 0.047
    const unallocatedBalance = data[2].toNumber() / multiplicator
    const totalBalance = data[1].toNumber() / multiplicator
    const apr = round((dealsApr * dealBalance + unallocatedApr * unallocatedBalance) / totalBalance, 4)

    const pool = {
        address: data[0],
        name: 'Wellness Pool',
        userLpBalance: data[5].toNumber() / multiplicator,
        totalLpBalance: data[4].toNumber() / multiplicator,
        totalBalance,
        dealBalance,
        unallocatedBalance,
        apr,
        dealsApr,
        unallocatedApr,
        currency: 'USDC',
        riskClass: 'A',
        deals: formattedDeals
    }

    return pool;
}
