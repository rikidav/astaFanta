//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./NFTPlayer.sol";




enum Status {close, open}
enum PositionPlayer{goalkeepers,defenders,midfielders,strikers}
  
    
struct Auction {
    uint256 ID;
    string URI; 
    address winner; 
    uint256 winOffer;
    Status status;
    PositionPlayer position;
}

//keep track of the number of football (active offers) players owned by each user...
struct UserTeam { 
    uint num_goalkeepers;
    uint num_defenders;
    uint num_midfielders; 
    uint num_strikers; 
}

//Access Control Enumerable is an Extension of AccessControl that allows enumerating the members of each role.
//getRoleMember(role, index)
//getRoleMemberCount(role)
contract FootballAuctions is AccessControlEnumerable{
    

    //Auctrioneer Role (assignWinner() && openNewAuction())
    bytes32 private constant AUCTIONEER = keccak256("AUCTIONEER"); 
    
     
    Auction[] private auctions;
    //mappa di struct per tenere traccia di quanti giocatori ha acquistato un giocatore nel ruolo specificato
    //mapping(address => UserTeam) private userTeam;

    //mapping of a mapping to keep track of the number of football (active offers) players owned by each user
    mapping(address => mapping(PositionPlayer => uint)) private userTeam;
    //map to set the auction rules
    mapping(PositionPlayer => uint8) private maxPlayersPerRole;

    using Counters for Counters.Counter;
    Counters.Counter private _IDAuction;
  
    //NFTPlayer is ERC721URIStorage
    NFTPlayer private NFT;
  
   constructor ()  { 
        NFT = new NFTPlayer();
        
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        
        maxPlayersPerRole[PositionPlayer.goalkeepers]=1;
        maxPlayersPerRole[PositionPlayer.defenders]=2;
        maxPlayersPerRole[PositionPlayer.midfielders]=2;
        maxPlayersPerRole[PositionPlayer.strikers]=1;
   }

    //returns the array containing the initial rules
   function getRole() view public returns (uint8[4] memory){ 
        uint8[4] memory MaxPlayer;
        MaxPlayer[0] = maxPlayersPerRole[PositionPlayer.goalkeepers];
        MaxPlayer[1] = maxPlayersPerRole[PositionPlayer.defenders];
        MaxPlayer[2] = maxPlayersPerRole[PositionPlayer.midfielders];
        MaxPlayer[3] = maxPlayersPerRole[PositionPlayer.strikers];
        return MaxPlayer;

   }

    modifier atStage(uint256 auctionID, Status stage_) {
        require (auctionID < auctions.length,'Invalid auctionID');
        require (auctions[auctionID].status == stage_,'Invalid auction state');
        _;
    }

    function isAdmin(address account) public view  returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function isAuctioneer(address account) public view  returns (bool) {
        return hasRole(AUCTIONEER, account);
    }

    event ChecksoloAuctioneer(address user);
    modifier onlyAuctioneer() {
        emit ChecksoloAuctioneer(msg.sender);
        require(isAuctioneer(msg.sender),'caller is not an AUCTIONEER');
        _;
    }

    event ChecksoloAdmin(address user);
    modifier onlyAdmin() {
        emit ChecksoloAdmin(msg.sender);
        require(isAdmin(msg.sender),'caller is not an ADMIN');
        _;
    }

    modifier notAdmin() {
        require(!hasRole(DEFAULT_ADMIN_ROLE, msg.sender),'The caller must not be an admin');
        _;
    }

    modifier notAuctioneer() {
        require(!hasRole(AUCTIONEER, msg.sender),'The caller must not be an auctioneer');
        _;
    }

     

    event AuctionOpened(uint256 auctionID);
    function openNewAuction(string memory URI, PositionPlayer position) public onlyAuctioneer(){ 
        require(bytes(URI).length > 0,'invalid Token URI');
        auctions.push(Auction({
            ID: _IDAuction.current(),
            URI: URI,
            winner: address(0),
            winOffer:0,
            status: Status.open,
            position: position
        }));

        emit AuctionOpened(_IDAuction.current());

        _IDAuction.increment();
    }

   

    function checkLimitPlayer(uint256 auctionID) public view returns(bool){
        PositionPlayer posPlayer = auctions[auctionID].position;
        if (userTeam[msg.sender][posPlayer]<maxPlayersPerRole[posPlayer]){
            return true;
        } else{
            return false;
        }
    }

    event newWinner(address user, uint256 newProposal, uint256 auctionID);
   function _newProposal(uint256 newProposal, uint256 auctionID) public  atStage(auctionID, Status.open) notAuctioneer() notAdmin(){
    
    require(newProposal>0,'invalid proposal');

    PositionPlayer posPlayer = auctions[auctionID].position;
    require(userTeam[msg.sender][posPlayer]<maxPlayersPerRole[posPlayer],'Player Limit for Role Reached');

    //checks if the bid is a winning one. (if winner == address(0), then it's the first bid)
    if (auctions[auctionID].winner == address(0) || auctions[auctionID].winOffer < newProposal) { 
        
        address prevWinner = auctions[auctionID].winner;

        auctions[auctionID].winner = msg.sender;
        auctions[auctionID].winOffer = newProposal;
        emit newWinner(msg.sender, newProposal, auctionID);

        //update userTeam
        userTeam[msg.sender][posPlayer]++;
        if (prevWinner != address(0)){
            userTeam[prevWinner][posPlayer]--;
        }

        
    }
    
   }


    event winnerAssigned(address winner);
        function assignWinner(uint256 auctionID) public atStage(auctionID, Status.open) onlyAuctioneer(){ 
        
        require(auctions[auctionID].winner != address(0),'not possible to assign the winner');
        
        auctions[auctionID].status = Status.close;
        emit winnerAssigned(auctions[auctionID].winner);
        
        NFT.Mint(auctions[auctionID].winner, auctionID, auctions[auctionID].URI);

   }

   function setRoleAuction(uint8 n_gk, uint8 n_df, uint8 n_mf, uint8 n_st) public onlyAdmin(){
        maxPlayersPerRole[PositionPlayer.goalkeepers]=n_gk;
        maxPlayersPerRole[PositionPlayer.defenders]=n_df;
        maxPlayersPerRole[PositionPlayer.midfielders]=n_mf;
        maxPlayersPerRole[PositionPlayer.strikers]=n_st;
   }


    function getAuctions() public view returns (Auction[] memory) {
        return auctions;
    }

}
