/* ============================================
   KasirKu POS — app.js
   ============================================ */

// ===== DEFAULT PRODUCTS =====
// Untuk mengganti gambar: isi kolom image dengan path file, contoh: 'images/namafile.jpg'
// Jika tidak ada gambar, isi dengan null maka akan tampil emoji
const DEFAULT_PRODUCTS = [
  // Makanan
  { id: 1,  name: 'Nasi Goreng Spesial',     price: 18000, stock: 20, emoji: '🍛', image: 'images/nasi-goreng.jpg' },
  { id: 2,  name: 'Mie Ayam',               price: 15000, stock: 15, emoji: '🍜', image: 'images/mie-ayam.jpg' },
  { id: 4,  name: 'Ayam Goreng Crispy',     price: 22000, stock: 12, emoji: '🍗', image: 'images/ayam-crispy.jpg' }, // ganti jika ada file ayam-crispy
  { id: 5,  name: 'Soto Ayam',              price: 20000, stock: 10, emoji: '🍲', image: 'images/soto-ayam.jpg' },
  { id: 6,  name: 'Bakso Urat',             price: 16000, stock: 18, emoji: '🍜', image: 'images/bakso.jpg' },
  { id: 9,  name: 'Rendang',                price: 28000, stock: 8,  emoji: '🥩', image: 'images/rendang.jpg' },
  { id: 10, name: 'Pisang Goreng',          price: 7000,  stock: 25, emoji: '🍌', image: 'images/pisang-goreng.jpg' },

  { id: 11, name: 'Chicken Mentai Bowl',    price: 22000, stock: 20, emoji: '🍚', image: 'images/chicken-mentai.jpg' },
  { id: 12, name: 'Dimsum Mentai',          price: 15000, stock: 30, emoji: '🥟', image: 'images/dimsum-mentai.jpg' },
  { id: 13, name: 'Corndog Mozzarella',     price: 18000, stock: 15, emoji: '🌭', image: 'images/corndog.jpg' },
  { id: 16, name: 'Chicken Salted Egg',     price: 25000, stock: 15, emoji: '🍗', image: 'images/salted-egg.jpg' },
  { id: 17, name: 'Tteokbokki',             price: 20000, stock: 12, emoji: '🍜', image: 'images/tteokbokki.jpg' },
  { id: 18, name: 'Croffle Ice Cream',      price: 18000, stock: 10, emoji: '🧇', image: 'images/croffle.jpg' },
  { id: 19, name: 'Rice Bowl Sambal Matah', price: 22000, stock: 15, emoji: '🍛', image: 'images/sambal-matah.jpg' },
  { id: 20, name: 'Ayam Geprek Mozza',      price: 23000, stock: 18, emoji: '🧀', image: 'images/geprek-mozza.jpg' },
  { id: 21, name: 'Mie Pedas Level 5',      price: 16000, stock: 20, emoji: '🌶️', image: 'images/mie-pedas.jpg' },
  { id: 22, name: 'French Fries Truffle',   price: 17000, stock: 14, emoji: '🍟', image: 'images/truffle-fries.jpg' },
  { id: 23, name: 'Chicken Popcorn',        price: 15000, stock: 16, emoji: '🍿', image: 'images/chicken-popcorn.jpg' },
  { id: 27, name: 'Banana Nugget',          price: 15000, stock: 15, emoji: '🍌', image: 'images/banana-nugget.jpg' },
  { id: 28, name: 'Dessert Box Coklat',     price: 18000, stock: 10, emoji: '🍰', image: 'images/dessert-box.jpg' },

  // Minuman
  { id: 3,  name: 'Es Teh Manis',           price: 5000,  stock: 50, emoji: '🥤', image: 'images/es-teh.jpg' },
  { id: 7,  name: 'Jus Jeruk',              price: 8000,  stock: 30, emoji: '🍊', image: 'images/jus-jeruk.jpg' },
  { id: 14, name: 'Matcha Latte',           price: 17000, stock: 25, emoji: '🍵', image: 'images/matcha-latte.jpg' },
  { id: 15, name: 'Mango Yakult',           price: 15000, stock: 20, emoji: '🥭', image: 'images/mango-yakult.jpg' }, // belum ada file mango yakult
  { id: 24, name: 'Thai Tea',               price: 12000, stock: 25, emoji: '🧋', image: 'images/thai-tea.jpg' },
  { id: 26, name: 'Es Kopi Gula Aren',      price: 18000, stock: 20, emoji: '☕', image: 'images/kopi-aren.jpg' }
];

