const FootballAuctions = artifacts.require("FootballAuctions");
// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert, constants } = require('@openzeppelin/test-helpers');

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

const { expect } = require('chai');

contract('FootballAuctions',  function ([ creator, user1, user2, user3, user4]) { 
  
  beforeEach(async function () { 
    this.token = await FootballAuctions.new(); 
  });

  it('modificatore AtStage', async function () {
    await this.token.openNewAudiction('TestURI');
    await expectRevert( this.token._newProposal(0,1,{from: user1}), 'Invalid auctionID');
    await this.token._newProposal(40,0,{from: user1});
    await this.token._newProposal(50,0,{from: user2});
    await this.token._newProposal(30,0,{from: user3});
    const receipt = await this.token.assignWinner(0);
    expectEvent(receipt,'winnerAssigned',{winner: user2});
  })


});
