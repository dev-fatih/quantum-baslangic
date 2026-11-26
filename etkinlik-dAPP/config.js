// ============================================================================
// İP 23 YAPILANDIRMA DOSYASI
// Sözleşme adresi ve ABI bu dosyada tanımlanır.
// ============================================================================

export const SEPOLIA_CHAIN_ID = 11155111n;
export const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";

// İP 23'te Sepolia ağına deploy ettiğiniz sözleşme adresini buraya yazın:
export const CONTRACT_ADDRESS = "0xcdc5d6ef8eebfc2601961e95363f00e0ef7fa30a";

// İP 23'te Remix üzerinden elde edilen sözleşme ABI tanımı:
export const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_katilimci",
				"type": "address"
			}
		],
		"name": "girisOnayla",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "katilimci",
				"type": "address"
			}
		],
		"name": "GirisOnaylandi",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_takmaAd",
				"type": "string"
			}
		],
		"name": "kayitOl",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "katilimci",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "takmaAd",
				"type": "string"
			}
		],
		"name": "KayitOlundu",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "etkinlikAdi",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "girisYaptiMi",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "gorevli",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "kapasite",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "katilimcilar",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "toplamKayit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];