// ===== STATE =====
let products  = loadData('pos_products') || DEFAULT_PRODUCTS.map(p => ({ ...p }));
let cart      = [];
const DEFAULT_SETTINGS = {
  storeName: 'Cafe g.e.n Z',
  address: 'Lumajang, Pasirian',
  phone: '082233178554',
  footer: 'Terima Kasih Sudah Berbelanja',
};
let settings = { ...DEFAULT_SETTINGS, ...loadData('pos_settings') };
let editingImgProductId = null;
let txCounter = loadData('pos_tx_counter') || 1;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  applySettings();
  renderProducts();
  updateDatetime();
  setInterval(updateDatetime, 1000);
  generateQuickPay();
  createToastContainer();
});

// ===== DATETIME =====
function updateDatetime() {
  const now = new Date();
  const opts = { weekday:'short', day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12: false };
  document.getElementById('datetime').textContent = now.toLocaleString('id-ID', opts);
}

// ===== SETTINGS =====
function openSettings() {
  document.getElementById('setting-store-name').value    = settings.storeName;
  document.getElementById('setting-store-address').value = settings.address;
  document.getElementById('setting-store-phone').value   = settings.phone;
  document.getElementById('setting-receipt-footer').value = settings.footer;
  openModal('settings-modal');
}

function saveSettings() {
  settings.storeName = document.getElementById('setting-store-name').value || 'KasirKu';
  settings.address   = document.getElementById('setting-store-address').value;
  settings.phone     = document.getElementById('setting-store-phone').value;
  settings.footer    = document.getElementById('setting-receipt-footer').value;
  saveData('pos_settings', settings);
  applySettings();
  closeSettings();
  toast('Pengaturan disimpan ✓', 'success');
}

function applySettings() {
  document.getElementById('store-name-display').textContent = settings.storeName;
  document.title = settings.storeName + ' — KasirKu';
}

function closeSettings()     { closeModal('settings-modal'); }
function closeSettingsModal(e) { if (e.target.id === 'settings-modal') closeSettings(); }

// ===== RENDER PRODUCTS =====
function renderProducts(filter = '') {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  filtered.forEach(p => {
    const oos = p.stock <= 0;
    const stockClass = p.stock === 0 ? 'stock-empty' : p.stock <= 5 ? 'stock-low' : 'stock-ok';
    const stockText  = p.stock === 0 ? 'Habis' : `Stok: ${p.stock}`;

    const card = document.createElement('div');
    card.className = 'product-card' + (oos ? ' out-of-stock' : '');
    card.innerHTML = `
      <div class="product-img-wrap">
        ${p.image
          ? `<img src="${p.image}" alt="${p.name}" />`
          : `<div class="product-emoji">${p.emoji}</div>`}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${formatRp(p.price)}</div>
        <div class="product-stock-row">
          <span class="product-stock-badge ${stockClass}">${stockText}</span>
          <button class="btn-add-cart" onclick="addToCart(event, ${p.id})" ${oos ? 'disabled' : ''} title="Tambah ke keranjang">+</button>
        </div>
      </div>
    `;
    if (!oos) card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn-add-cart') && !e.target.classList.contains('product-img-edit')) {
        addToCart(e, p.id);
      }
    });
    grid.appendChild(card);
  });
}

function filterProducts() {
  renderProducts(document.getElementById('search-input').value);
}

