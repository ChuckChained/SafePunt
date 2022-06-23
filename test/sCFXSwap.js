import { tokens, EVM_REVERT } from './helpers'

const sCFX = artifacts.require("sCFX")
const sCFXSwap = artifacts.require("sCFXSwap")

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract ('sCFXSwap', ([deployer, receiver, admin]) => {
	const name = 'safeCFX'
	let token

	beforeEach(async () => {
		token = await sCFX.new()
	})

	describe('deployment', () => {
		it('tracks the name', async () => {
			const token = await sCFX.new()
			const result = await token.name()
			result.should.equal(name)
		})
	})

}