// Libraries
import React from "react";
import jazzicon from "jazzicon";
import { ethers, utils } from "ethers";
import { BigNumber } from "utils/bignumber";
import { SUPPORTED_THEMES } from "../theme";
import { Pool, SorSwaps, StringifiedPool, Swap, SwapInput } from "../stores/Proxy";
import { SwapMethods } from "../stores/SwapForm";

// Utils
export const MAX_GAS = utils.bigNumberify('0xffffffff');
export const MAX_UINT = utils.bigNumberify(ethers.constants.MaxUint256);

export enum Scale {
    toWei = '18',
    fromWei = '-18',
}

export function toChecksum(address) {
    return utils.getAddress(address);
}

export const formatDate = timestamp => {
    const date = new Date(timestamp * 1000);
    return `${date.toDateString()} ${addZero(date.getHours())}:${addZero(
        date.getMinutes()
    )}:${addZero(date.getSeconds())}`;
};

export const addZero = value => {
    return value > 9 ? value : `0${value}`;
};

export function bnum(
    val: string | number | utils.BigNumber | BigNumber
): BigNumber {
    return new BigNumber(val.toString());
}

export function scale(input: BigNumber, decimalPlaces: string): BigNumber {
    const scalePow = new BigNumber(decimalPlaces);
    const scaleMul = new BigNumber(10).pow(scalePow);
    return input.times(scaleMul);
}

export function fromWei(val: string | utils.BigNumber | BigNumber): string {
    return utils.formatEther(val.toString());
}

export function toWei(val: string | utils.BigNumber | BigNumber): BigNumber {
    return bnum(utils.parseEther(val.toString()));
}

export function setPropertyToMaxUintIfEmpty(value?): string {
    if (!value || value === 0 || value === '') {
        value = MAX_UINT.toString();
    }
    return value;
}

export function setPropertyToZeroIfEmpty(value?): string {
    if (!value || value === '') {
        value = '0';
    }
    return value;
}

export function checkIsPropertyEmpty(value?) {
    if (!value || value === 0 || value === '') {
        return true;
    }
    return false;
}

export function toAddressStub(address) {
    const start = address.slice(0, 5);
    const end = address.slice(-3);

    return `${start}...${end}`;
}

export function roundValue(value, decimals = 4): string {
    const decimalPoint = value.indexOf('.');
    if (decimalPoint === -1) {
        return value;
    }
    return value.slice(0, decimalPoint + decimals + 1);
}

export function str(value: any): string {
    return value.toString();
}

export function shortenAddress(address, digits = 4) {
    if (!isAddress(address)) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }
    return `${address.substring(0, digits + 2)}...${address.substring(
        42 - digits
    )}`;
}

export function shortenTransactionHash(hash, digits = 4) {
    return `${hash.substring(0, digits + 2)}...${hash.substring(66 - digits)}`;
}

export function isAddress(value) {
    try {
        return ethers.utils.getAddress(value.toLowerCase());
    } catch {
        return false;
    }
}

export function fromFeeToPercentage(value) {
    const etherValue = bnum(fromWei(value));
    const percentageValue = etherValue.times(100);
    return percentageValue;
}

const ETHERSCAN_PREFIXES = {
    1: '',
    3: 'ropsten.',
    4: 'rinkeby.',
    5: 'goerli.',
    42: 'kovan.',
};

export function getEtherscanLink(networkId, data, type) {
    const prefix = `https://${ETHERSCAN_PREFIXES[networkId] ||
        ETHERSCAN_PREFIXES[1]}etherscan.io`;

    switch (type) {
        case 'transaction': {
            return `${prefix}/tx/${data}`;
        }
        case 'address':
        default: {
            return `${prefix}/address/${data}`;
        }
    }
}

export function getQueryParam(windowLocation, name) {
    var q = windowLocation.search.match(
        new RegExp('[?&]' + name + '=([^&#?]*)')
    );
    return q && q[1];
}

export function checkSupportedTheme(themeName) {
    if (themeName && themeName.toUpperCase() in SUPPORTED_THEMES) {
        return themeName.toUpperCase();
    }
    return null;
}

