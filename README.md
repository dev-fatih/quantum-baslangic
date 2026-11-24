# Quantum Team - Blokzincir Oryantasyon Çalışması

## Çalışmanın Amacı
Bu depo, QuantumTeam Teknofest Kulübü Blokzincir Takımı oryantasyon süreci boyunca hazırladığım araştırma notlarını ve uygulamalı çalışmaları bir arada tutmak için oluşturulmuştur. 

## Öğrenmek İstediğim Konular
- **Akıllı sözleşme geliştirme:** Blokzincir üzerinde çalışan kuralları ve iş mantığını Solidity diliyle yazmayı öğrenmek.
- **Akıllı sözleşmelerle çalışan uygulamalar geliştirme:** Yazdığım sözleşmeleri cüzdan bağlantısı olan web arayüzlerine bağlayarak kullanıcıların etkileşime girebileceği uygulamalar yapmak.
- **Cüzdanların çalışma mantığını kodla görmek:** Bir cüzdan adresinin ve anahtarlarının arka planda nasıl oluştuğunu basit bir uygulamayla deneyimlemek.
- **Sistemleri daha hızlı ve düşük maliyetli çalıştırma:** Temelleri iyice öğrendikten sonra yazılan sözleşmeleri ve işlemleri daha az maliyetle, daha verimli çalıştırmanın yollarını öğrenmek.

## Depo İçeriği ve Nasıl Erişileceği
- arastirma_notlari.md: Visual Studio Code gibi uygulamalardan veya direkt olarak githubdan notlara erişebilirsiniz.

- Basit cüzdan oluşturucu web sitesi(CuzdanOlustur.html): Direkt olarak tarayıcınızdan başlatabilirsiniz.

- README.md: Visual Studio Code gibi uygulamalardan veya direkt olarak githubdan notlara erişebilirsiniz.

- QuantumKayit.sol, Quantum Team Blokzincir Takımı'nın Sepolia ağındaki (0x81Dd700C459BF2806A1B5F2a349c89f0106A9036) ortak sözleşme deneyinin kopyasıdır. Yalnızca kendi kopyamı yayınlama ve doğrulama pratiği için depoya eklenmiştir; sonraki etkinlik projesi sıfırdan tarafımdan yazılacaktır.

- KayitOlma.sol, benim yazdığım akıllı sözleşme.

### .sol uzantılı dosyaları çalıştırmak için aşağıdaki adımları uygulayın:
1. Tarayıcıda [Remix IDE](https://remix.ethereum.org/) adresini açın.
2. Sol menüdeki **File Explorer** bölümünden **Load a local file into current workspace** butonuna tıklayarak depodaki `.sol` dosyasını çalışma alanına yükleyin.
3. **Solidity Compiler** sekmesine geçip sözleşmeyi derleyin.
4. **Deploy & Run Transactions** sekmesinde **ENVIRONMENT** kısmını **Remix VM** olarak seçin ve **Deploy** butonuna basarak sözleşmeyi yerel ortamda başlatın.

## Kullanılan Araçlar
- Visual Studio Code
- Remix IDE
- MetaMask
- Solidity

## Remix ve Etherscan nasıl aynı ağdaki sözleşmelere işlem gönderiyor?

Remix ve etherscan, blokzincire sahip değildir. Bu platformlar blokzincirle ve içindeki sözleşmelerle bağlantı kurmanızı sağlayan araçlardır. Akıllı sözleşmeker ise direkt olarak blokzincir'in içerisindeki bir adreste yaşar. Bu nedenle ikisi de o adrese ulaşıp sözleşmeye erişim sağlayabilir.