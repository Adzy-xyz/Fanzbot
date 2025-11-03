const rowMenu = [
	{
		title: "[#] All Menu",
		description: "Menampilkan semua menu",
		id: "-menu all"
	},
	{
		title: "[>] Mains Menu",
		description: "Menampilkan menu utama",
		id: "-menu main"
	},
	{
		title: "[>] AI Menu",
		description: "Menampilkan menu AI Chat",
		id: "-menu ai-chat"
	},
	{
		title: "[>] Downloader",
		description: "Menampilkan fitur downloads",
		id: "-menu downloader"
	},
	{
		title: "[>] Anime",
		description: "Menampilkan menu anime",
		id: "-menu anime"
	},
	{
		title: "[>] Menu Gabutz",
		description: "Menampilkan menu gabut",
		id: "-menu gabut"
	},
	{
		title: "[>] Funny",
		description: "Menampilkan menu funs",
		id: "-menu fun"
	},
	{
		title: "[>] Games Menu",
		description: "Menampilkan menu games",
		id: "-menu game"
	},
	{
		title: "[>] Maker Menu",
		description: "Menampilkan menu maker",
		id: "-menu maker"
	},
	{
		title: "[>] Groups",
		description: "Menampilkan menu grup",
		id: "-menu group"
	},
	{
		title: "[>] Informations",
		description: "Menampilkan menu info",
		id: "-menu info"
	},
	{
		title: "[>] Owner Menu",
		description: "Menampilkan menu developer",
		id: "-menu owner"
	},
	{
		title: "[>] Sticker Menu",
		description: "Menampilkan menu stiker",
		id: "-menu sticker"
	},
	{
		title: "[>] Searching",
		description: "Menampilkan menu search",
		id: "-menu search"
	},
	{
		title: "[>] Tools",
		description: "Menampilkan menu tools",
		id: "-menu tools"
	},
	{
		title: "[>] Formatter Text",
		description: "Menampilkan menu formatter",
		id: "-menu formatter"
	},
	{
		title: "[>] Utility Features",
		description: "Menampilkan menu utility",
		id: "-menu utility"
	}
];

const rowPop = [
	{ title: "[+] Brat", description: "Buat sticker teks", id: "-brat" },
	{
		title: "[+] BratVid",
		description: "Buat sticker teks gif",
		id: "-bratvid"
	},
	{ title: "[+] Play", description: "Mencari dan memutar musik", id: "-play" }
];

const sections = [
	{
		title: "[!] Daftar Menu",
		highlight_label: "[-] Semua Kategori",
		rows: rowMenu
	},
	{
		title: "[!] Menu Populer",
		highlight_label: "[-] Fitur Paling Dipakai",
		rows: rowPop
	}
];

const rowSalah = [
	{
		name: "single_select",
		buttonParamsJson: JSON.stringify({
			title: "[!] Pilih Menu",
			sections: [
				{
					title: "[#] Pilihan Utama",
					highlight_label: "[-] Paling Umum",
					rows: [
						{
							title: "[>] Menu",
							description: "Menampilkan List Kategori",
							id: "-menu"
						},
						{
							title: "[>] Mains",
							description: "Menampilkan Menu Utama",
							id: "-menu main"
						},
						{
							title: "[>] All",
							description: "Menampilkan Semua Menu",
							id: "-menu all"
						}
					]
				}
			]
		})
	}
];

const interAktif = [
	{
		name: "single_select",
		buttonParamsJson: JSON.stringify({
			title: "[>] Pilih Menu di Bawah",
			sections
		})
	},
	{
		name: "quick_reply",
		buttonParamsJson: JSON.stringify({
			display_text: "[#] Info Script",
			id: "-script"
		})
	},
	{
		name: "open_webview",
		buttonParamsJson: JSON.stringify({
			title: "[+] Owner",
			link: { url: cfg.bot.ownerUrl }
		})
	}
];

export { interAktif, rowSalah};
