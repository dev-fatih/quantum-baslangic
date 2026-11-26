import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_CHAIN_ID_HEX,
} from "./config.js";

const ethers = window.ethers;

// DOM Referansları
const connectBtn = document.getElementById("connectBtn");
const switchSepoliaBtn = document.getElementById("switchSepoliaBtn");
const refreshBtn = document.getElementById("refreshBtn");
const networkBadge = document.getElementById("networkBadge");
const networkWarning = document.getElementById("networkWarning");
const configWarning = document.getElementById("configWarning");

const eventNameEl = document.getElementById("eventName");
const eventCapacityEl = document.getElementById("eventCapacity");
const totalRegistrationsEl = document.getElementById("totalRegistrations");
const remainingSpotsEl = document.getElementById("remainingSpots");
const walletAddressEl = document.getElementById("walletAddress");

const userRegStatusEl = document.getElementById("userRegStatus");
const userNicknameEl = document.getElementById("userNickname");
const userCheckinStatusEl = document.getElementById("userCheckinStatus");
const officerAddressInfoEl = document.getElementById("officerAddressInfo");

const registerForm = document.getElementById("registerForm");
const nicknameInput = document.getElementById("nicknameInput");
const registerBtn = document.getElementById("registerBtn");

const approveForm = document.getElementById("approveForm");
const participantAddressInput = document.getElementById("participantAddressInput");
const approveBtn = document.getElementById("approveBtn");

const statusBox = document.getElementById("statusBox");

// Uygulama Durumu
let provider = null;
let signer = null;
let currentAccount = null;
let isSepolia = false;
let isBusy = false;

const isContractConfigured = () => ethers.isAddress(CONTRACT_ADDRESS);

function setStatus(htmlMessage, type = "info") {
  statusBox.innerHTML = htmlMessage;
  statusBox.className = `status-box ${type}`;
  statusBox.classList.remove("hidden");
}

function clearStatus() {
  statusBox.classList.add("hidden");
  statusBox.innerHTML = "";
}

function updateActionButtons() {
  const canTransact =
    !isBusy && Boolean(currentAccount) && isSepolia && isContractConfigured();

  registerBtn.disabled = !canTransact;
  approveBtn.disabled = !canTransact;
  refreshBtn.disabled = !canTransact;
}

function resetContractDisplay() {
  eventNameEl.textContent = "—";
  eventCapacityEl.textContent = "—";
  totalRegistrationsEl.textContent = "—";
  remainingSpotsEl.textContent = "—";
  userRegStatusEl.textContent = "—";
  userNicknameEl.textContent = "—";
  userCheckinStatusEl.textContent = "—";
  officerAddressInfoEl.textContent = "—";
}

function updateNetworkUI(chainId) {
  isSepolia = chainId === SEPOLIA_CHAIN_ID;

  if (isSepolia) {
    networkBadge.textContent = "Ağ: Sepolia (11155111)";
    networkBadge.className = "badge badge-ok";
    networkWarning.classList.add("hidden");
  } else {
    networkBadge.textContent = `Yanlış Ağ (Chain ID: ${chainId.toString()})`;
    networkBadge.className = "badge badge-bad";
    networkWarning.classList.remove("hidden");
    resetContractDisplay();
  }

  updateActionButtons();
}

function parseError(err) {
  if (err?.code === "ACTION_REJECTED" || err?.code === 4001) {
    return "İmza reddedildi: İşlemi MetaMask üzerinden iptal ettiniz.";
  }

  const rawText = [
    err?.reason,
    err?.shortMessage,
    err?.info?.error?.message,
    err?.message,
  ]
    .filter(Boolean)
    .join(" ");

  if (rawText.includes("Bu adres zaten kayitli")) {
    return "İşlem başarısız: Bu cüzdan adresi etkinliğe zaten kayıtlı (ikinci kayıt yapılamaz).";
  }
  if (rawText.includes("Etkinlik kapasitesi doldu")) {
    return "İşlem başarısız: Etkinlik kapasitesi dolduğu için yeni kayıt alınamıyor.";
  }
  if (rawText.includes("Takma ad bos olamaz")) {
    return "İşlem başarısız: Takma ad alanı boş bırakılamaz.";
  }
  if (rawText.includes("Sadece gorevli giris onaylayabilir")) {
    return "İşlem başarısız: Yetkisiz hesap. Giriş onayı yalnızca sözleşme görevlisi tarafından yapılabilir.";
  }
  if (rawText.includes("Bu adres etkinlige kayitli degil")) {
    return "İşlem başarısız: Girilen adres etkinliğe kayıtlı değil.";
  }
  if (rawText.includes("Bu katilimci zaten giris yapti")) {
    return "İşlem başarısız: Bu katılımcının girişi daha önce onaylanmış.";
  }
  if (err?.reason) {
    return `İşlem başarısız: Sözleşme işlemi reddetti (${err.reason}).`;
  }
  if (err?.shortMessage) {
    return `İşlem başarısız: ${err.shortMessage}`;
  }
  return err?.message || "Beklenmeyen bir hata oluştu.";
}

async function initProviderAndCheckNetwork() {
  provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  updateNetworkUI(network.chainId);
  return network.chainId;
}

async function loadContractData() {
  if (!currentAccount || !isSepolia || !isContractConfigured()) {
    return;
  }

  try {
    const readContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );

    const [
      etkinlikAdi,
      kapasite,
      toplamKayit,
      gorevli,
      takmaAd,
      girisDurumu,
    ] = await Promise.all([
      readContract.etkinlikAdi(),
      readContract.kapasite(),
      readContract.toplamKayit(),
      readContract.gorevli(),
      readContract.katilimcilar(currentAccount),
      readContract.girisYaptiMi(currentAccount),
    ]);

    const kalan = kapasite >= toplamKayit ? kapasite - toplamKayit : 0n;
    const isRegistered = takmaAd.trim().length > 0;
    const isOfficer = gorevli.toLowerCase() === currentAccount.toLowerCase();

    eventNameEl.textContent = etkinlikAdi;
    eventCapacityEl.textContent = kapasite.toString();
    totalRegistrationsEl.textContent = toplamKayit.toString();
    remainingSpotsEl.textContent = kalan.toString();

    userRegStatusEl.textContent = isRegistered ? "Kayıtlı" : "Kayıtlı Değil";
    userNicknameEl.textContent = isRegistered ? takmaAd : "—";
    userCheckinStatusEl.textContent = girisDurumu
      ? "Giriş Onaylandı"
      : "Henüz Giriş Yapılmadı";

    officerAddressInfoEl.textContent = isOfficer
      ? `${gorevli} (Bağlı hesabınız görevli)`
      : `${gorevli} (Bağlı hesabınız görevli değil)`;
  } catch (err) {
    setStatus(
      `Sözleşme verileri okunamadı. Adres ve ABI bilgilerinin Sepolia sözleşmesiyle eşleştiğini kontrol edin. (${parseError(err)})`,
      "error"
    );
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    setStatus(
      "MetaMask bulunamadı. Lütfen tarayıcınıza MetaMask eklentisini kurun.",
      "error"
    );
    return;
  }

  try {
    clearStatus();
    provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    if (!accounts || accounts.length === 0) {
      setStatus("MetaMask hesabı seçilmedi.", "error");
      return;
    }

    currentAccount = ethers.getAddress(accounts[0]);
    signer = await provider.getSigner();

    walletAddressEl.textContent = currentAccount;
    connectBtn.textContent = "Cüzdan Bağlı";

    await initProviderAndCheckNetwork();
    if (isSepolia) {
      await loadContractData();
    }
  } catch (err) {
    setStatus(parseError(err), "error");
  }
}

async function switchToSepolia() {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
  } catch (err) {
    if (err.code === 4902) {
      setStatus(
        "Sepolia ağı MetaMask'ta ekli değil. Lütfen MetaMask ağ ayarlarından test ağlarını etkinleştirip Sepolia'yı seçin.",
        "error"
      );
    } else {
      setStatus(parseError(err), "error");
    }
  }
}

async function ensureSepoliaBeforeWrite() {
  const network = await provider.getNetwork();
  updateNetworkUI(network.chainId);

  if (network.chainId !== SEPOLIA_CHAIN_ID) {
    setStatus(
      "Yanlış ağdasınız. İşlem gönderilmedi; lütfen MetaMask'tan Sepolia ağına geçin.",
      "error"
    );
    return false;
  }
  return true;
}

