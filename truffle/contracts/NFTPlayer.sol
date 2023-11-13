//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract NFTPlayer is ERC721URIStorage, Ownable {
   

    constructor() ERC721("FootbalPlayers", "FB") {
       
    }

    
    function Mint(address win, uint256 id, string memory URI) public onlyOwner(){ 
        _mint(win, id);
        _setTokenURI(id, URI);
    }

}
