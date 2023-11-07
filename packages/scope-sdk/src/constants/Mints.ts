import { SupportedToken } from './SupportedToken';
import { SolanaCluster } from '@hubbleprotocol/hubble-config';

/**
 * @deprecated Deprecated since version 2.2.47 - please use {@link getOraclePrices} or the respective SDK client instead.
 * @see [hubble-sdk]{@link https://github.com/hubbleprotocol/hubble-common/blob/0512e85c5a816a557fe7feaf55981cabcd992476/packages/hubble-sdk/src/Hubble.ts#L722} getAllPrices method
 * @see [kamino-sdk]{@link https://github.com/hubbleprotocol/hubble-common/blob/0be269d4fdb3dbadbbd8c7fcca68c6b1928d445a/packages/kamino-sdk/src/Kamino.ts#L1717} getAllPrices method
 * @see [kamino-lending-sdk]{@link https://github.com/hubbleprotocol/kamino-lending-sdk/blob/17a48b6bb21945d2d799d31d6f0b20104e8c83ac/src/classes/market.ts#L759} getAllScopePrices method
 * @description Scope mint config
 */
export const ScopeMints: { cluster: SolanaCluster; mints: { token: SupportedToken; mint: string }[] }[] = [
  {
    cluster: 'mainnet-beta',
    mints: [
      { token: 'SOL', mint: 'So11111111111111111111111111111111111111112' },
      { token: 'ETH', mint: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs' },
      { token: 'BTC', mint: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E' },
      { token: 'wBTC', mint: '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh' },
      { token: 'SRM', mint: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt' },
      { token: 'RAY', mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R' },
      { token: 'FTT', mint: 'AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3' },
      { token: 'MSOL', mint: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So' },
      { token: 'scnSOL', mint: '5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm' },
      { token: 'BNB', mint: '9gP2kCy3wA1ctvYWQk75guqXuHfrEomqydHLtcTCqiLa' },
      { token: 'AVAX', mint: 'AUrMpCDYYcPuHhyNX8gEEqbmDPFUpBpHrNW3vPeCFn5Z' },
      { token: 'daoSOL', mint: 'GEJpt3Wjmr628FqXxTgxMce1pLntcPV4uFi8ksxMyPQh' },
      { token: 'USDH', mint: 'USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX' },
      { token: 'STSOL', mint: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj' },
      { token: 'cSOL', mint: '5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV' },
      { token: 'cETH', mint: 'FbKvdbx5h6F86h1pZuEqv7FxwmsVhJ88cDuSqHvLm6Xf' },
      { token: 'cBTC', mint: 'Gqu3TFmJXfnfSX84kqbZ5u9JjSBVoesaHjfTsaPjRSnZ' },
      { token: 'cMSOL', mint: '3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h' },
      { token: 'wstETH', mint: 'ZScHuTtqZukUrtZS43teTKGs2VqkKL8k4QCouR2n6Uo' },
      { token: 'LDO', mint: 'HZRCwxP2Vq9PCpPXooayhJ2bxTpo5xfpQrwB1svh332p' },
      { token: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
      { token: 'cUSDC', mint: '993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk' },
      { token: 'USDT', mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' },
      { token: 'ORCA', mint: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE' },
      { token: 'MNDE', mint: 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey' },
      { token: 'HBB', mint: 'HBB111SCo9jkCejsZfz8Ec8nH7T6THF8KEKSnvwT6XK6' },
      { token: 'cORCA', mint: 'E9LAZYxBVhJr9Cdfi9Tn4GSiJHDWSZDsew5tfgJja6Cu' },
      { token: 'cSLND', mint: 'D3Cu5urZJhkKyNZQQq2ne6xSfzbXLU4RrywVErMA2vf8' },
      { token: 'cSRM', mint: '4CxGuD2NMr6zM8f18gr6kRhgd748pnmkAhkY1YJtkup1' },
      { token: 'cRAY', mint: '2d95ZC8L5XP6xCnaKx8D5U5eX6rKbboBBAwuBLxaFmmJ' },
      { token: 'cFTT', mint: 'DiMx1n2dJmxqFtENRPhYWsqi8Mhg2p39MpTzsm6phzMP' },
      { token: 'cSTSOL', mint: 'QQ6WK86aUCBvNPkGeYBKikk15sUg6aMUEi5PTL6eB4i' },
      { token: 'SLND', mint: 'SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp' },
      { token: 'DAI', mint: 'EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o' },
      { token: 'JSOL', mint: '7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn' },
      { token: 'USH', mint: '9iLH8T7zoWhY7sBmj1WK9ENbWdS1nL8n9wAxaeRitTa6' },
      { token: 'UXD', mint: '7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT' },
      { token: 'HDG', mint: '5PmpMzWjraf3kSsGEKtqdUsCoLhptg4yriZ17LKKdBBy' },
      { token: 'DUST', mint: 'DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ' },
      { token: 'kUSDHUSDCOrca', mint: '5BmZgW7dk1kximGfn7MPvDigp3yRmgT64jS9Skdq4nPY' },
      { token: 'kSOLSTSOLOrca', mint: 'C7RpHABBJjfkmizgnR2MRbpfEF454Rb18XC6RmBC8cGg' },
      { token: 'kUSDCUSDTOrca', mint: 'CHdEG9MWBVT1aveiFSMMUDWvo3D42EBdHxT9q9BNZWLu' },
      { token: 'kUSHUSDCOrca', mint: 'GnsoaSc8oi53oC2Nq7F4w4ke8rSy2HgNeuhSSVxnVdXJ' },
      { token: 'USDR', mint: 'USDrbBQwQbQ2oWHUPfA8QBHcyVxKUq1xHyXsSLKdUq2' },
      { token: 'RATIO', mint: 'ratioMVg27rSZbSvBopUvsdrGUzeALUfFma61mpxc8J' },
      { token: 'UXP', mint: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M' },
      { token: 'kUXDUSDCOrca', mint: '4G9USgnbg6fDTQ5AUfpCjM89zqbzWj32xfqvsaAu66DM' },
      { token: 'JITOSOL', mint: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn' },
      { token: 'BONK', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
      { token: 'SAMO', mint: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' },
      { token: 'bSOL', mint: 'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1' },
      { token: 'LaineSOL', mint: 'LAinEtNLgpmCP9Rvsf5Hn8W6EhNiKLZQti1xfWMLy6X' },
      { token: 'HADES', mint: 'BWXrrYFhT7bMHmNBFoQFWdsSgA3yXoAnMhDK6Fn1eSEn' },
      { token: 'RLB', mint: 'RLBxxFkseAZ4RgJH3Sqn8jXxhmGoz9jWxDNJMh8pL7a' },
      { token: 'CGNTSOL', mint: 'CgnTSoL3DgY9SFHxcLj6CgCgKKoTBr6tp4CPAEWy25DE' },
      { token: 'HXRO', mint: 'HxhWkVpk5NS4Ltg5nij2G671CKXFRKPK8vy271Ub4uEK' },
      { token: 'USDCet', mint: 'A9mUU4qviSctJVPJdBJWkb28deg915LYJKrzQ19ji3FM' },
      { token: 'HNT', mint: 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux' },
      { token: 'MOBILE', mint: 'mb1eu7TzEc71KxDpsmsKoucSSuuoGLv1drys1oP2jh6' },
      { token: 'IOT', mint: 'iotEVVZLEywoTn1QdwNPddxPWszn3zFhEot3MfL9fns' },
      { token: 'NANA', mint: 'HxRELUQfvvjToVbacjr9YECdfQMUqGgPYB68jVDYxkbr' },
      { token: 'STEP', mint: 'StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT' },
      { token: 'FORGE', mint: 'FoRGERiW7odcCBGU1bztZi16osPBHjxharvDathL5eds' },
      { token: 'TBTC', mint: '6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU' },
      { token: 'COCO', mint: '74DSHnK1qqr4z1pXjLjPAVi8XFngZ635jEVpdkJtnizQ' },
      { token: 'STYLE', mint: '3FHpkMTQ3QyAJoLoXVdBpH4TfHiehnL2kXmv9UXBpYuF' },
      { token: 'CHAI', mint: '3jsFX1tx2Z8ewmamiwSU851GzyzM2DJMq7KWW5DM8Py3' },
      { token: 'T', mint: '4Njvi3928U3figEF5tf8xvjLC5GqUN33oe4XTJNe7xXC' },
      { token: 'BLZE', mint: 'BLZEEuZUBVqFhj8adcCFPJvPVCiCyVmh3hkJMrU8KuJA' },
      { token: 'EUROE', mint: '2VhjJ9WxaGC3EZFwJG9BDUs9KxKCAjQY4vgd1qxgYWVg' },
      { token: 'kSOLBSOLOrca', mint: '9HB4kAMLSYfGFfN142DKMyPyHyZQ8pXF8M1STbDudodY' },
      { token: 'kMNDEMSOLOrca', mint: 'DX7LazwuD7tE5Ub38hkGBmevGQFYPJT4UbWMjjqrP7fP' },
      { token: 'kSTSOLUSDCOrca', mint: 'GxRNe8dB8iksy1GcNH3du152QdoDoeer9wYMKnCnWTtk' },
      { token: 'kUSDHUSDTOrca', mint: '51q54r8v43dYG3PZo4hDg7PSaTxBcq69QSb8cCP7UznX' },
      { token: 'kSOLJITOSOLOrca', mint: 'Dk2X1HCbwJae44P7FpqdFoeT6LEw4JVyyHvZMHUzHWbi' },
      { token: 'kbSOLMSOLOrca', mint: '9Lp1QjKTWCLhaVi73UbXMcgnvTAgn7HkgGddeynxnufQ' },
      { token: 'kMSOLJITOSOLOrca', mint: 'YuQA2srzPKt4dLVoWdiqGXkU5GgAErdNB2yMsecRYdW' },
      { token: 'kSOLUSDCOrca', mint: '8aRT9m1wJ63mnFxeZ3qyBCrwbNMuPKPCEYxpXB41WzYd' },
      { token: 'kJITOSOLUSDCOrca', mint: '8Ak9JgLeTo6ubG5vfpuAR59ANpGjTB8HFDwYjpZbkPeB' },
      { token: 'LST', mint: 'LSTxxxnJzKDFSLr4dUkPcmCf5VyryEqzPLz5j4bpxFp' },
      { token: 'kSOLJITOSOLRaydium', mint: 'GYiUmJ8reqYAdTQtx6CRFawHqPXx9yzkUFvaUVE8PskP' },
      { token: 'kSOLMSOLRaydium', mint: '3Fb5DMRWoBLWD36Lp4BtG41LaFjVeEJNCH9YLNPYdVqj' },
      { token: 'RNDR', mint: 'J39SiMc21133mMNZ5K46Z4ZwFa2oQrKHBh8iujqckdxN' },
      { token: 'RENDER', mint: 'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof' },
    ],
  },
  {
    cluster: 'devnet',
    mints: [
      { token: 'USDC', mint: 'HEzfH7PCNSCU92zdk3iaKG4E9hQTErfgVGvqgywEvPzu' },
      { token: 'USDH', mint: 'kfZGSThBdZbZY6cDSHP7NmCWa6D2hFc5kjBuGHREzZ3' },
      { token: 'SOL', mint: 'So11111111111111111111111111111111111111112' },
      { token: 'ETH', mint: '2DVyKwW17MxDXaLhWpWXtbVa64JBwaHmLJ1txXNJgRGi' },
      { token: 'BTC', mint: '6cA8Y9Jm2jW2rvUcpBHC9kUjctw9dMF3gPfWZd5bcr57' },
      { token: 'MSOL', mint: '2wMQTELEgEcK7V3gwZBH58WvGcRZsyaWNpebqyFugGKe' },
      { token: 'STSOL', mint: 'ESba8sT1R7WPiE3weBU1u6UqEmXRuM8Rs1LLvXayEizf' },
      { token: 'USDT', mint: 'AcU8CfJiLEBn1x7Cgx8atX6DdebmdQtNSsJBkQyf6Q4L' },
    ],
  },
];

/**
 * @deprecated Deprecated since version 2.2.47 - please use {@link getOraclePrices} or the respective SDK client instead.
 * @see [hubble-sdk]{@link https://github.com/hubbleprotocol/hubble-common/blob/0512e85c5a816a557fe7feaf55981cabcd992476/packages/hubble-sdk/src/Hubble.ts#L722} getAllPrices method
 * @see [kamino-sdk]{@link https://github.com/hubbleprotocol/hubble-common/blob/0be269d4fdb3dbadbbd8c7fcca68c6b1928d445a/packages/kamino-sdk/src/Kamino.ts#L1717} getAllPrices method
 * @see [kamino-lending-sdk]{@link https://github.com/hubbleprotocol/kamino-lending-sdk/blob/17a48b6bb21945d2d799d31d6f0b20104e8c83ac/src/classes/market.ts#L759} getAllScopePrices method
 * @description Map scope token name to mint
 * @param token
 * @param cluster
 */
export function scopeTokenToMint(token: SupportedToken, cluster: SolanaCluster = 'mainnet-beta') {
  return ScopeMints.find((x) => x.cluster === cluster)?.mints?.find((x) => x.token === token)?.mint;
}

/**
 * @deprecated Deprecated since version 2.2.47 - please use {@link getOraclePrices} or the respective SDK client instead.
 * @see [hubble-sdk]{@link https://github.com/hubbleprotocol/hubble-common/blob/0512e85c5a816a557fe7feaf55981cabcd992476/packages/hubble-sdk/src/Hubble.ts#L722} getAllPrices method
 * @see [kamino-sdk]{@link https://github.com/hubbleprotocol/hubble-common/blob/0be269d4fdb3dbadbbd8c7fcca68c6b1928d445a/packages/kamino-sdk/src/Kamino.ts#L1717} getAllPrices method
 * @see [kamino-lending-sdk]{@link https://github.com/hubbleprotocol/kamino-lending-sdk/blob/17a48b6bb21945d2d799d31d6f0b20104e8c83ac/src/classes/market.ts#L759} getAllScopePrices method
 * @description Map token mint to scope token name
 * @param mint
 * @param cluster
 */
export function mintToScopeToken(mint: string, cluster: SolanaCluster = 'mainnet-beta') {
  return ScopeMints.find((x) => x.cluster === cluster)?.mints?.find((x) => x.mint === mint)?.token;
}
