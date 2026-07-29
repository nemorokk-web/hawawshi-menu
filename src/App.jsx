import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';
import { hawawshiMenu, butcheryMenu } from './data.js';
const WHATSAPP_NUMBER = '201007273768'; // Live number
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
  const isOutOfStock = item.inStock === false || item.inStock === "false" || item.inStock === "FALSE";

  return (
    <div className={`item-card${qty > 0 ? ' in-cart' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`} onClick={(qty === 0 && !isOutOfStock) ? onAdd : undefined}>
      <div className="item-info">
        <div className="item-name">{item.name}</div>
        {item.desc && <div className="item-desc">{item.desc}</div>}
      </div>
      <div className="item-right">
        <div className="item-price">{item.price} جنيه</div>
        {isOutOfStock ? (
           <div style={{ color: 'var(--red)', fontSize: '11px', fontWeight: '700', padding: '4px 8px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px' }}>غير متوفر</div>
        ) : qty === 0 ? (
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
function CartDrawer({ cartItems, total, activeTab, onClose, onAdd, onRemove }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' or 'pickup'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phone2, setPhone2] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [registeredPhone, setRegisteredPhone] = useState('');
  const [sent, setSent] = useState(false);

  function handleOrder() {
    const outOfStockItems = cartItems.filter(({ item }) => item.inStock === false || item.inStock === "false" || item.inStock === "FALSE");
    if (outOfStockItems.length > 0) {
      alert("عذراً، بعض الأصناف في طلبك غير متوفرة حالياً. يرجى إزالتها والمحاولة مرة أخرى.");
      return;
    }

    if (orderType === 'delivery') {
      if (isRegistered) {
        if (!registeredPhone.trim()) return;
      } else {
        if (!name.trim() || !phone.trim() || !region.trim() || !address.trim() || !floor.trim() || !apartment.trim() || !landmark.trim()) return;
      }
    } else {
      if (!name.trim() || !phone.trim()) return;
    }

    const lines = cartItems.map(
      ({ item, qty }) => `• ${item.name} × ${qty} = ${item.price * qty} جنيه`
    );

    let customerInfo = [];
    if (orderType === 'pickup') {
      customerInfo = [
        `📦 *نوع الطلب:* استلام من الفرع (تيك أواي)`,
        `👤 *الاسم:* ${name.trim()}`,
        `📞 *رقم الهاتف:* ${phone.trim()}`,
        notes.trim() ? `📝 *ملاحظات:* ${notes.trim()}` : null
      ].filter(Boolean);
    } else {
      if (isRegistered) {
        customerInfo = [
          `🛵 *نوع الطلب:* دليفري (مسجل مسبقاً)`,
          `👤 *الهاتف المسجل:* ${registeredPhone.trim()}`,
          notes.trim() ? `📝 *ملاحظات:* ${notes.trim()}` : null
        ].filter(Boolean);
      } else {
        customerInfo = [
          `🛵 *نوع الطلب:* دليفري`,
          `👤 *الاسم:* ${name.trim()}`,
          `📞 *رقم الهاتف:* ${phone.trim()}`,
          phone2.trim() ? `📞 *رقم هاتف اخر:* ${phone2.trim()}` : null,
          `🏘️ *المنطقة:* ${region.trim()}`,
          `📍 *العنوان:* ${address.trim()}`,
          `🏢 *الدور:* ${floor.trim()} | 🚪 *شقة:* ${apartment.trim()}`,
          `🔖 *علامة مميزة:* ${landmark.trim()}`,
          notes.trim() ? `📝 *ملاحظات:* ${notes.trim()}` : null
        ].filter(Boolean);
      }
    }

    const branchName = activeTab === 'hawawshi' ? 'فرع إمبابة' : 'فرع زايد';

    const msg = [
      `🛒 *طلب جديد*`,
      `🏢 *الفرع:* ${branchName}`,
      ``,
      ...customerInfo,
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
          <div className="drawer-total" style={{ marginBottom: '4px' }}>
            <span>الإجمالي</span>
            <span>{total} جنيه</span>
          </div>
          {orderType === 'delivery' && (
            <div style={{ textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              * المجموع لا يشمل خدمة التوصيل
            </div>
          )}

          {!sent ? (
            <div className="checkout-form">
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                  className={`toggle-address-btn ${orderType === 'delivery' ? 'active' : ''}`}
                  onClick={() => setOrderType('delivery')}
                  style={{ flex: 1, margin: 0, padding: '10px 0' }}
                >
                  🛵 توصيل
                </button>
                <button
                  className={`toggle-address-btn ${orderType === 'pickup' ? 'active' : ''}`}
                  onClick={() => setOrderType('pickup')}
                  style={{ flex: 1, margin: 0, padding: '10px 0' }}
                >
                  🚶 استلام من الفرع
                </button>
              </div>

              {orderType === 'delivery' && (
                <button
                  className={`toggle-address-btn ${isRegistered ? 'active' : ''}`}
                  onClick={() => setIsRegistered(!isRegistered)}
                >
                  {isRegistered ? 'العودة للعنوان الجديد' : 'عنواني مسجل لدي حواوشي الربيع بالفعل'}
                </button>
              )}

              {orderType === 'pickup' ? (
                <>
                  <input
                    type="text"
                    placeholder="اسمك"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={60}
                  />
                  <input
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                  <textarea
                    placeholder="ملاحظات (اختياري)"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    maxLength={200}
                  />
                </>
              ) : isRegistered ? (
                <input
                  type="tel"
                  placeholder="رقم الهاتف المسجل لدي حواوشي الربيع"
                  value={registeredPhone}
                  onChange={e => setRegisteredPhone(e.target.value)}
                />
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="اسمك"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={60}
                  />
                  <input
                    type="text"
                    placeholder="المنطقه"
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    maxLength={100}
                  />
                  <div className="form-row">
                    <input
                      type="tel"
                      placeholder="رقم الهاتف"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                    <input
                      type="tel"
                      placeholder="رقم هاتف اخر (اختياري)"
                      value={phone2}
                      onChange={e => setPhone2(e.target.value)}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="العنوان"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    maxLength={200}
                  />
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="الدور"
                      value={floor}
                      onChange={e => setFloor(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="شقه"
                      value={apartment}
                      onChange={e => setApartment(e.target.value)}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="علامه مميزه"
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                  />
                  <textarea
                    placeholder="ملاحظات (اختياري)"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    maxLength={200}
                  />
                </>
              )}

              <button
                className="whatsapp-btn"
                onClick={handleOrder}
                disabled={orderType === 'delivery' ? (isRegistered ? !registeredPhone.trim() : (!name.trim() || !phone.trim() || !region.trim() || !address.trim() || !floor.trim() || !apartment.trim() || !landmark.trim())) : (!name.trim() || !phone.trim())}
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
  const [activeTab, setActiveTab] = useState(null);
  const [cart, setCart] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Start with cached data for instant loading
  const [menuData, setMenuData] = useState({ hawawshiMenu, butcheryMenu });

  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbxS1_Vp3Xs33FBXxWFaOXNCsOBNrrOU21OtyF44POb8ILMujJ4_04XB-zGxA0rsb7Fv/exec?action=get_menu')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const groupItems = (items) => {
            const groups = {};
            (items || []).forEach(item => {
              if (!groups[item.category]) groups[item.category] = [];
              groups[item.category].push(item);
            });
            return Object.keys(groups).map(cat => ({ category: cat, items: groups[cat] }));
          };
          
          setMenuData({ 
            hawawshiMenu: groupItems(data.menuImbaba), 
            butcheryMenu: groupItems(data.menuZayed) 
          });
        }
      })
      .catch(e => {
        console.error("Background fetch failed:", e);
      });
  }, []);

  // Lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  let menuToRender = [];
  if (searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    const allMenus = [
      { id: 'hawawshi', data: menuData.hawawshiMenu },
      { id: 'butchery', data: menuData.butcheryMenu }
    ];
    
    allMenus.forEach(menuSrc => {
      menuSrc.data.forEach(section => {
        const filteredItems = section.items.filter(item => 
          item.name.toLowerCase().includes(query) || 
          (item.desc && item.desc.toLowerCase().includes(query))
        );
        
        if (filteredItems.length > 0) {
          menuToRender.push({
            category: section.category + (menuSrc.id === 'butchery' ? ' (فرع زايد)' : ' (فرع إمبابة)'),
            items: filteredItems
          });
        }
      });
    });
  } else {
    menuToRender = activeTab === 'hawawshi' ? menuData.hawawshiMenu : menuData.butcheryMenu;
  }

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

  return (
    <>
      {/* SEO */}
      <title>منيو حواوشي الربيع | اطلب اونلاين</title>

      {/* Hero Carousel - Only on Splash Screen */}
      {activeTab === null && <Carousel />}

      {/* Entry View / Splash Screen */}
      {activeTab === null ? (
        <div className="splash-container">
          <div className="splash-title">اختر الفرع للطلب</div>
          <button 
            className="branch-btn imbaba-btn"
            onClick={() => { setActiveTab('hawawshi'); setCart({}); }}
          >
            <span className="branch-btn-icon">🔥🥩</span>
            <span className="branch-btn-text">منيو فرع إمبابة</span>
          </button>
          <button 
            className="branch-btn zayed-btn"
            onClick={() => { setActiveTab('butchery'); setCart({}); }}
          >
            <span className="branch-btn-icon">🔥🥩</span>
            <span className="branch-btn-text">منيو فرع زايد</span>
          </button>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="search-container">
            <input 
              type="text"
              className="search-input"
              placeholder="ابحث عن صنف..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Menu Header (Replaces Tabs) */}
          {!searchQuery.trim() && (
            <div className="menu-header-top">
              <button 
                className="change-branch-btn"
                onClick={() => { setActiveTab(null); setCart({}); }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                تغيير الفرع
              </button>
              <div className="current-branch-title">
                {activeTab === 'hawawshi' ? 'منيو فرع إمبابة' : 'منيو فرع زايد'}
              </div>
            </div>
          )}
        </>
      )}

      {/* Menu Items */}
      {activeTab !== null && (
        <main className="menu-content">
          {!searchQuery.trim() && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(212,160,23,0.15), rgba(212,160,23,0.05))',
              border: '1px solid rgba(212,160,23,0.3)',
              borderRadius: 'var(--radius)',
              padding: '16px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              color: 'var(--text)',
              lineHeight: 1.8
            }}>
              {activeTab === 'hawawshi' ? (
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: 'var(--gold-light)' }}>🔥🥩 <strong>فرع إمبابة:</strong></span> يعمل من 1 ظهراً إلى 2 ليلاً (إجازة يوم الإثنين).
                </div>
              ) : (
                <div>
                  <span style={{ color: 'var(--gold-light)' }}>🔥🥩 <strong>فرع زايد (أكتوبر الشيخ زايد - مدخل زايد 5):</strong></span> يعمل من 1 ظهراً إلى 2 ليلاً طوال أيام الأسبوع.
                </div>
              )}
            </div>
          )}
          {menuToRender.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              لا يوجد أصناف مطابقة للبحث
            </div>
          ) : (
            menuToRender.map((section, i) => (
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
      )}

      {/* Floating Cart Bar */}
      {activeTab !== null && totalItems > 0 && (
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
      {activeTab !== null && drawerOpen && (
        <CartDrawer
          cartItems={cartItems}
          total={totalPrice}
          activeTab={activeTab}
          onClose={() => setDrawerOpen(false)}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      )}
    </>
  );
}
