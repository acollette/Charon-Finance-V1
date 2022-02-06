
const cryptocom = '0x6262998Ced04146fA42253a5C0AF90CA02dfd2A3';
const usdc_address = '0x2058a9d7613eee744279e3856ef0eada5fcbaa7e';

const token_abi = ['function transfer(address,uint256) external',
    'function balanceOf(address) external view returns(uint256)',
    'function approve(address,uint256) external'];

const custodian_abi = ['function deposit(uint256 amount, address onBehalfOf) external',
    'function redeem(uint256 lpAmount) external',
    'function getPoolData(address user) external view returns (address, uint256, uint256, uint256, uint256, uint256)',
    'function calculateUsdcToLp(uint256 usdcAmount) external view returns (uint256)',
    'function aavePool() external view returns(address)',
    'function repaymentPool() external view returns(address)'];

const repayment_abi = ['function dealList(uint256) external view returns(uint256,uint256,uint256,uint256,uint256,uint16,uint16,string)',
    'function getLastDealId() external view returns(uint256)',
    'function createDeal(uint256,uint256,uint256,uint16,uint16,string memory) external']

const faucet_abi = ['function pullTo(address dest, uint amt) external']

async function fetchPoolData(pool_address, user_address, signer) {
    const pool = new ethers.Contract(pool_address, custodian_abi, signer);
    const data = await pool.getPoolData(user_address);

    return data;
}

async function fetchActiveDeals(repayment_address, signer) {
    const repayment = new ethers.Contract(repayment_address, repayment_abi, signer);
    const dealId = await repayment.getLastDealId();

    let deal_list = [];
    for (let i = 1; i <= dealId; i++) {
        const deal = await repayment.dealList(i);
        if (deal[1] > deal[0]) {
            deal_list.push(deal);
        }
    }
    return deal_list;
}

async function deposit(pool_address, amount, onBehalfOf, signer) {
    const pool = new ethers.Contract(pool_address, custodian_abi, signer);
    const tx = await pool.deposit(amount, onBehalfOf);
    await tx.wait();
}

async function withdraw(pool_address, lpAmount, signer) {
    const pool = new ethers.Contract(pool_address, custodian_abi, signer);
    const tx = await pool.deposit(lpAmount);
    await tx.wait();
}

async function getAavePoolAddress(pool_address, signer) {
    const pool = new ethers.Contract(pool_address, custodian_abi, signer);
    return await pool.aavePool();
}


async function getRepaymentPoolAddress(pool_address, signer) {
    const pool = new ethers.Contract(pool_address, custodian_abi, signer);
    return await pool.repaymentPool();
}

async function getAaveAPY(aave_address, signer) {
    const aavePool = new ethers.Contract(aave_address, aave_abi, signer);
    [, liquidityIndex, variableBorrowIndex,
        currentLiquidityRate, currentVariableBorrowRate,
        currentStableBorrowRate, ,
        aTokenAddress, stableDebtTokenAddress,
        variableDebtTokenAddress, ,] = await aavePool.getReserveData(usdc_address);
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

    await repayment.createDeal(1000, 100000000, 150000000, 12, 100, 'Notion SaaS Ltd.');

    await token.transferOwnership(custodian.address);
    console.log('Ownership of LP transferred to custodian');

    return { token: token, custodian: custodian, repayment: repayment };
}

async function setupMock(contracts) {

    await repayment.createDeal(1000, 100000000, 150000000, 12, 100, 'Notion SaaS Ltd.');
    await repayment.createDeal(10000, 100000000, 120000000, 6, 120, 'Yoga Fitness Ltd.');
}

async function fetchPool(pool_address, user_address, signer) {
    const repayment_address = await getRepaymentPoolAddress(pool_address, signer);
    const data = await fetchPoolData(pool_address, user_address, signer);
    const deals = await fetchActiveDeals(repayment_address, signer);

    let dealList = []

    deals.map((deal) => {
        return {
            id: deal[4].toNumber(),
            customer: deal[7],
            amount: deal[1].toNumber(),
            apr: deal[6].toNumber(),
            currency: 'USDC',
            pool: data[0]
        }
    });

    let pool = {
        address: data[0],
        name: 'Main pool',
        userLpBalance: data[5].toNumber(),
        totalLpBalance: data[4].toNumber(),
        totalBalance: data[1].toNumber(),
        dealBalance: data[1].toNumber() - data[2].toNumber(),
        unallocatedBalance: data[2].toNumber(),
        apr: 80,
        dealApr: 122,
        unallocatedApr: 30,
        currency: 'USDC',
        riskClass: 'A',
        deals: dealList
    }

    return pool;
}

function formatPoolData(data, deals) {
    deals.map((deal) => {
        return {
            id: deal[4].toNumber(),
            customer: deal[7],
            amount: deal[1].toNumber(),
            apr: deal[6],
            currency: 'USDC',
            pool: data[0]
        }
    });

    let pool = {
        address: data[0],
        name: 'Main pool',
        userLpBalance: data[5].toNumber(),
        totalLpBalance: data[4].toNumber(),
        totalBalance: data[1].toNumber(),
        dealBalance: data[1].toNumber() - data[2].toNumber(),
        unallocatedBalance: data[2].toNumber(),
        apr: 80,
        dealApr: 122,
        unallocatedApr: 30,
        currency: 'USDC',
        riskClass: 'A',
        deals: deals
    }

    return pool;
}

async function main() {
    [deployer, addr1, addr2] = await ethers.getSigners();

    const contracts = {
        token: '0xD5Cc83402802577352E7D2aA0eaDE9925f221cE6',
        custodian: '0x8341FC22C1935B8443BB4b5AC26a1dC99e608940',
        repayment: '0x2c607cF62a1482550311F03Dc3C13631AFEF10e2'
    };
    //await deploy();
    const data = await fetchPoolData(contracts.custodian, deployer.address, deployer);
    const deals = await fetchActiveDeals(contracts.repayment, deployer);

    const aavePool = await getAavePoolAddress(contracts.custodian, deployer);
    console.log('Deals:', deals);
    console.log('Pool data:', data);

    console.log(formatPoolData(data, deals));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });