import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';
import { hawawshiMenu, butcheryMenu } from './data.js';

const WHATSAPP_NUMBER = '201094163304'; // Test number

const CAROUSEL_IMAGES = [
  'https://i.ibb.co/m1ZcW8q/images.jpg',
  'https://i.ibb.co/0jtTmDZq/images-17.jpg',
  'https://i.ibb.co/xSQsnnND/images-16.jpg',
  'https://i.ibb.co/SDMd49JQ/images-15.jpg',
  'https://i.ibb.co/yB4bc7B3/images-14.jpg',
  'https://i.ibb.co/5xkdJS9k/images-13.jpg',
  'https://i.ibb.co/hJRjpzGP/images-12.jpg',
  'https://i.ibb.co/jkxVR2Y8/images-11.jpg',
  'https://i.ibb.co/F4SJdtVH/images-10.jpg',
  'https://i.ibb.co/Y98Kydt/images-9.jpg',
  'https://i.ibb.co/PZctkXBQ/images-8.jpg',
  'https://i.ibb.co/ZRT9Cc2Y/images-7.jpg',
  'https://i.ibb.co/mCXCV0Cz/images-6.jpg',
  'https://i.ibb.co/wFBhYGxj/images-5.jpg',
  'https://i.ibb.co/gF4MPXYb/images-4.jpg',
  'https://i.ibb.co/SXMQpVSk/images-3.jpg',
  'https://i.ibb.co/zh8NcVFC/images-2.jpg',
  'https://i.ibb.co/ZRyvr7dB/images-1.jpg',
];

