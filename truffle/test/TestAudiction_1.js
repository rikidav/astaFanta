const AudictionFactory = artifacts.require("FootballAuctions");
// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert, constants } = require('@openzeppelin/test-helpers');

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

const { expect } = require('chai');

contract('FootballAuctions',  function ([ creator, user1, user2, user3, user4]) { 
  
  beforeEach(async function () { 
    this.token = await AudictionFactory.new(); 
  });

  it('openNewAudiction offerta non valida', async function () {
    //const nameBytes32 = web3.utils.fromAscii("balotelli");
    await this.token.openNewAudiction('testURI');
    await expectRevert( this.token._newProposal(0,0,{from: user1}), 'offerta non valida');
  })

  it('openNewAudiction audictionID non valido', async function () {
    await this.token.openNewAudiction('testURI');
    await expectRevert( this.token._newProposal(0,1,{from: user1}), 'audictionID non valido');
  })

  it('openNewAudiction user ha gia fatto l offerta', async function () {
    await this.token.openNewAudiction('testURI');
    const receipt = await this.token._newProposal(40,0,{from: user1})
    expectEvent(receipt,'newProposal_',{user: user1,newProposal: new BN('40'),audictionID: new BN('0')});
    await expectRevert( this.token._newProposal(50,0,{from: user1}), 'user ha gia fatto l offerta');
  })

  
  it('AssignWinner', async function () {
    await this.token.openNewAudiction('testURI');
    await this.token._newProposal(40,0,{from: user1});
    await this.token._newProposal(50,0,{from: user2});
    expectEvent(await this.token.assignWinner(0),'winnerAssigned');
    
  })

  // it('AssignWinner', async function () {
  //   const nameBytes32 = web3.utils.fromAscii("balotelli");
  //   await this.token.openNewAudiction(nameBytes32);
  //   await this.token._newProposal(40,0,{from: user1});
  //   await this.token._newProposal(50,0,{from: user2});
  //   const receipt = await this.token.assignWinner(0);
  //   expectEvent(receipt,'winnerAssigned',{winner: user2});
    
  // })

  it('AssignWinner', async function () {
    await this.token.openNewAudiction('testURI');
    await this.token._newProposal(40,0,{from: user1});
    await this.token._newProposal(50,0,{from: user2});
    await this.token._newProposal(30,0,{from: user3});
    await this.token._newProposal(100,0,{from: user4});
    const receipt = await this.token.assignWinner(0);
    expectEvent(receipt,'winnerAssigned',{winner: user4});
    
  })

  // it('Test: newProposal, new_proposal = 0', async function () {
  //   await expectRevert( this.token.newProposal(0,1,{from: user1}), 'offerta non valida');
  //   await this.token.newProposal(100,1,{from: user1});
  //   await expectRevert( this.token.newProposal(250,1,{from: user1}), 'user ha gia fatto l offerta');
  // });

  // it('Test: newProposal, utente prova a fare due offerte', async function () {
  //   await this.token.newProposal(100,1,{from: user1});
  //   await expectRevert( this.token.newProposal(250,1,{from: user1}), 'user ha gia fatto l offerta');
  // });

});