// ===== CART =====
function addToCart(e, productId) {
  e && e.stopPropagation();
  const p = products.find(x => x.id === productId);
  if (!p || p.stock <= 0) return;

  const existing = cart.find(x => x.id === productId);
  if (existing) {
    if (existing.qty >= p.stock) { toast(`Stok ${p.name} tidak cukup`, 'error'); return; }
    existing.qty++;
  } else {
    cart.push({ id: p.id, name: p.name, price: p.price, qty: 1, emoji: p.emoji, image: p.image });
  }

  renderCart();
  updateTotal();
  toast(`+ ${p.name}`, 'success');
}

function removeFromCart(productId) {
  cart = cart.filter(x => x.id !== productId);
  renderCart();
  updateTotal();
}

function changeQty(productId, delta) {
  const item = cart.find(x => x.id === productId);
  const prod = products.find(x => x.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty > prod.stock) { item.qty = prod.stock; toast(`Stok ${item.name} maks ${prod.stock}`, 'error'); return; }
  if (item.qty <= 0) { removeFromCart(productId); return; }
  renderCart();
  updateTotal();
}

function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  document.getElementById('discount-input').value = '';
  document.getElementById('payment-input').value  = '';
  renderCart();
  updateTotal();
  toast('Keranjang dikosongkan');
}

