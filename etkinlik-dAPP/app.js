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
    return "İşlem MetaMask üzerinden iptal edildi.";
  }
  if (err?.reason) {
    return `Sözleşme işlemi reddetti: ${err.reason}`;
  }
  if (err?.shortMessage) {
    return err.shortMessage;
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
    setStatus("Kayıt işlemi için MetaMask onayı bekleniyor...", "info");

    signer = await provider.getSigner();
    const writeContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const tx = await writeContract.kayitOl(takmaAd);
    const txUrl = `https://sepolia.etherscan.io/tx/${tx.hash}`;
    setStatus(
      `Kayıt işlemi gönderildi, blok onayı bekleniyor... <a href="${txUrl}" target="_blank" rel="noopener noreferrer">Etherscan'de Görüntüle</a>`,
      "info"
    );

    await tx.wait();
    nicknameInput.value = "";
    await loadContractData();

    setStatus(
      `Kayıt başarıyla tamamlandı ve ekran güncellendi. <a href="${txUrl}" target="_blank" rel="noopener noreferrer">İşlem Detayı</a>`,
      "success"
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
    setStatus("Giriş onayı için MetaMask imzası bekleniyor...", "info");

    signer = await provider.getSigner();
    const writeContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const tx = await writeContract.girisOnayla(participantAddr);
    const txUrl = `https://sepolia.etherscan.io/tx/${tx.hash}`;
    setStatus(
      `Giriş onayı gönderildi, blok onayı bekleniyor... <a href="${txUrl}" target="_blank" rel="noopener noreferrer">Etherscan'de Görüntüle</a>`,
      "info"
    );

    await tx.wait();
    participantAddressInput.value = "";
    await loadContractData();

    setStatus(
      `Katılımcı girişi başarıyla onaylandı ve ekran güncellendi. <a href="${txUrl}" target="_blank" rel="noopener noreferrer">İşlem Detayı</a>`,
      "success"
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