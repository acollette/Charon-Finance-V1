import { ethers } from "ethers";
import Web3Modal from "web3modal";
export const getSigner = async () => {
  const web3Modal = new Web3Modal({
    network: 'mumbai',
    cacheProvider: true,
  })
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  return provider.getSigner()
}

export const randomId = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const sample = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]
export const round = (num: number, decimals: number = 2) => Math.round(num * (10**decimals)) / (10**decimals)
export const randomBetween = (num1: number, num2: number, decimals: number = 2) => round(num1 + Math.random() * (num2 - num1), decimals)
