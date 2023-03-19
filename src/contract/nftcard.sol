pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCard is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    address payable public creator;
    uint256 private constant PERCENTAGE_DENOMINATOR = 100;
    uint256 public nftPrice;

    event NFTCarded(address indexed buyer, address indexed receiver, uint256 indexed tokenId);

    constructor(address payable _creator, uint256 _nftPrice) ERC721("NFTCard", "CARD") {
        require(_creator != address(0), "Invalid creator address");
        require(_nftPrice > 0, "Price must be greater than 0");
        creator = _creator;
        nftPrice = _nftPrice;
    }

    function mintAndTransferNFT(address buyer, address receiver, string memory tokenURI) external payable {
        require(buyer != address(0), "Invalid buyer address");
        require(receiver != address(0), "Invalid receiver address");
        require(msg.value >= nftPrice, "Insufficient payment for NFT");

        uint256 tokenId = _mintNFT(buyer, tokenURI);

        _transfer(buyer, receiver, tokenId);
        emit NFTCarded(buyer, receiver, tokenId);

        _distributeFunds(nftPrice);
    }

    function _mintNFT(address buyer, string memory tokenURI) private returns (uint256) {
        _tokenIdCounter.increment();

        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(buyer, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }

    function _distributeFunds(uint256 amount) private {
        uint256 creatorShare = (amount * 90) / PERCENTAGE_DENOMINATOR;
        uint256 deployerShare = amount - creatorShare;

        creator.transfer(creatorShare);
        payable(owner()).transfer(deployerShare);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
}