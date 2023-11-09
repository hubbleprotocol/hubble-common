/**
 * @deprecated Deprecated since version 2.2.47 - please use {@link getOraclePrices} or the respective SDK client instead.
 * @see [hubble-sdk]{@link https://github.com/hubbleprotocol/hubble-common/blob/0512e85c5a816a557fe7feaf55981cabcd992476/packages/hubble-sdk/src/Hubble.ts#L722} getAllPrices method
 * @see [kamino-sdk]{@link https://github.com/hubbleprotocol/hubble-common/blob/0be269d4fdb3dbadbbd8c7fcca68c6b1928d445a/packages/kamino-sdk/src/Kamino.ts#L1717} getAllPrices method
 * @see [kamino-lending-sdk]{@link https://github.com/hubbleprotocol/kamino-lending-sdk/blob/17a48b6bb21945d2d799d31d6f0b20104e8c83ac/src/classes/market.ts#L759} getAllScopePrices method
 * @description Supported scope tokens
 */
export const SupportedTokens = [
  'SOL',
  'ETH',
  'BTC',
  'wBTC',
  'SRM',
  'RAY',
  'FTT',
  'MSOL',
  'scnSOL',
  'BNB',
  'AVAX',
  'daoSOL',
  'USDH',
  'cSOL',
  'cETH',
  'cBTC',
  'cMSOL',
  'wstETH',
  'LDO',
  'USDC',
  'cUSDC',
  'USDT',
  'ORCA',
  'MNDE',
  'HBB',
  'cORCA',
  'cSLND',
  'cSRM',
  'cRAY',
  'cFTT',
  'cSTSOL',
  'SLND',
  'JSOL',
  'DAI',
  'USH',
  'UXD',
  'USDHTwap',
  'USHTwap',
  'UXDTwap',
  'HDG',
  'DUST',
  'kUSDHUSDCOrca',
  'kSOLSTSOLOrca',
  'kUSDCUSDTOrca',
  'kUSHUSDCOrca',
  'USDRTwap',
  'USDR',
  'RATIO',
  'UXP',
  'kUXDUSDCOrca',
  'JITOSOL',
  'SOLEma',
  'ETHEma',
  'BTCEma',
  'SRMEma',
  'RAYEma',
  'FTTEma',
  'MSOLTwap',
  'BNBEma',
  'AVAXEma',
  'USDCEma',
  'USDTEma',
  'DAIEma',
  'wstETHEma',
  'DUSTTwap',
  'BONK',
  'BONKTwap',
  'SAMO',
  'SAMOTwap',
  'bSOL',
  'LaineSOL',
  'HADES',
  'HADESTwap',
  'STSOL',
  'STSOLTwap',
  'RLB',
  'RLBTwap',
  'CGNTSOL',
  'HXRO',
  'HXROTwap',
  'MNDETwap',
  'USDCet',
  'HNT',
  'HNTEma',
  'MOBILE',
  'MOBILETwap',
  'IOT',
  'IOTTwap',
  'NANA',
  'NANATwap',
  'STEP',
  'STEPTwap',
  'FORGE',
  'FORGETwap',
  'TBTC',
  'COCO',
  'COCOTwap',
  'STYLE',
  'STYLETwap',
  'CHAI',
  'CHAITwap',
  'T',
  'TTwap',
  'BLZE',
  'BLZETwap',
  'EUROE',
  'EUROETwap',
  'kSOLBSOLOrca',
  'kMNDEMSOLOrca',
  'kSTSOLUSDCOrca',
  'kUSDHUSDTOrca',
  'kSOLJITOSOLOrca',
  'kbSOLMSOLOrca',
  'kMSOLJITOSOLOrca',
  'kSOLUSDCOrca',
  'kJITOSOLUSDCOrca',
  'LST',
  'kSOLJITOSOLRaydium',
  'kSOLMSOLRaydium',
  'RENDER',
  'RENDEREma',
] as const;
/**
 * @deprecated Deprecated since version 2.2.47 - please use {@link getOraclePrices} or the respective SDK client instead.
 * @see [hubble-sdk]{@link https://github.com/hubbleprotocol/hubble-common/blob/0512e85c5a816a557fe7feaf55981cabcd992476/packages/hubble-sdk/src/Hubble.ts#L722} getAllPrices method
 * @see [kamino-sdk]{@link https://github.com/hubbleprotocol/hubble-common/blob/0be269d4fdb3dbadbbd8c7fcca68c6b1928d445a/packages/kamino-sdk/src/Kamino.ts#L1717} getAllPrices method
 * @see [kamino-lending-sdk]{@link https://github.com/hubbleprotocol/kamino-lending-sdk/blob/17a48b6bb21945d2d799d31d6f0b20104e8c83ac/src/classes/market.ts#L759} getAllScopePrices method
 * @description
 */
export type SupportedToken = (typeof SupportedTokens)[number];
