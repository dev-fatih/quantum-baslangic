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

- BlockChainKayitV3.sol , benim yazdığım akıllı sözleşme.(V2 ve V1 diğer versiyonları)

### .sol uzantılı dosyaları çalıştırmak için aşağıdaki adımları uygulayın:
1. Tarayıcıda [Remix IDE](https://remix.ethereum.org/) adresini açın.
2. Sol menüdeki **File Explorer** bölümünden **Load a local file into current workspace** butonuna tıklayarak depodaki `.sol` dosyasını çalışma alanına yükleyin.
3. **Solidity Compiler** sekmesine geçip sözleşmeyi derleyin.
4. **Deploy & Run Transactions** sekmesinde **ENVIRONMENT** kısmını **Remix VM** olarak seçin ve **Deploy** butonuna basarak sözleşmeyi yerel ortamda başlatın.

## Kullanılan Araçlar
- Visual Studio Code
- Remix IDE
- MetaMask

## Remix ve Etherscan nasıl aynı ağdaki sözleşmelere işlem gönderiyor?

Remix ve etherscan, blokzincire sahip değildir. Bu platformlar blokzincirle ve içindeki sözleşmelerle bağlantı kurmanızı sağlayan araçlardır. Akıllı sözleşmeker ise direkt olarak blokzincir'in içerisindeki bir adreste yaşar. Bu nedenle ikisi de o adrese ulaşıp sözleşmeye erişim sağlayabilir.

## Kullandığım hesap adresleri

- Account1 : 0x29acEDCbF42AFbDA1c1961a305095fFFe02243e9
- Account2 : 0xB8512BA142BE734e6873406d2027b2160f838F86

(Takımın yazdığı benim deploy ettiğim sözleşme adresi ve benim yazdığım sözleşmenin adresi Adresler.txt dosyasındadır.)

## Etkinlik Uygulaması Rehberi

- Chrome Web Mağazasından MetaMask eklentisini ekleyin.
- Cüzdan oluşturucu uygulamasına girin **(UYARI: Uygulamada gizlenen 12 kelime, seed ve private key bilgilerini kimseyle paylaşmayın ve bu eğitim cüzdanını gerçek varlıklar için kullanmayın!)**
- MetaMask'te **"Mevcut bir cüzdanı içe aktar"** seçeneğiyle cüzdan oluşturucu uygulamasından edindiğiniz 12 kelimeyi (veya mevcut MetaMask kurulumunuza ek hesap olarak private key'i) girerek eğitim hesabınızı oluşturun.
- MetaMask'in üst kısmındaki ağ menüsünden **"Test ağlarını göster" (Show test networks)** seçeneğini etkinleştirin ve **Sepolia** test ağına geçin. *(Kayıt ve onay işlemlerinin gas ücreti için hesabınızda test amaçlı Sepolia ETH bulunmalıdır.)*
- Etkinlik uygulamasının `index.html` dosyasını **doğrudan çift tıklayarak açmayın** (`file://` adresiyle açıldığında tarayıcı güvenlik kuralları nedeniyle MetaMask bağlantısı ve ES modülleri çalışmaz). Uygulamayı bir yerel sunucu üzerinden başlatın:
  - **Yöntem 1 (VS Code Live Server):** Proje klasörünü Visual Studio Code ile açın, **Live Server** eklentisini kurun, `index.html` dosyasına sağ tıklayıp **"Open with Live Server"** seçeneğine tıklayın.
  - **Yöntem 2 (Terminal):** `index.html` dosyasının bulunduğu klasörde terminal açın, `python -m http.server 8000` (veya Node.js kuruluysa `npx serve .`) komutunu çalıştırın ve tarayıcıdan `http://localhost:8000` adresine gidin.
- Açılan sayfada sağ üstteki **"Cüzdan Bağla"** düğmesine tıklayın ve MetaMask penceresinden bağlantıyı onaylayın. *(Farklı bir ağdaysanız uygulama kayıt/onay işlemlerini engeller ve **"Sepolia'ya Geç"** düğmesiyle ağ değiştirmenizi ister.)*
- Bağlantı tamamlandığında **Etkinlik Adı**, **Kapasite**, **Toplam Kayıt** ve **Kalan Kontenjan** bilgileri Sepolia sözleşmesinden otomatik olarak okunur.
- **Katılımcı Kaydı:** "Katılımcı İşlemleri" bölümünde takma adınızı yazıp **"Kayıt Ol"** düğmesine basın ve açılan MetaMask penceresinden işlemi imzalayın. İşlem onaylandığında sayfadaki kayıt ve giriş durumunuz otomatik olarak yenilenir.
- **Görevli Giriş Onayı:** Görevliler girişinizi onayladığında giriş durumunuz güncellenecektir. *(Yetki kontrolü zincir üzerinde akıllı sözleşme tarafından yapılır; yetkisiz hesaplardan gönderilen işlemler sözleşme tarafından reddedilir.)*

### İki Bölüm Aynı Eğitim Hesabını Nasıl Kullanır?

- İP 12 cüzdan aracı (`CuzdanOlustur.html`) ile yeni etkinlik arayüzü (`index.html`) aynı depoda tutulur ancak **birbirinden tamamen izoledir**; aralarında hiçbir kod bağımlılığı veya gizli veri aktarımı yoktur.
- Etkinlik arayüzü kullanıcıdan hiçbir aşamada 12 kelime veya private key istemez.
- İki bölüm aynı eğitim hesabını yalnızca **MetaMask** aracılığıyla kullanır: Hesap cüzdan oluşturucuda üretilip kullanıcı tarafından manuel olarak MetaMask'a aktarılır; yeni arayüz ise yalnızca MetaMask üzerinden açık adresi okur ve işlemleri MetaMask'a imzalatır.

### Sözleşme Yapılandırması (İP 23)

- İP 23'te Sepolia ağına deploy edilen sözleşmenin adresi (`CONTRACT_ADDRESS`) ve ABI tanımı (`CONTRACT_ABI`), etkinlik uygulaması klasöründeki `config.js` dosyasında bulunur.