// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EtkinlikKayit {
    string public etkinlikAdi = "Blokchain Kayit";
    uint256 public kapasite = 3;
    uint256 public toplamKayit;

    address public gorevli;

    mapping(address => string) public katilimcilar;
    mapping(address => bool) public girisYaptiMi;

    event KayitOlundu(address indexed katilimci, string takmaAd);
    event GirisOnaylandi(address indexed katilimci);

    constructor() {
        gorevli = msg.sender;
    }

    function kayitOl(string memory _takmaAd) public {
        require(bytes(_takmaAd).length > 0, "Takma ad bos olamaz");
        require(bytes(katilimcilar[msg.sender]).length == 0, "Bu adres zaten kayitli");
        require(toplamKayit < kapasite, "Etkinlik kapasitesi doldu");

        katilimcilar[msg.sender] = _takmaAd;
        toplamKayit++;

        emit KayitOlundu(msg.sender, _takmaAd);
    }

    function girisOnayla(address _katilimci) public {
        require(msg.sender == gorevli, "Sadece gorevli giris onaylayabilir");
        require(bytes(katilimcilar[_katilimci]).length > 0, "Bu adres etkinlige kayitli degil");
        require(girisYaptiMi[_katilimci] == false, "Bu katilimci zaten giris yapti");

        girisYaptiMi[_katilimci] = true;

        emit GirisOnaylandi(_katilimci);
    }
}