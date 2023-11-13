const AudictionFactory = artifacts.require("FootballAuctions");
const NFTPlayerArtifacts = artifacts.require("NFTPlayer");

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert, constants } = require('@openzeppelin/test-helpers');

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

const { expect } = require('chai');

const AUCTIONEER_ROLE = web3.utils.sha3('AUCTIONEER');

const PositionPlayer = { //replicare la enum
    goalkeepers: 0,
    defenders: 1,
    midfielders: 2,
    strikers: 3
};

contract('FootballAuctions', function ([creator, auctioner, user2, user3, user4]) {

    beforeEach(async function () {
        this.token = await AudictionFactory.new();
    });

    it('Test:AUCTIONEER_ROLE ', async function () {

        const receipt = await this.token.grantRole(AUCTIONEER_ROLE, auctioner, { from: creator });
        expectEvent(receipt, 'RoleGranted', { role: AUCTIONEER_ROLE, account: auctioner, sender: creator });
        //AUCTIONEER_ROLE openNewAudiction
        await this.token.openNewAudiction('testURI', PositionPlayer.goalkeepers, { from: auctioner });
        //auctioner try _newProposal
        await expectRevert(this.token._newProposal(30, 0, { from: auctioner }), 'The caller must not be an auctioneer');
        //user try _newProposal
        expectEvent(await this.token._newProposal(30, 0, { from: user2 }), 'newWinner');
    })

    it('Test: Maximum Number of Players per User Verification', async function () {
        const receipt = await this.token.grantRole(AUCTIONEER_ROLE, auctioner, { from: creator });
        expectEvent(receipt, 'RoleGranted', { role: AUCTIONEER_ROLE, account: auctioner, sender: creator });
        
        await this.token.openNewAudiction('testURI_0', PositionPlayer.goalkeepers, { from: auctioner });
        await this.token.openNewAudiction('testURI_1', PositionPlayer.goalkeepers, { from: auctioner });

        //user2 effettua una nuova proposta per il giocatore con idasta=0
        expectEvent(await this.token._newProposal(30, 0, { from: user2 }), 'newWinner');
        //user2 effettua una nuova proposta per il giocatore con idasta=1 (dopo aver raggiunto il numero massimo di offerte attive)
        await expectRevert(this.token._newProposal(30, 1, { from: user2 }), 'Player Limit for Role Reached');
        //user3 fa un offerta per il giocatore idasta=0 (vince) 
        expectEvent(await this.token._newProposal(35, 0, { from: user3 }), 'newWinner');
        //ora l'user può fare l'offerta per il giocatore idAsta=1
        expectEvent(await this.token._newProposal(30, 1, { from: user2 }), 'newWinner');
    })

    it('Test: Maximum Number of Players per User Verification', async function () {
        const receipt = await this.token.grantRole(AUCTIONEER_ROLE, auctioner, { from: creator });
        expectEvent(receipt, 'RoleGranted', { role: AUCTIONEER_ROLE, account: auctioner, sender: creator });
        await this.token.openNewAudiction('testURI_0', PositionPlayer.goalkeepers, { from: auctioner });
        await this.token.openNewAudiction('testURI_1', PositionPlayer.goalkeepers, { from: auctioner });

        expectEvent(await this.token._newProposal(30, 0, { from: user2 }), 'newWinner');
        await expectRevert(this.token._newProposal(30, 1, { from: user2 }), 'Player Limit for Role Reached');

        expectEvent(await this.token._newProposal(35, 0, { from: user3 }), 'newWinner');
        expectEvent(await this.token._newProposal(30, 1, { from: user2 }), 'newWinner');

        await this.token.openNewAudiction('testURI_2', PositionPlayer.midfielders, { from: auctioner });
        await this.token.openNewAudiction('testURI_3', PositionPlayer.midfielders, { from: auctioner });
        await this.token.openNewAudiction('testURI_4', PositionPlayer.midfielders, { from: auctioner });
        expectEvent(await this.token._newProposal(35, 2, { from: user2 }), 'newWinner');
        expectEvent(await this.token._newProposal(30, 3, { from: user2 }), 'newWinner');
        await expectRevert(this.token._newProposal(30, 4, { from: user2 }), 'Player Limit for Role Reached');

        expectEvent(await this.token._newProposal(31, 3, { from: user3 }), 'newWinner');
        expectEvent(await this.token._newProposal(30, 4, { from: user2 }), 'newWinner');

        expectEvent(await this.token.assignWinner(0, { from: auctioner }), 'winnerAssigned');

    })

    it('Test: assignWinner()', async function () {

        const receipt = await this.token.grantRole(AUCTIONEER_ROLE, auctioner, { from: creator });
        expectEvent(receipt, 'RoleGranted', { role: AUCTIONEER_ROLE, account: auctioner, sender: creator });
        await this.token.openNewAudiction('testURI_0', PositionPlayer.goalkeepers, { from: auctioner });
        await this.token.openNewAudiction('testURI_1', PositionPlayer.goalkeepers, { from: auctioner });

        expectEvent(await this.token._newProposal(30, 0, { from: user2 }), 'newWinner');
        expectEvent(await this.token.assignWinner(0, { from: auctioner }), 'winnerAssigned');
        //assegna vincitore ad un asta senza offerte
        await expectRevert(this.token.assignWinner(1, { from: auctioner }), 'not possible to assign the winner');
        //
        await expectRevert(this.token._newProposal(30, 0, { from: user2 }), 'Invalid auction state');
    })


    it('Test: assignWinner', async function () {

        const receipt = await this.token.getRole();
        for (const rec of receipt) {
            console.log(Number(rec));
            console.log(typeof (Number(rec)));
            //console.log(rec);

            console.log(typeof (rec));
        }


    })

    it('Test: getMemberRole', async function () {
        const receipt1 = await this.token.grantRole(AUCTIONEER_ROLE, auctioner, { from: creator });
        expectEvent(receipt1, 'RoleGranted', { role: AUCTIONEER_ROLE, account: auctioner, sender: creator });
        const receipt2 = await this.token.grantRole(AUCTIONEER_ROLE, user2, { from: creator });
        expectEvent(receipt2, 'RoleGranted', { role: AUCTIONEER_ROLE, account: user2, sender: creator });
        
        const num_auctioneer = await this.token.getRoleMemberCount(AUCTIONEER_ROLE);
        console.log(Number(num_auctioneer));
        for (let index = 0; index < Number(num_auctioneer); index++) { 
            console.log(await this.token.getRoleMember(AUCTIONEER_ROLE,index))
        }
    })


    it('Test: checkLimitPlayer', async function () {
        const receipt = await this.token.grantRole(AUCTIONEER_ROLE, auctioner, { from: creator });
        expectEvent(receipt, 'RoleGranted', { role: AUCTIONEER_ROLE, account: auctioner, sender: creator });
        await this.token.openNewAudiction('testURI_0', PositionPlayer.goalkeepers, { from: auctioner });
        await this.token.openNewAudiction('testURI_1', PositionPlayer.goalkeepers, { from: auctioner });

        expectEvent(await this.token._newProposal(30, 0, { from: user2 }), 'newWinner');
        expect(await this.token.checkLimitPlayer(0,{ from: user2 })).to.be.false;

    })

   



});
