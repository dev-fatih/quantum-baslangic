// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EtkinlikKayit {
    string public etkinlikAdi = "Blockchain 101 Atolyesi";
    uint256 public kapasite = 3;
    uint256 public toplamKayit;

    mapping(address => string) public katilimcilar;

    function kayitOl(string memory _takmaAd) public {
      require(bytes(_takmaAd).length > 0);
      require(bytes(katilimcilar[msg.sender]).length == 0, "Bu adres zaten kayitli");
      require(toplamKayit < kapasite, "Etkinlik kapasitesi doldu.");
        katilimcilar[msg.sender] = _takmaAd;
        toplamKayit++;
    }
    
}