function renderCart() {
  const list  = document.getElementById('cart-list');
  const empty = document.getElementById('cart-empty');

  // Hapus semua item kecuali cart-empty
  Array.from(list.children).forEach(child => {
    if (child.id !== 'cart-empty') child.remove();
  });

  if (cart.length === 0) {
    empty.style.display = 'flex';
    document.getElementById('btn-pay').disabled = true;
    updateCartBadge();
    return;
  }

  empty.style.display = 'none';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-img">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : item.emoji}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatRp(item.price)}/pcs</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
      </div>
      <div class="cart-item-total">${formatRp(item.price * item.qty)}</div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    `;
    list.appendChild(div);
  });

  document.getElementById('btn-pay').disabled = false;
  updateCartBadge();
}

// ===== TOTALS =====
function getSubtotal() { return cart.reduce((sum, x) => sum + x.price * x.qty, 0); }

function updateTotal() {
  const sub  = getSubtotal();
  const disc = parseFloat(document.getElementById('discount-input').value) || 0;
  const total = Math.round(sub * (1 - disc / 100));

  document.getElementById('subtotal-display').textContent = formatRp(sub);
  document.getElementById('total-display').textContent    = formatRp(total);

  updateChange();
  generateQuickPay(total);
}

function updateChange() {
  const disc  = parseFloat(document.getElementById('discount-input').value) || 0;
  const total = Math.round(getSubtotal() * (1 - disc / 100));
  const bayar = parseFloat(document.getElementById('payment-input').value) || 0;
  const kembalian = bayar - total;

  const el = document.getElementById('change-display');
  if (bayar === 0) {
    el.textContent = 'Rp 0';
    el.style.color = '';
  } else if (kembalian < 0) {
    el.textContent = '– ' + formatRp(Math.abs(kembalian));
    el.style.color = 'var(--red)';
  } else {
    el.textContent = formatRp(kembalian);
    el.style.color = 'var(--green)';
  }
}

function generateQuickPay(total) {
  if (!total) total = Math.round(getSubtotal() * (1 - (parseFloat(document.getElementById('discount-input')?.value)||0)/100));
  const wrap = document.getElementById('quick-btns');
  if (!wrap) return;
  wrap.innerHTML = '';
  if (total <= 0) return;

  const rounds = [total, roundUp(total, 1000), roundUp(total, 2000), roundUp(total, 5000), roundUp(total, 10000), roundUp(total, 20000), roundUp(total, 50000), roundUp(total, 100000)];
  const unique = [...new Set(rounds)].slice(0, 4);

  unique.forEach(v => {
    const btn = document.createElement('button');
    btn.className = 'quick-btn';
    btn.textContent = formatRpShort(v);
    btn.onclick = () => {
      document.getElementById('payment-input').value = v;
      updateChange();
    };
    wrap.appendChild(btn);
  });
}

function roundUp(val, to) {
  return Math.ceil(val / to) * to;
}

// ===== PROCESS TRANSACTION =====
function processTransaction() {
  if (cart.length === 0) return;

  const disc  = parseFloat(document.getElementById('discount-input').value) || 0;
  const sub   = getSubtotal();
  const total = Math.round(sub * (1 - disc / 100));
  const bayar = parseFloat(document.getElementById('payment-input').value) || 0;

  if (bayar < total) {
    toast('Pembayaran kurang!', 'error');
    return;
  }

  // Kurangi stok
  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    if (p) p.stock -= item.qty;
  });
  saveData('pos_products', products);

  const txId = 'TX' + String(txCounter).padStart(5, '0');
  txCounter++;
  saveData('pos_tx_counter', txCounter);

  const customerName = document.getElementById('customer-name').value.trim();
  showReceipt({ txId, cart: [...cart], sub, disc, total, bayar, kembalian: bayar - total, date: new Date(), customerName });

  // Reset
  cart = [];
  document.getElementById('discount-input').value = '';
  document.getElementById('payment-input').value  = '';
  document.getElementById('customer-name').value  = '';
  renderCart();
  updateTotal();
  renderProducts(document.getElementById('search-input').value);
}

// ===== RECEIPT =====
function showReceipt({ txId, cart, sub, disc, total, bayar, kembalian, date, customerName }) {
  const el = document.getElementById('receipt-content');
  const dateStr = date.toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' });
  const timeStr = date.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit', second:'2-digit' });

  let itemsHtml = cart.map(i => `
    <div class="r-item">
      <div class="r-item-name">${i.name}</div>
      <div class="r-row">
        <span>${i.qty} x ${formatRp(i.price)}</span>
        <span>${formatRp(i.price * i.qty)}</span>
      </div>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="r-store">
      <h3>${settings.storeName}</h3>
      <p>${settings.address}</p>
      <p>${settings.phone}</p>
    </div>
    <hr class="r-divider" />
    <div class="r-row"><span>Tanggal</span><span>${dateStr}</span></div>
    <div class="r-row"><span>Waktu</span><span>${timeStr}</span></div>
    <div class="r-row"><span>No. Struk</span><span>${txId}</span></div>
    <div class="r-row"><span>Kasir</span><span>Admin</span></div>
    ${customerName ? `<div class="r-row"><span>Pelanggan</span><span>${customerName}</span></div>` : ''}
    <hr class="r-divider" />
    ${itemsHtml}
    <hr class="r-divider" />
    <div class="r-row bold"><span>Subtotal</span><span>${formatRp(sub)}</span></div>
    ${disc > 0 ? `<div class="r-row accent"><span>Diskon (${disc}%)</span><span>- ${formatRp(Math.round(sub * disc / 100))}</span></div>` : ''}
    <div class="r-row bold" style="font-size:1.05rem"><span>TOTAL</span><span>${formatRp(total)}</span></div>
    <hr class="r-divider" />
    <div class="r-row"><span>Tunai</span><span>${formatRp(bayar)}</span></div>
    <div class="r-row green bold"><span>Kembalian</span><span>${formatRp(kembalian)}</span></div>
    <hr class="r-divider" />
    <div class="r-footer">${settings.footer}</div>
    <div class="r-txid">${txId} · ${timeStr}</div>
  `;

  // Store receipt data for PDF
  el.dataset.txId     = txId;
  el.dataset.dateStr  = dateStr;
  el.dataset.timeStr  = timeStr;
  el.dataset.sub      = sub;
  el.dataset.disc     = disc;
  el.dataset.total    = total;
  el.dataset.bayar    = bayar;
  el.dataset.kembalian= kembalian;
  el.dataset.items        = JSON.stringify(cart);
  el.dataset.customerName = customerName || '';

  openModal('receipt-modal');
}

function closeReceipt()    { closeModal('receipt-modal'); }
function closeReceiptModal(e) { if (e.target.id === 'receipt-modal') closeReceipt(); }

// ===== PRINT =====
function printReceipt() {
  const content = document.getElementById('receipt-content').innerHTML;
  const win = window.open('', '_blank', 'width=400,height=700');
  win.document.write(`
    <html><head><title>Struk</title>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
      :root { --accent:#f5a623; --text:#111; --text2:#555; --text3:#999; --green:#2a9d5c; --border2:#ccc; }
      body { font-family:'DM Mono',monospace; font-size:12px; padding:20px; max-width:320px; margin:0 auto; color:#111; }
      .r-store { text-align:center; margin-bottom:10px; }
      .r-store h3 { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:#f5a623; margin:0 0 4px; }
      .r-store p { color:#555; font-size:11px; margin:2px 0; }
      .r-divider { border:none; border-top:1px dashed #ccc; margin:8px 0; }
      .r-row { display:flex; justify-content:space-between; margin:2px 0; }
      .r-row.bold { font-weight:700; }
      .r-row.accent { color:#f5a623; }
      .r-row.green { color:#2a9d5c; font-weight:700; }
      .r-item { margin:4px 0; }
      .r-item-name { color:#555; }
      .r-footer { text-align:center; color:#999; font-size:10px; margin-top:12px; }
      .r-txid { text-align:center; color:#bbb; font-size:9px; margin-top:3px; }
    </style></head><body>${content}</body></html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 500);
}

// ===== DOWNLOAD PDF =====
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const el = document.getElementById('receipt-content');

  const txId      = el.dataset.txId;
  const dateStr   = el.dataset.dateStr;
  const timeStr   = el.dataset.timeStr;
  const sub       = Number(el.dataset.sub);
  const disc      = Number(el.dataset.disc);
  const total     = Number(el.dataset.total);
  const bayar     = Number(el.dataset.bayar);
  const kembalian = Number(el.dataset.kembalian);
  const items        = JSON.parse(el.dataset.items || '[]');
  const customerName = el.dataset.customerName || '';

  const doc = new jsPDF({ unit: 'mm', format: [80, 200], orientation: 'portrait' });
  const W = 80;
  let y = 10;

  const lineH = 5;
  const pad   = 6;

  const center = (text, yy, size = 10, style = 'normal') => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.text(text, W / 2, yy, { align: 'center' });
  };

  const row = (left, right, yy, size = 9, style = 'normal') => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.text(left, pad, yy);
    doc.text(right, W - pad, yy, { align: 'right' });
  };

  const divider = (yy) => {
    doc.setDrawColor(180, 180, 180);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(pad, yy, W - pad, yy);
    doc.setLineDashPattern([], 0);
  };

  // Header
  doc.setTextColor(230, 150, 40);
  center(settings.storeName, y, 14, 'bold');
  y += 6;
  doc.setTextColor(120, 120, 120);
  center(settings.address, y, 8);
  y += 4;
  center(settings.phone, y, 8);
  y += 6;

  divider(y); y += 5;
  doc.setTextColor(50, 50, 50);

  row('Tanggal', dateStr, y, 8); y += lineH;
  row('Waktu',   timeStr, y, 8); y += lineH;
  row('No. Struk', txId, y, 8); y += lineH;
  row('Kasir', 'Admin', y, 8); y += lineH;
  if (customerName) { row('Pelanggan', customerName, y, 8); y += lineH; }
  y += 2;

  divider(y); y += 5;

  items.forEach(item => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(item.name, pad, y);
    y += lineH - 1;
    row(`${item.qty} x ${formatRp(item.price)}`, formatRp(item.price * item.qty), y, 8);
    y += lineH;
  });

  y += 2;
  divider(y); y += 5;

  row('Subtotal', formatRp(sub), y, 9); y += lineH;
  if (disc > 0) {
    doc.setTextColor(230, 150, 40);
    row(`Diskon (${disc}%)`, `- ${formatRp(Math.round(sub * disc / 100))}`, y, 9); y += lineH;
    doc.setTextColor(50, 50, 50);
  }
  doc.setFont('helvetica', 'bold');
  row('TOTAL', formatRp(total), y, 10, 'bold'); y += lineH + 1;

  divider(y); y += 5;
  doc.setFont('helvetica', 'normal');
  row('Tunai', formatRp(bayar), y, 9); y += lineH;
  doc.setTextColor(40, 160, 90);
  doc.setFont('helvetica', 'bold');
  row('Kembalian', formatRp(kembalian), y, 9, 'bold'); y += lineH + 4;

  divider(y); y += 6;
  doc.setTextColor(150, 150, 150);
  center(settings.footer, y, 8);
  y += 5;
  doc.setFontSize(7);
  center(`${txId} · ${timeStr}`, y);

  // Resize height to content
  const pages = doc.internal.pages;
  doc.save(`Struk-${txId}.pdf`);
  toast('PDF diunduh ✓', 'success');
}

// ===== STOCK MANAGER =====
function openStockManager() {
  const list = document.getElementById('stock-list');
  list.innerHTML = '';

  products.forEach(p => {
    const row = document.createElement('div');
    row.className = 'stock-row';
    row.innerHTML = `
      <div class="stock-row-img">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" />` : p.emoji}
      </div>
      <div class="stock-row-name">${p.name}</div>
      <div class="stock-row-price">
        <input type="number" id="price-${p.id}" value="${p.price}" min="0" placeholder="Harga" />
      </div>
      <div class="stock-qty-wrap">
        <button class="qty-btn" onclick="adjustStockInput(${p.id}, -1)">−</button>
        <input type="number" id="stock-${p.id}" value="${p.stock}" min="0" />
        <button class="qty-btn" onclick="adjustStockInput(${p.id}, +1)">+</button>
      </div>
      <button class="stock-save-btn" onclick="saveStock(${p.id})">Simpan</button>
    `;
    list.appendChild(row);
  });

  openModal('stock-modal');
}

function adjustStockInput(id, delta) {
  const input = document.getElementById(`stock-${id}`);
  const val = Math.max(0, (parseInt(input.value) || 0) + delta);
  input.value = val;
}

function saveStock(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const newStock = parseInt(document.getElementById(`stock-${id}`).value) || 0;
  const newPrice = parseInt(document.getElementById(`price-${id}`).value) || p.price;
  p.stock = newStock;
  p.price = newPrice;
  saveData('pos_products', products);
  renderProducts(document.getElementById('search-input').value);
  toast(`${p.name} disimpan ✓`, 'success');
}

function closeStockManager()    { closeModal('stock-modal'); }
function closeStockModal(e)     { if (e.target.id === 'stock-modal') closeStockManager(); }

// ===== MODAL HELPERS =====
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ===== TOAST =====
function createToastContainer() {
  const el = document.createElement('div');
  el.id = 'toast-container';
  el.className = 'toast-container';
  document.body.appendChild(el);
}

function toast(msg, type = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

// ===== FORMAT HELPERS =====
function formatRp(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

function formatRpShort(n) {
  if (n >= 1000000) return 'Rp ' + (n/1000000).toFixed(n%1000000===0?0:1) + 'jt';
  if (n >= 1000)    return 'Rp ' + (n/1000).toFixed(n%1000===0?0:1) + 'rb';
  return 'Rp ' + n;
}

// ===== LOCALSTORAGE =====
function saveData(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}
function loadData(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch(e) { return null; }
}

// ===== MOBILE TABS =====
function switchTab(tab) {
  const produk     = document.getElementById('panel-produk');
  const keranjang  = document.getElementById('panel-keranjang');
  const tabProduk  = document.getElementById('tab-produk');
  const tabKeranjang = document.getElementById('tab-keranjang');

  if (tab === 'produk') {
    produk.classList.remove('tab-hidden');
    keranjang.classList.add('tab-hidden');
    tabProduk.classList.add('active');
    tabKeranjang.classList.remove('active');
  } else {
    keranjang.classList.remove('tab-hidden');
    produk.classList.add('tab-hidden');
    tabKeranjang.classList.add('active');
    tabProduk.classList.remove('active');
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const total = cart.reduce((sum, x) => sum + x.qty, 0);
  if (total > 0) {
    badge.textContent = total;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}
