const hre = require("hardhat");
const { ethers } = require("hardhat");

const cryptocom = '0x6262998Ced04146fA42253a5C0AF90CA02dfd2A3';

const usdc_address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const dai_address = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const usdt_address = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

const curve_3pool = '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7';
const curve_3pool_lp = '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490';

const token_abi = ['function transfer(address,uint256) external',
  'function balanceOf(address) external view returns(uint256)',
  'function approve(address,uint256) external'];

const curve_abi = ['function coins(uint256) external view returns(address)',
  'function balances(uint256) external view returns(uint256)',
  'function calc_token_amount(uint256[3], bool) external view returns(uint256)',
  'function add_liquidity(uint256[3],uint256) external returns(uint256)'];

export async function getUSD(from, to, amount) {
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

  console.log('Successfully sent ', amount, ' USDC/USDT/DAI to ', to);
}

async function approveUSD(from, to) {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [from],
  });

  const signer = await ethers.getSigner(from);

  const usdc = new ethers.Contract(usdc_address, token_abi, signer);
  const dai = new ethers.Contract(dai_address, token_abi, signer);
  const usdt = new ethers.Contract(usdt_address, token_abi, signer);

  let tx = await usdc.approve(to, ethers.constants.MaxUint256);
  tx = await usdt.approve(to, ethers.constants.MaxUint256);
  tx = await dai.approve(to, ethers.constants.MaxUint256);

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [from],
  });

  console.log('Approval from', from, 'to', to)
}

async function main() {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [cryptocom],
  });

  const owner = await ethers.getSigner(cryptocom);
  const usdc = new ethers.Contract(usdc_address, token_abi, owner);
  console.log(await usdc.balanceOf(cryptocom));
  /*
  await approveUSD(owner.address, curve_3pool)

  const pool = new ethers.Contract(curve_3pool, curve_abi, owner);
  const amounts = [ethers.BigNumber.from("100"), ethers.BigNumber.from("1426935661000"), ethers.BigNumber.from("100")];

  const expected = (await pool.calc_token_amount(amounts, true)).div('100').mul('99');
  console.log(expected);
  for (let i = 0; i < 3; i++) {
    console.log(await pool.coins(i))
  }
  const lptoken = new ethers.Contract(curve_3pool_lp, token_abi, owner);
  console.log(await lptoken.balanceOf(owner.address))
  /*
    tx = await pool.add_liquidity(amounts, expected);
    await tx.wait()
  
  console.log(await lptoken.balanceOf(owner.address))*/

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