// Gönderilmiş işlemin makbuzunu bekleyen ortak yardımcı fonksiyon
async function waitAndVerifyReceipt(tx, successText, onSuccess) {
  const txUrl = `https://sepolia.etherscan.io/tx/${tx.hash}`;

  setStatus(
    `İşlem ağa gönderildi, zincir onayı (makbuz) bekleniyor... <a href="${txUrl}" target="_blank" rel="noopener noreferrer">Etherscan'de Görüntüle</a>`,
    "info"
  );

  let receipt = null;
  try {
    receipt = await tx.wait();
  } catch (waitErr) {
    if (waitErr?.code === "CALL_EXCEPTION" || waitErr?.receipt?.status === 0) {
      setStatus(
        `İşlem başarısız: İşlem bloğa alındı ancak sözleşme tarafından reddedildi. (${parseError(waitErr)}) <a href="${txUrl}" target="_blank" rel="noopener noreferrer">Etherscan'de İncele</a>`,
        "error"
      );
    } else {
      setStatus(
        `Sonuç henüz doğrulanamadı: İşlem ağa gönderildi ancak bağlantı sorunu nedeniyle makbuz alınamadı. Aynı işlemi otomatik veya manuel olarak tekrar göndermeyin; durumu buradan kontrol edin: <a href="${txUrl}" target="_blank" rel="noopener noreferrer">Etherscan'de Kontrol Et</a>`,
        "warning"
      );
    }
    return;
  }

  if (!receipt || receipt.status !== 1) {
    setStatus(
      `İşlem başarısız: İşlem makbuzunda başarısız (status: 0) sonucu döndü. <a href="${txUrl}" target="_blank" rel="noopener noreferrer">Etherscan'de İncele</a>`,
      "error"
    );
    return;
  }

  if (onSuccess) onSuccess();
  await loadContractData();

  setStatus(
    `${successText} <a href="${txUrl}" target="_blank" rel="noopener noreferrer">İşlem Detayı (Etherscan)</a>`,
    "success"
  );
}

// Katılımcı Kayıt İşlemi
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentAccount || !isContractConfigured()) return;

  const takmaAd = nicknameInput.value.trim();
  if (!takmaAd) {
    setStatus("Lütfen geçerli bir takma ad girin.", "error");
    return;
  }

  if (!(await ensureSepoliaBeforeWrite())) return;

  try {
    isBusy = true;
    updateActionButtons();
    setStatus("Kayıt işlemi için MetaMask cüzdan onayı bekleniyor...", "info");

    signer = await provider.getSigner();
    const writeContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const tx = await writeContract.kayitOl(takmaAd);
    await waitAndVerifyReceipt(
      tx,
      "Kayıt makbuz ile doğrulandı, işlem başarıyla tamamlandı.",
      () => {
        nicknameInput.value = "";
      }
    );
  } catch (err) {
    setStatus(parseError(err), "error");
  } finally {
    isBusy = false;
    updateActionButtons();
  }
});

// Görevli Giriş Onayı İşlemi (Yetki kontrolü sözleşmede kalır)
approveForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentAccount || !isContractConfigured()) return;

  const participantAddr = participantAddressInput.value.trim();
  if (!ethers.isAddress(participantAddr)) {
    setStatus("Lütfen geçerli bir Ethereum cüzdan adresi (0x...) girin.", "error");
    return;
  }

  if (!(await ensureSepoliaBeforeWrite())) return;

  try {
    isBusy = true;
    updateActionButtons();
    setStatus("Giriş onayı için MetaMask cüzdan imzası bekleniyor...", "info");

    signer = await provider.getSigner();
    const writeContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const tx = await writeContract.girisOnayla(participantAddr);
    await waitAndVerifyReceipt(
      tx,
      "Katılımcı girişi makbuz ile doğrulandı ve onaylandı.",
      () => {
        participantAddressInput.value = "";
      }
    );
  } catch (err) {
    setStatus(parseError(err), "error");
  } finally {
    isBusy = false;
    updateActionButtons();
  }
});

// Olay Dinleyicileri
connectBtn.addEventListener("click", connectWallet);
switchSepoliaBtn.addEventListener("click", switchToSepolia);
refreshBtn.addEventListener("click", loadContractData);

if (!isContractConfigured()) {
  configWarning.classList.remove("hidden");
}

if (window.ethereum) {
  window.ethereum.on("accountsChanged", async (accounts) => {
    if (!accounts || accounts.length === 0) {
      currentAccount = null;
      signer = null;
      walletAddressEl.textContent = "Bağlı değil";
      connectBtn.textContent = "Cüzdan Bağla";
      resetContractDisplay();
      updateActionButtons();
      return;
    }

    currentAccount = ethers.getAddress(accounts[0]);
    walletAddressEl.textContent = currentAccount;
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    await initProviderAndCheckNetwork();
    if (isSepolia) {
      await loadContractData();
    }
  });

  window.ethereum.on("chainChanged", async () => {
    clearStatus();
    await initProviderAndCheckNetwork();
    if (currentAccount && isSepolia) {
      signer = await provider.getSigner();
      await loadContractData();
    }
  });
}