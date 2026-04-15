// ==========================================
// app.js – Shared Utilities & Data Store
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyDn-9tGJRo8orusYbIxAGQWTzRP6gph1h0",
  authDomain: "rm-pondokmarisa.firebaseapp.com",
  projectId: "rm-pondokmarisa",
  storageBucket: "rm-pondokmarisa.firebasestorage.app",
  messagingSenderId: "1085910653749",
  appId: "1:1085910653749:web:b1206590c1d4353b8a4a7c",
  measurementId: "G-89V7JTGX83"
};

// Initialize Firebase dengan penanganan error yang aman
let db = null;
try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('[MarisaPOS] Firebase Firestore terhubung:', firebaseConfig.projectId);
    }
} catch (e) {
    console.error('[MarisaPOS] Firebase gagal init, pakai localStorage:', e.message);
    db = null;
}

const DB = {
    async load(key) {
        try {
            if (db) {
                const docSnap = await db.collection('PondokMarisaPOS').doc(key).get();
                if (docSnap.exists) {
                    return docSnap.data().data;
                }
            }
            // Offline fallback
            const raw = localStorage.getItem(key);
            if (raw) return JSON.parse(raw);
            
            return getDefault(key);
        } catch (error) {
            console.error("Error loading data for key: " + key, error);
            const raw = localStorage.getItem(key);
            if (raw) return JSON.parse(raw);
            return getDefault(key);
        }
    },
    async save(key, data) {
        try {
            if (db) {
                await db.collection('PondokMarisaPOS').doc(key).set({
                    data: data,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            // Local backup
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error("Error saving data for key: " + key, error);
            localStorage.setItem(key, JSON.stringify(data));
            return false;
        }
    }
};

function getDefault(key) {
    if (key === 'produk') return [
        { id: 1, nama: 'Ayam Goreng Kalasan', harga: 20000, kategori: 'Makanan', variasi: ['Dada', 'Paha'] },
        { id: 2, nama: 'Nasi Ayam Kremes', harga: 25000, kategori: 'Makanan', variasi: ['Dada', 'Paha'] },
        { id: 3, nama: 'Es Teh Manis', harga: 5000, kategori: 'Minuman' },
        { id: 4, nama: 'Es Jeruk', harga: 7000, kategori: 'Minuman' },
        { id: 5, nama: 'Air Putih', harga: 1000, kategori: 'Minuman' },
        { id: 6, nama: 'Ayam Ungkep', harga: 18000, kategori: 'Makanan' },
    ];
    if (key === 'transaksi') return [];
    if (key === 'kategori') return ['Makanan', 'Minuman', 'Cemilan', 'Paket', 'Lainnya'];
    if (key === 'pengaturan') return {
        merchantName: 'RM.PONDOK MARISA 2008',
        address: 'Perumahan Bukit Dago, Jl. Ps. Jengkol Jl. Pendidikan Blok BDU No.81.',
        phone: '085101191675',
        footer: 'Terimakasih sudah order di Rm.Pondok marisa. Jangan lupa untuk langsung di buka ya supaya tidak lembab! Kami juga menerima orderan nasi box untuk berbagai acara.',
        logo: '',
        taxRate: 10,
        bankName: 'BCA',
        bankAccount: '1234567890',
        bluetoothPrinter: null,
        instagram: '',
        googleMaps: '',
        tiktok: '',
        goFood: '',
        grabFood: ''
    };
    return [];
}

// Format Rupiah - Added fallback for safety
function formatRp(num) {
    const val = num ? Number(num) : 0;
    return 'Rp ' + val.toLocaleString('id-ID');
}

// Format tanggal
function formatTanggal(iso) {
    if (!iso) return '-';
    try {
        const d = new Date(iso);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return '-';
    }
}

function formatWaktu(iso) {
    if (!iso) return '-';
    try {
        const d = new Date(iso);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return '-';
    }
}

// Generate ID unik
function genId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Nomor faktur
function genNomorFaktur() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `INV-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${String(genId()).slice(-4)}`;
}

// sidebar active link
function setActiveNav(page) {
    document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('bg-indigo-700', 'text-white', 'shadow-lg', 'shadow-indigo-900/20');
        el.classList.add('text-indigo-100', 'hover:bg-indigo-700/50');
    });
    const active = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (active) {
        active.classList.add('bg-indigo-700', 'text-white', 'shadow-lg', 'shadow-indigo-900/20');
        active.classList.remove('text-indigo-100', 'hover:bg-indigo-700/50');
    }
}
