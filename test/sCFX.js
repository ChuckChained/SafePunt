import { tokens, EVM_REVERT } from './helpers'

const sCFX = artifacts.require("sCFX")

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('sCFX', ([deployer, receiver, admin]) => {
	const name = 'safeCFX'
	const symbol = 'sCFX'
	const decimals = '18'
	const totalSupply = tokens(0).toString()
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

		it('tracks the symbol', async () => {
			const result = await token.symbol()
			result.should.equal(symbol)
		})

		it('tracks the decimals', async () => {
			const result = await token.decimals()
			result.toString().should.equal(decimals)
		})

		it('tracks the total supply', async () => {
			const result = await token.totalSupply()
			result.toString().should.equal(totalSupply.toString())
		})
	})


	describe('initial mint', () => {
		let result
		let amount

		describe('success', async () => {
			beforeEach(async () => {
				amount = tokens(100)
				result = await token._initialMint( deployer, amount )
				
			})

			it('mints tokens', async () => {
				let balanceOf

				//balanceOf = await token.balanceOf(deployer)
				//console.log("deployer balance before transfer", balanceOf.toString())
				//balanceOf = await token.balanceOf(receiver)
				//console.log("receiver balance before transfer", balanceOf.toString())

				// Transfer
				

				balanceOf = await token.balanceOf(deployer)
				balanceOf.toString().should.equal(tokens(100).toString())
				
			})


		})
		describe('mint n transfer', async () => {
			beforeEach(async () => {
				amount = tokens(100)
				result = await token._initialMint(deployer, amount);
				await token.transfer(receiver, tokens(10), { from: deployer } )
				// result = await token.transfer(receiver, amount, { from: deployer } )
				//result = await token.transfer(receiver, amount, { from: deployer } )
			})
			it('transfers token balances', async () => {
				let balanceOf
				//const token = await sCFX.new()

				balanceOf = await token.balanceOf(deployer)
				balanceOf.toString().should.equal(tokens(90).toString())
				balanceOf = await token.balanceOf(receiver)
				balanceOf.toString().should.equal(tokens(10).toString())
			})
			it('emits a Transfer event', async () => {
				const log = result.logs[0]
				log.event.should.eq('Transfer')
				const event = log.args
				event.from.toString().should.equal(deployer, 'from is correct')
				event.to.should.equal(receiver, 'to is correct')
				event.value.toString().should.equal(tokens(10).toString(), 'value is correct')
			})
		})

		describe('failure', () => {

			it('rejects insufficienct balances', async () => {
				let invalidAmount
				invalidAmount = tokens(100000000) // 100 million - greater than total supply
				await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT);
				
				invalidAmount = tokens(10) // recipient has no tokens
        		await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT);
			})

			it('rejects invalid recipients', async () => {
				await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
			})
		})
	})

	describe('approving tokens', () => {
		let result
		let amount

		beforeEach(async () => {
			amount = tokens(100)
			result = await token.approve(admin, amount, { from: deployer })
		})

		describe('success', () => {
			it('allocates an allowance for delegated token spending on exchange', async () => {
				const allowance = await token.allowance(deployer, admin)
				allowance.toString().should.equal(amount.toString())
			})

			it('emits an Approval event', async () => {
				const log = result.logs[0]
				log.event.should.eq('Approval')
				const event = log.args
				event.owner.toString().should.equal(deployer, 'owner is correct')
				event.spender.should.equal(admin, 'spender is correct')
				event.value.toString().should.equal(amount.toString(), 'value is correct')
			})
		})

		describe('failure', () => {
			it('rejects invalid spenders', async () => {
				await token.approve(0x0, amount, { from: deployer }).should.be.rejected
			})
			
		})
	})

	describe('delegated token transfers', () => {
		let result
		let amount

		beforeEach(async () => {
			amount = tokens(100)
			await token.approve(admin, amount, { from: deployer })
		})

		describe('success', async () => {
			beforeEach(async () => {
				amount = tokens(100)
				result = await token.mint( deployer, amount);
				await token.transferFrom(deployer, receiver, amount, { from: admin})
			})


			it('transfers token balances', async () => {
				let balanceOf

				//balanceOf = await token.balanceOf(deployer)
				//console.log("deployer balance before transfer", balanceOf.toString())
				//balanceOf = await token.balanceOf(receiver)
				//console.log("receiver balance before transfer", balanceOf.toString())

				// Transfer
				

				balanceOf = await token.balanceOf(deployer)
				balanceOf.toString().should.equal(tokens(0).toString())
				//console.log("deployer balance before after", balanceOf.toString())
				balanceOf = await token.balanceOf(receiver)
				balanceOf.toString().should.equal(tokens(100).toString())
				//console.log("receiver balance before after", balanceOf.toString())

			})

		// 	it('resets the allowance', async () => {
		// 		const allowance = await token.allowance(deployer, admin)
		// 		allowance.toString().should.equal('0')
		// 	})

		// 	it('emits a Transfer event', async () => {
		// 		const log = result.logs[0]
		// 		log.event.should.eq('Transfer')
		// 		const event = log.args
		// 		event.from.toString().should.equal(deployer, 'from is correct')
		// 		event.to.should.equal(receiver, 'to is correct')
		// 		event.value.toString().should.equal(amount.toString(), 'value is correct')
		// 	})
		})

		describe('failure', () => {
			it('rejects insufficienct amounts', async () => {
				const  invalidAmount = tokens(100000000)
				await token.transferFrom(deployer, receiver, invalidAmount, { from: admin }).should.be.rejectedWith(EVM_REVERT)
			})
			it('rejects invalid recipients', async () => {
				await token.transferFrom(deployer, 0x0, amount, { from: admin }).should.be.rejected
			})
		})
	})

})