export const copyToClipboard = e => {
    const value = e.target.title.replace(',', '');
    var aux = document.createElement('input');
    aux.setAttribute('value', value);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
    alert(`Value: "${value}" copied to clipboard`);
};

export const etherscanUrl = network => {
    return `https://${network !== 'main' ? `${network}.` : ''}etherscan.io`;
};

export const etherscanAddress = (network, text, address) => {
    return (
        <a
            className="address"
            href={`${etherscanUrl(network)}/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            {text}
        </a>
    );
};

export const etherscanTx = (network, text, tx) => {
    return (
        <a
            href={`${etherscanUrl(network)}/tx/${tx}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            {text}
        </a>
    );
};

export const etherscanToken = (network, text, token, holder = false) => {
    return (
        <a
            href={`${etherscanUrl(network)}/token/${token}${
                holder ? `?a=${holder}` : ''
            }`}
            target="_blank"
            rel="noopener noreferrer"
        >
            {text}
        </a>
    );
};

export const generateIcon = address => {
    return jazzicon(28, address.substr(0, 10));
};

export const getGasPriceFromETHGasStation = () => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject('Request timed out!');
        }, 3000);

        fetch('https://ethgasstation.info/json/ethgasAPI.json').then(
            stream => {
                stream.json().then(price => {
                    clearTimeout(timeout);
                    resolve(price);
                });
            },
            e => {
                clearTimeout(timeout);
                reject(e);
            }
        );
    });
};

// TODO: Issue between new BigNumber() and BigNumber() cast in javascript SOR
export const stringifyPoolData = (pools: Pool[]): StringifiedPool[] => {
    const result: StringifiedPool[] = [];
    pools.forEach(pool => {
        result.push({
            id: pool.id,
            balanceIn: str(pool.balanceIn),
            balanceOut: str(pool.balanceOut),
            weightIn: str(pool.weightIn),
            weightOut: str(pool.weightOut),
            swapFee: str(pool.swapFee),
        });
    });
    return result;
};

// TODO: Issue between new BigNumber() and BigNumber() cast in javascript SOR
export const formatPoolData = (pools: Pool[]): StringifiedPool[] => {
    const result: StringifiedPool[] = [];
    pools.forEach(pool => {
        result.push({
            id: pool.id,
            balanceIn: str(fromWei(pool.balanceIn)),
            balanceOut: str(fromWei(pool.balanceOut)),
            weightIn: str(fromWei(pool.weightIn)),
            weightOut: str(fromWei(pool.weightOut)),
            swapFee: str(fromWei(pool.swapFee)),
        });
    });
    return result;
};

export const printSwapInput = (input: SwapInput) => {
    if (input.method === SwapMethods.EXACT_IN) {
        console.log('exactAmountIn', input);
    } else if (input.method === SwapMethods.EXACT_OUT) {
        console.log('exactAmountOut', input);
    }
};

export const printPoolData = (poolData: Pool[]) => {
    const formatted = formatPoolData(poolData);
    console.log('---Pool Data---');
    console.table(formatted);
};

export const printSwaps = (swapMethod: SwapMethods, swaps: Swap[]) => {
    const result = [];
    console.log('---Swaps---');
     if (swapMethod === SwapMethods.EXACT_IN) {
         swaps.forEach(swap => {
             result.push({
                 balancer: swap[0],
                 amount: swap[1],
                 minAmountOut: swap[2],
                 maxPrice: swap[3]
             })
         })
     } else if (swapMethod === SwapMethods.EXACT_OUT) {
         swaps.forEach(swap => {
             result.push({
                 balancer: swap[0],
                 amount: swap[2],
                 maxAmountIn: swap[1],
                 maxPrice: swap[3]
             })
         })
    }

    console.table(result);
};

export const printSorSwaps = (sorSwaps: SorSwaps) => {
    const formatted = {
        totalOutput: '',
        swaps: [] as any[],
    };
    formatted.totalOutput = sorSwaps.totalOutput.toString();
    sorSwaps.inputAmounts.forEach((value, index) => {
        formatted.swaps.push({
            amount: value.toString(),
            balancer: sorSwaps.selectedBalancers[index],
        });
    });

    console.log('---SorSwaps---');
    console.table(formatted.swaps);
    console.log(`TotalOutput: ${formatted.totalOutput}`);
};