// ── Carousel ──────────────────────────────────────────────────────────
function Carousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % CAROUSEL_IMAGES.length);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(next, 3200);
    return () => clearInterval(timerRef.current);
  }, [next]);

  return (
    <div className="carousel-section">
      <div
        className="carousel-track"
        style={{ transform: `translateX(${current * 100}%)` }}
      >
        {CAROUSEL_IMAGES.map((src, i) => (
          <div className="carousel-slide" key={i}>
            <img src={src} alt={`food-${i}`} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="carousel-overlay" />
          </div>
        ))}
      </div>

      <div className="carousel-brand">
        <h1>🥩 حواوشي الربيع</h1>
        <p>اطلب أكلك المفضل وهيوصلك على طول</p>
      </div>

      <div className="carousel-dots">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === current ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`صورة ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Item Card ─────────────────────────────────────────────────────────
function ItemCard({ item, qty, onAdd, onRemove }) {
  return (
    <div className={`item-card${qty > 0 ? ' in-cart' : ''}`} onClick={qty === 0 ? onAdd : undefined}>
      <div className="item-info">
        <div className="item-name">{item.name}</div>
        {item.desc && <div className="item-desc">{item.desc}</div>}
      </div>
      <div className="item-right">
        <div className="item-price">{item.price} جنيه</div>
        {qty === 0 ? (
          <button className="add-btn" onClick={(e) => { e.stopPropagation(); onAdd(); }} aria-label="أضف">＋</button>
        ) : (
          <div className="qty-controls" onClick={e => e.stopPropagation()}>
            <button className="qty-btn" onClick={onAdd} aria-label="أضف">＋</button>
            <span className="qty-val">{qty}</span>
            <button className="qty-btn minus" onClick={onRemove} aria-label="أزل">－</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Category Section ──────────────────────────────────────────────────
function CategorySection({ category, items, cart, onAdd, onRemove }) {
  return (
    <div className="category-section">
      <div className="category-header">
        <span className="category-icon">🍽️</span>
        <h2>{category}</h2>
      </div>
      {items.map((item, i) => (
        <ItemCard
          key={i}
          item={item}
          qty={cart[`${category}__${item.name}`] || 0}
          onAdd={() => onAdd(category, item)}
          onRemove={() => onRemove(category, item)}
        />
      ))}
    </div>
  );
}

// ── Cart Drawer ────────────────────────────────────────────────────────
function CartDrawer({ cartItems, total, onClose, onAdd, onRemove }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [sent, setSent] = useState(false);

  function handleOrder() {
    if (!name.trim() || !address.trim()) return;

    const lines = cartItems.map(
      ({ item, qty }) => `• ${item.name} × ${qty} = ${item.price * qty} جنيه`
    );

    const msg = [
      `🛒 *طلب جديد من حواوشي الربيع*`,
      ``,
      `👤 *الاسم:* ${name.trim()}`,
      `📍 *العنوان:* ${address.trim()}`,
      ``,
      `*الأصناف:*`,
      ...lines,
      ``,
      `💰 *الإجمالي: ${total} جنيه*`,
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setSent(true);
  }

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>🛒 طلبك ({cartItems.length} صنف)</h2>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        <div className="drawer-items">
          {cartItems.map(({ item, qty, category }, i) => (
            <div className="drawer-item" key={i}>
              <div className="drawer-item-name">{item.name}</div>
              <div className="qty-controls">
                <button className="qty-btn" onClick={() => onAdd(category, item)}>＋</button>
                <span className="qty-val">{qty}</span>
                <button className="qty-btn minus" onClick={() => onRemove(category, item)}>－</button>
              </div>
              <div className="drawer-item-subtotal">{item.price * qty} جنيه</div>
            </div>
          ))}
        </div>

        <div className="drawer-footer">
          <div className="drawer-total">
            <span>الإجمالي</span>
            <span>{total} جنيه</span>
          </div>

          {!sent ? (
            <div className="checkout-form">
              <input
                type="text"
                placeholder="اسمك ✍️"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={60}
              />
              <textarea
                placeholder="عنوان التوصيل بالتفصيل 📍"
                value={address}
                onChange={e => setAddress(e.target.value)}
                maxLength={200}
              />
              <button
                className="whatsapp-btn"
                onClick={handleOrder}
                disabled={!name.trim() || !address.trim()}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.549 4.116 1.51 5.845L.057 23.454a.75.75 0 0 0 .919.92l5.733-1.503A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.728 9.728 0 0 1-4.98-1.366l-.356-.213-3.697.969.987-3.6-.234-.37A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
                اطلب عن طريق واتساب
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '2.5rem' }}>✅</div>
              <p style={{ fontWeight: 700, marginTop: 8, color: 'var(--green)' }}>تم فتح واتساب!</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>ابعت الرسالة وهنبدأ تحضير طلبك 🔥</p>
              <button
                style={{ marginTop: 16, background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 999, padding: '10px 24px', fontFamily: 'Cairo', cursor: 'pointer', fontSize: '0.9rem' }}
                onClick={() => { setSent(false); onClose(); }}
              >
                إضافة المزيد
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('hawawshi');
  const [cart, setCart] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menu = activeTab === 'hawawshi' ? hawawshiMenu : butcheryMenu;

  function cartKey(category, item) {
    return `${category}__${item.name}`;
  }

  function handleAdd(category, item) {
    setCart(prev => {
      const key = cartKey(category, item);
      return { ...prev, [key]: (prev[key] || 0) + 1, [`__data__${key}`]: { item, category } };
    });
  }

  function handleRemove(category, item) {
    setCart(prev => {
      const key = cartKey(category, item);
      const qty = (prev[key] || 0) - 1;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[key];
        delete next[`__data__${key}`];
        return next;
      }
      return { ...prev, [key]: qty };
    });
  }

  // Build flat list of cart items for the drawer
  const cartItems = Object.entries(cart)
    .filter(([k]) => !k.startsWith('__data__'))
    .filter(([, qty]) => qty > 0)
    .map(([key, qty]) => {
      const data = cart[`__data__${key}`];
      return { ...data, qty };
    });

  const totalItems = cartItems.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cartItems.reduce((s, c) => s + c.item.price * c.qty, 0);

  // Lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <>
      {/* SEO */}
      <title>منيو حواوشي الربيع | اطلب اونلاين</title>

      {/* Hero Carousel */}
      <Carousel />

      {/* Tabs */}
      <div className="tab-bar">
        <button
          id="tab-hawawshi"
          className={`tab-btn${activeTab === 'hawawshi' ? ' active' : ''}`}
          onClick={() => setActiveTab('hawawshi')}
        >
          🍔 منيو حواوشي الربيع
        </button>
        <button
          id="tab-butchery"
          className={`tab-btn${activeTab === 'butchery' ? ' active' : ''}`}
          onClick={() => setActiveTab('butchery')}
        >
          🥩 منيو جزارة الربيع
        </button>
      </div>

      {/* Menu Items */}
      <main className="menu-content">
        {activeTab === 'butchery' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(212,160,23,0.15), rgba(212,160,23,0.05))',
            border: '1px solid rgba(212,160,23,0.3)',
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            color: 'var(--gold-light, #f0c040)',
            lineHeight: 1.6
          }}>
            🥩 <strong>جزارة الربيع</strong> — لحوم طازجة يومياً. الأسعار بالكيلو إلا إذا ذُكر غير ذلك.
          </div>
        )}
        {menu.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            لا يوجد أصناف حالياً
          </div>
        ) : (
          menu.map((section, i) => (
            <CategorySection
              key={i}
              category={section.category}
              items={section.items}
              cart={cart}
              onAdd={handleAdd}
              onRemove={handleRemove}
            />
          ))
        )}
      </main>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="cart-bar">
          <button
            id="open-cart-btn"
            className="cart-btn"
            onClick={() => setDrawerOpen(true)}
          >
            <span className="cart-count">{totalItems}</span>
            <span>عرض الطلب</span>
            <span className="cart-total">{totalPrice} جنيه</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {drawerOpen && (
        <CartDrawer
          cartItems={cartItems}
          total={totalPrice}
          onClose={() => setDrawerOpen(false)}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      )}
    </>
  );
}
