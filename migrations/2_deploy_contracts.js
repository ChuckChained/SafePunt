const SafePunt = artifacts.require("SafePunt");
const sCFX = artifacts.require("sCFX");
const Farm = artifacts.require("Farm");
//const MetaCoin = artifacts.require("MetaCoin");

module.exports = async function(deployer) {

	const uniswapV2Pair
	await deployer.deploy(SafePunt, uniswapV2Pair);
//  deployer.deploy(sCFX);
//  deployer.link(ConvertLib, MetaCoin);
//  deployer.deploy(MetaCoin);
	const totalSupplyV2 = 10000000
	await deployer.deploy(sCFX, totalSupplyV2);




};
