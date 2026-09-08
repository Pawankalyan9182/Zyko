import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';

const CATEGORIES = [
  'All', 'Fruits & Vegetables', 'Grocery & Kitchen', 'Dairy & Bread',
  'Snacks & Drinks', 'Beauty & Personal Care', 'Household Essentials'
];

const PRODUCTS = [
  { id:'1', name:'Bananas', category:'Fruits & Vegetables', price:40, unit:'1 kg', image:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500' },
  { id:'2', name:'Fresh Apples', category:'Fruits & Vegetables', price:120, unit:'1 kg', image:'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500' },
  { id:'3', name:'Tomatoes', category:'Fruits & Vegetables', price:35, unit:'1 kg', image:'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500' },
  { id:'4', name:'Potatoes', category:'Fruits & Vegetables', price:30, unit:'1 kg', image:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500' },
  { id:'5', name:'Basmati Rice', category:'Grocery & Kitchen', price:180, unit:'5 kg', image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' },
  { id:'6', name:'Toor Dal', category:'Grocery & Kitchen', price:140, unit:'1 kg', image:'https://images.unsplash.com/photo-1585996741664-2f1f6f1a1c3b?w=500' },
  { id:'7', name:'Cooking Oil', category:'Grocery & Kitchen', price:145, unit:'1 L', image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500' },
  { id:'8', name:'Fresh Milk', category:'Dairy & Bread', price:32, unit:'500 ml', image:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500' },
  { id:'9', name:'Brown Bread', category:'Dairy & Bread', price:45, unit:'400 g', image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500' },
  { id:'10', name:'Eggs', category:'Dairy & Bread', price:72, unit:'12 pcs', image:'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500' },
  { id:'11', name:'Potato Chips', category:'Snacks & Drinks', price:30, unit:'120 g', image:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500' },
  { id:'12', name:'Orange Juice', category:'Snacks & Drinks', price:90, unit:'1 L', image:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500' },
  { id:'13', name:'Shampoo', category:'Beauty & Personal Care', price:160, unit:'340 ml', image:'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500' },
  { id:'14', name:'Bath Soap', category:'Beauty & Personal Care', price:55, unit:'4 pcs', image:'https://images.unsplash.com/photo-1607006344380-b6775a0824c7?w=500' },
  { id:'15', name:'Dish Wash', category:'Household Essentials', price:85, unit:'500 ml', image:'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500' },
  { id:'16', name:'Floor Cleaner', category:'Household Essentials', price:110, unit:'1 L', image:'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500' },
];

function ProductCard({ product, quantity, onAdd, onIncrease, onDecrease }) {
  return (
    <View style={styles.productCard}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.unit}>{product.unit}</Text>
      <View style={styles.productBottom}>
        <Text style={styles.price}>₹{product.price}</Text>
        {quantity === 0 ? (
          <TouchableOpacity style={styles.addBtn} onPress={onAdd}><Text style={styles.addText}>ADD</Text></TouchableOpacity>
        ) : (
          <View style={styles.qtyBox}>
            <TouchableOpacity onPress={onDecrease}><Text style={styles.qtyBtn}>−</Text></TouchableOpacity>
            <Text style={styles.qty}>{quantity}</Text>
            <TouchableOpacity onPress={onIncrease}><Text style={styles.qtyBtn}>+</Text></TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState('login');
  const [loginStep, setLoginStep] = useState('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({});
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [orderStatus, setOrderStatus] = useState('confirmed');
  const [orderNumber, setOrderNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');

  useEffect(() => {
    if (screen !== 'tracking' || !orderNumber) return;
    setOrderStatus('confirmed');
    const a = setTimeout(() => setOrderStatus('packing'), 3000);
    const b = setTimeout(() => setOrderStatus('out_for_delivery'), 8000);
    const c = setTimeout(() => setOrderStatus('delivered'), 13000);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, [screen, orderNumber]);

  const cartItems = useMemo(() => PRODUCTS.filter(p => cart[p.id] > 0), [cart]);
  const itemCount = cartItems.reduce((s, p) => s + (cart[p.id] || 0), 0);
  const subtotal = cartItems.reduce((s, p) => s + p.price * (cart[p.id] || 0), 0);
  const deliveryFee = subtotal > 199 || subtotal === 0 ? 0 : 20;
  const total = subtotal + deliveryFee;

  const filteredProducts = useMemo(() => PRODUCTS.filter(p => {
    const categoryOK = selectedCategory === 'All' || p.category === selectedCategory;
    const searchOK = !searchText || p.name.toLowerCase().includes(searchText.toLowerCase()) || p.category.toLowerCase().includes(searchText.toLowerCase());
    return categoryOK && searchOK;
  }), [selectedCategory, searchText]);

  const addToCart = id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const increase = id => addToCart(id);
  const decrease = id => setCart(c => { const n = (c[id] || 0) - 1; const next = { ...c }; if (n <= 0) delete next[id]; else next[id] = n; return next; });

  const goProducts = (category='All') => { setSelectedCategory(category); setSearchText(''); setScreen('products'); };

  const placeOrder = () => {
    if (!cartItems.length) return Alert.alert('Cart empty', 'Please add products first.');
    const num = 'TJ' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = { id:num, date:new Date().toLocaleString(), items:cartItems.map(p => ({...p, quantity:cart[p.id]})), total, paymentMethod, address:user?.address || profileAddress, status:'confirmed' };
    setOrders(o => [newOrder, ...o]);
    setOrderNumber(num);
    setOrderStatus('confirmed');
    setScreen('tracking');
  };

  const saveProfile = () => {
    const name = editName.trim() || user?.name || 'Tejovanam User';
    const address = editAddress.trim() || user?.address || 'Address not added';
    setUser({ ...user, name, address });
    setProfileName(name); setProfileAddress(address);
    Alert.alert('Saved', 'Profile updated successfully.');
    setScreen('profile');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.authWrap}>
            <Text style={styles.logo}>T</Text>
            <Text style={styles.brand}>Tejovanam</Text>
            <Text style={styles.tagline}>Groceries delivered in 10 minutes</Text>
            {loginStep === 'mobile' && <>
              <Text style={styles.authTitle}>Login with mobile number</Text>
              <TextInput style={styles.input} placeholder="10-digit mobile number" keyboardType="phone-pad" maxLength={10} value={mobile} onChangeText={setMobile} />
              <TouchableOpacity style={styles.primaryBtn} onPress={() => mobile.length === 10 ? setLoginStep('otp') : Alert.alert('Enter mobile number', 'Please enter a valid 10-digit number.') }><Text style={styles.primaryText}>Continue</Text></TouchableOpacity>
              <Text style={styles.demoNote}>Demo OTP: 1234</Text>
            </>}
            {loginStep === 'otp' && <>
              <Text style={styles.authTitle}>Enter OTP</Text>
              <Text style={styles.muted}>OTP sent to +91 {mobile}</Text>
              <TextInput style={styles.input} placeholder="4-digit OTP" keyboardType="number-pad" maxLength={4} value={otp} onChangeText={setOtp} />
              <TouchableOpacity style={styles.primaryBtn} onPress={() => otp === '1234' ? setLoginStep('profile') : Alert.alert('Invalid OTP', 'Use 1234 for this demo.') }><Text style={styles.primaryText}>Verify OTP</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setLoginStep('mobile')}><Text style={styles.link}>Change mobile number</Text></TouchableOpacity>
            </>}
            {loginStep === 'profile' && <>
              <Text style={styles.authTitle}>Your details</Text>
              <TextInput style={styles.input} placeholder="Your name" value={profileName} onChangeText={setProfileName} />
              <TextInput style={[styles.input,{height:90}]} placeholder="Delivery address" multiline value={profileAddress} onChangeText={setProfileAddress} />
              <TouchableOpacity style={styles.primaryBtn} onPress={() => { setUser({mobile,name:profileName || 'Tejovanam User',address:profileAddress || 'Address not added'}); setScreen('home'); }}><Text style={styles.primaryText}>Start Shopping</Text></TouchableOpacity>
            </>}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  const Header = () => (
    <View style={styles.header}>
      <View style={{flex:1}}><Text style={styles.small}>Tejovanam in</Text><Text style={styles.headerTitle}>10 minutes ⚡</Text><Text style={styles.address} numberOfLines={1}>📍 {user.address || 'Add delivery address'}</Text></View>
      <TouchableOpacity style={styles.avatar} onPress={() => setScreen('profile')}><Text style={styles.avatarText}>{(user.name || 'T')[0].toUpperCase()}</Text></TouchableOpacity>
    </View>
  );

  const BottomNav = () => (
    <View style={styles.bottomNav}>
      {[['home','⌂','Home'],['categories','▦','Categories'],['orders','▤','Orders'],['profile','◉','Profile']].map(([s,icon,label]) => (
        <TouchableOpacity key={s} style={styles.navItem} onPress={() => setScreen(s)}><Text style={[styles.navIcon, screen===s && styles.active]}>{icon}</Text><Text style={[styles.navLabel, screen===s && styles.active]}>{label}</Text></TouchableOpacity>
      ))}
    </View>
  );

  if (screen === 'home') return <SafeAreaView style={styles.safe}><Header/><ScrollView contentContainerStyle={styles.content}>
    <TouchableOpacity style={styles.search} onPress={() => setScreen('search')}><Text style={styles.searchText}>🔍 Search for groceries & more</Text></TouchableOpacity>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical:12}}>{CATEGORIES.slice(1).map(c => <TouchableOpacity key={c} style={styles.catChip} onPress={() => goProducts(c)}><Text style={styles.catText}>{c}</Text></TouchableOpacity>)}</ScrollView>
    <View style={styles.banner}><Text style={styles.bannerTitle}>Fresh groceries</Text><Text style={styles.bannerSub}>Delivered to your door in 10 minutes</Text><TouchableOpacity style={styles.bannerBtn} onPress={() => goProducts()}><Text style={styles.bannerBtnText}>Shop now</Text></TouchableOpacity></View>
    <Text style={styles.sectionTitle}>Frequently bought</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>{PRODUCTS.slice(0,6).map(p => <View key={p.id} style={{width:150,marginRight:10}}><ProductCard product={p} quantity={cart[p.id]||0} onAdd={()=>addToCart(p.id)} onIncrease={()=>increase(p.id)} onDecrease={()=>decrease(p.id)}/></View>)}</ScrollView>
    <Text style={styles.sectionTitle}>Shop by category</Text>
    {CATEGORIES.slice(1).map(c => <TouchableOpacity key={c} style={styles.categoryRow} onPress={() => goProducts(c)}><Text style={styles.categoryRowText}>{c}</Text><Text>›</Text></TouchableOpacity>)}
    <View style={{height:100}}/>
  </ScrollView><BottomNav/></SafeAreaView>;

  if (screen === 'categories') return <SafeAreaView style={styles.safe}><Header/><ScrollView contentContainerStyle={styles.content}><Text style={styles.pageTitle}>Categories</Text>{CATEGORIES.slice(1).map(c => <TouchableOpacity key={c} style={styles.bigCategory} onPress={() => goProducts(c)}><Text style={styles.bigCategoryIcon}>🛒</Text><View style={{flex:1}}><Text style={styles.bigCategoryTitle}>{c}</Text><Text style={styles.muted}>Explore products</Text></View><Text style={styles.chevron}>›</Text></TouchableOpacity>)}<View style={{height:100}}/></ScrollView><BottomNav/></SafeAreaView>;

  if (screen === 'search') return <SafeAreaView style={styles.safe}><View style={styles.topRow}><TouchableOpacity onPress={()=>setScreen('home')}><Text style={styles.back}>‹</Text></TouchableOpacity><TextInput autoFocus style={[styles.search,{flex:1,margin:0}]} placeholder="Search products" value={searchText} onChangeText={setSearchText}/></View><ScrollView contentContainerStyle={styles.grid}>{filteredProducts.map(p=><ProductCard key={p.id} product={p} quantity={cart[p.id]||0} onAdd={()=>addToCart(p.id)} onIncrease={()=>increase(p.id)} onDecrease={()=>decrease(p.id)}/>)}</ScrollView>{itemCount>0&&<TouchableOpacity style={styles.cartBar} onPress={()=>setScreen('cart')}><Text style={styles.cartBarText}>View cart • {itemCount} items • ₹{total}</Text></TouchableOpacity>}</SafeAreaView>;

  if (screen === 'products') return <SafeAreaView style={styles.safe}><View style={styles.topRow}><TouchableOpacity onPress={()=>setScreen('home')}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.pageTitleSmall}>{selectedCategory}</Text><TouchableOpacity onPress={()=>setScreen('search')}><Text style={styles.searchIcon}>⌕</Text></TouchableOpacity></View><ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>{CATEGORIES.map(c=><TouchableOpacity key={c} style={[styles.filterChip,selectedCategory===c&&styles.filterActive]} onPress={()=>setSelectedCategory(c)}><Text style={selectedCategory===c?styles.filterActiveText:styles.filterText}>{c}</Text></TouchableOpacity>)}</ScrollView><ScrollView contentContainerStyle={styles.grid}>{filteredProducts.map(p=><ProductCard key={p.id} product={p} quantity={cart[p.id]||0} onAdd={()=>addToCart(p.id)} onIncrease={()=>increase(p.id)} onDecrease={()=>decrease(p.id)}/>)}</ScrollView>{itemCount>0&&<TouchableOpacity style={styles.cartBar} onPress={()=>setScreen('cart')}><Text style={styles.cartBarText}>View cart • {itemCount} items • ₹{total}</Text></TouchableOpacity>}</SafeAreaView>;

  if (screen === 'cart') return <SafeAreaView style={styles.safe}><View style={styles.topRow}><TouchableOpacity onPress={()=>setScreen('products')}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.pageTitleSmall}>Your Cart</Text></View><ScrollView contentContainerStyle={styles.content}>{cartItems.map(p=><View key={p.id} style={styles.cartItem}><Image source={{uri:p.image}} style={styles.cartImage}/><View style={{flex:1}}><Text style={styles.productName}>{p.name}</Text><Text style={styles.unit}>{p.unit}</Text><Text style={styles.price}>₹{p.price*(cart[p.id]||0)}</Text></View><View style={styles.qtyBox}><TouchableOpacity onPress={()=>decrease(p.id)}><Text style={styles.qtyBtn}>−</Text></TouchableOpacity><Text style={styles.qty}>{cart[p.id]}</Text><TouchableOpacity onPress={()=>increase(p.id)}><Text style={styles.qtyBtn}>+</Text></TouchableOpacity></View></View>)}<View style={styles.summary}><Text style={styles.sectionTitle}>Bill details</Text><View style={styles.billRow}><Text>Subtotal</Text><Text>₹{subtotal}</Text></View><View style={styles.billRow}><Text>Delivery fee</Text><Text>{deliveryFee===0?'FREE':'₹'+deliveryFee}</Text></View><View style={styles.billRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalLabel}>₹{total}</Text></View></View>{itemCount>0&&<TouchableOpacity style={styles.primaryBtn} onPress={()=>setScreen('checkout')}><Text style={styles.primaryText}>Proceed to checkout</Text></TouchableOpacity>}<View style={{height:100}}/></ScrollView></SafeAreaView>;

  if (screen === 'checkout') return <SafeAreaView style={styles.safe}><View style={styles.topRow}><TouchableOpacity onPress={()=>setScreen('cart')}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.pageTitleSmall}>Checkout</Text></View><ScrollView contentContainerStyle={styles.content}><View style={styles.infoCard}><Text style={styles.sectionTitle}>⚡ Delivery in 10 minutes</Text><Text style={styles.muted}>Fast delivery to your saved address</Text></View><Text style={styles.sectionTitle}>Delivery address</Text><View style={styles.addressCard}><Text style={styles.productName}>{user.name}</Text><Text style={styles.muted}>{user.address}</Text></View><Text style={styles.sectionTitle}>Payment method</Text>{['UPI','Card','COD'].map(m=><TouchableOpacity key={m} style={[styles.paymentRow,paymentMethod===m&&styles.paymentSelected]} onPress={()=>setPaymentMethod(m)}><Text style={styles.productName}>{m==='UPI'?'UPI / Google Pay':m==='Card'?'Credit / Debit Card':'Cash on Delivery'}</Text><Text>{paymentMethod===m?'✓':'○'}</Text></TouchableOpacity>)}<View style={styles.summary}><View style={styles.billRow}><Text>Items</Text><Text>{itemCount}</Text></View><View style={styles.billRow}><Text>Subtotal</Text><Text>₹{subtotal}</Text></View><View style={styles.billRow}><Text>Delivery</Text><Text>{deliveryFee===0?'FREE':'₹'+deliveryFee}</Text></View><View style={styles.billRow}><Text style={styles.totalLabel}>To Pay</Text><Text style={styles.totalLabel}>₹{total}</Text></View></View><TouchableOpacity style={styles.primaryBtn} onPress={placeOrder}><Text style={styles.primaryText}>Place Order • ₹{total}</Text></TouchableOpacity><View style={{height:100}}/></ScrollView></SafeAreaView>;

  if (screen === 'tracking') return <SafeAreaView style={styles.safe}><View style={styles.topRow}><Text style={styles.pageTitleSmall}>Track Order</Text></View><ScrollView contentContainerStyle={styles.content}><View style={styles.success}><Text style={styles.successIcon}>✓</Text><Text style={styles.successTitle}>{orderStatus==='delivered'?'Delivered!':'Order Confirmed!'}</Text><Text style={styles.muted}>Order #{orderNumber}</Text></View><View style={styles.timeline}>{[['confirmed','Order Confirmed','Your order has been placed'],['packing','Packing','Store is preparing your items'],['out_for_delivery','Out for Delivery','Delivery partner is on the way'],['delivered','Delivered','Enjoy your groceries!']].map(([key,title,sub],i)=>{const order=['confirmed','packing','out_for_delivery','delivered']; const active=order.indexOf(orderStatus)>=i; return <View key={key} style={styles.timelineRow}><View style={[styles.dot,active&&styles.dotActive]}><Text style={styles.dotText}>{active?'✓':''}</Text></View><View><Text style={[styles.timelineTitle,active&&styles.activeTitle]}>{title}</Text><Text style={styles.muted}>{sub}</Text></View></View>})}</View><View style={styles.infoCard}><Text style={styles.sectionTitle}>Estimated delivery</Text><Text style={styles.eta}>{orderStatus==='delivered'?'Delivered':'Within 10 minutes'}</Text></View><Text style={styles.sectionTitle}>Order details</Text>{cartItems.map(p=><View key={p.id} style={styles.billRow}><Text>{p.name} × {cart[p.id]}</Text><Text>₹{p.price*cart[p.id]}</Text></View>)}<TouchableOpacity style={styles.primaryBtn} onPress={()=>{setCart({});setScreen('home')}}><Text style={styles.primaryText}>Continue Shopping</Text></TouchableOpacity><View style={{height:100}}/></ScrollView></SafeAreaView>;

  if (screen === 'orders') return <SafeAreaView style={styles.safe}><Header/><ScrollView contentContainerStyle={styles.content}><Text style={styles.pageTitle}>My Orders</Text>{orders.length===0?<View style={styles.empty}><Text style={styles.emptyIcon}>🧺</Text><Text style={styles.sectionTitle}>No orders yet</Text><Text style={styles.muted}>Your completed orders will appear here.</Text><TouchableOpacity style={styles.primaryBtn} onPress={()=>setScreen('home')}><Text style={styles.primaryText}>Start Shopping</Text></TouchableOpacity></View>:orders.map(o=><TouchableOpacity key={o.id} style={styles.orderCard} onPress={()=>{setOrderNumber(o.id);setScreen('tracking')}}><View><Text style={styles.productName}>Order #{o.id}</Text><Text style={styles.muted}>{o.date}</Text><Text style={styles.muted}>{o.items.length} product(s) • {o.paymentMethod}</Text></View><Text style={styles.price}>₹{o.total}</Text></TouchableOpacity>)}<View style={{height:100}}/></ScrollView><BottomNav/></SafeAreaView>;

  if (screen === 'profile') return <SafeAreaView style={styles.safe}><Header/><ScrollView contentContainerStyle={styles.content}><View style={styles.profileHero}><View style={styles.bigAvatar}><Text style={styles.bigAvatarText}>{(user.name||'T')[0].toUpperCase()}</Text></View><Text style={styles.pageTitle}>{user.name}</Text><Text style={styles.muted}>+91 {user.mobile}</Text></View>{[['orders','📦','My Orders'],['address','📍','Delivery Address'],['editProfile','✏️','Edit Profile'],['payment','💳','Payment Settings'],['help','❓','Help & Support']].map(([s,icon,label])=><TouchableOpacity key={s} style={styles.profileRow} onPress={()=>{if(s==='editProfile'){setEditName(user.name);setEditAddress(user.address);setScreen(s)}else if(s==='address'){Alert.alert('Delivery Address',user.address)}else if(s==='payment'){Alert.alert('Payment Settings','UPI, Card and Cash on Delivery are available at checkout.')}else if(s==='help'){Alert.alert('Help & Support','Tejovanam support: 10 AM – 8 PM')}else setScreen(s)}}><Text style={styles.rowIcon}>{icon}</Text><Text style={styles.productName}>{label}</Text><Text style={styles.chevron}>›</Text></TouchableOpacity>)}<TouchableOpacity style={styles.logout} onPress={()=>{setUser(null);setLoginStep('mobile');setOtp('');setScreen('login')}}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity><View style={{height:100}}/></ScrollView><BottomNav/></SafeAreaView>;

  if (screen === 'editProfile') return <SafeAreaView style={styles.safe}><View style={styles.topRow}><TouchableOpacity onPress={()=>setScreen('profile')}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.pageTitleSmall}>Edit Profile</Text></View><ScrollView contentContainerStyle={styles.content}><Text style={styles.label}>Name</Text><TextInput style={styles.input} value={editName} onChangeText={setEditName}/><Text style={styles.label}>Delivery address</Text><TextInput style={[styles.input,{height:110}]} multiline value={editAddress} onChangeText={setEditAddress}/><TouchableOpacity style={styles.primaryBtn} onPress={saveProfile}><Text style={styles.primaryText}>Save Changes</Text></TouchableOpacity></ScrollView></SafeAreaView>;

  return null;
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#fff'}, content:{padding:16}, header:{padding:16,flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderColor:'#eee'},small:{fontSize:12,color:'#666'},headerTitle:{fontSize:20,fontWeight:'800'},address:{marginTop:3,color:'#555'},avatar:{width:42,height:42,borderRadius:21,backgroundColor:'#111',alignItems:'center',justifyContent:'center'},avatarText:{color:'#fff',fontWeight:'800'},logo:{width:72,height:72,borderRadius:20,backgroundColor:'#111',color:'#fff',fontSize:44,textAlign:'center',lineHeight:72,fontWeight:'900',alignSelf:'center'},brand:{fontSize:32,fontWeight:'900',textAlign:'center',marginTop:12},tagline:{textAlign:'center',color:'#666',marginBottom:35},authWrap:{flex:1,justifyContent:'center',padding:24},authTitle:{fontSize:20,fontWeight:'800',marginBottom:14},input:{borderWidth:1,borderColor:'#ddd',borderRadius:12,padding:14,fontSize:16,marginBottom:12,backgroundColor:'#fafafa'},primaryBtn:{backgroundColor:'#111',padding:16,borderRadius:12,alignItems:'center',marginTop:10},primaryText:{color:'#fff',fontWeight:'800',fontSize:16},demoNote:{textAlign:'center',color:'#888',marginTop:12},link:{textAlign:'center',marginTop:18,fontWeight:'700'},muted:{color:'#666',marginTop:3},search:{backgroundColor:'#f2f2f2',borderRadius:12,padding:15,marginTop:4'},searchText:{color:'#777',fontSize:15},catChip:{backgroundColor:'#f4f4f4',paddingHorizontal:14,paddingVertical:10,borderRadius:20,marginRight:8},catText:{fontSize:12,fontWeight:'700'},banner:{backgroundColor:'#e9e9e9',borderRadius:18,padding:22,marginBottom:22},bannerTitle:{fontSize:26,fontWeight:'900'},bannerSub:{fontSize:14,color:'#555',marginTop:6},bannerBtn:{backgroundColor:'#111',alignSelf:'flex-start',paddingHorizontal:18,paddingVertical:10,borderRadius:10,marginTop:15},bannerBtnText:{color:'#fff',fontWeight:'800'},sectionTitle:{fontSize:18,fontWeight:'800',marginTop:18,marginBottom:12},productCard:{backgroundColor:'#fff',borderWidth:1,borderColor:'#eee',borderRadius:14,padding:10,marginBottom:12},productImage:{width:'100%',height:125,borderRadius:10,backgroundColor:'#f3f3f3'},productName:{fontWeight:'700',fontSize:14,marginTop:8},unit:{fontSize:12,color:'#777',marginTop:3},productBottom:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10},price:{fontSize:16,fontWeight:'900'},addBtn:{borderWidth:1,borderColor:'#111',borderRadius:8,paddingHorizontal:14,paddingVertical:7},addText:{fontWeight:'900'},qtyBox:{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#ddd',borderRadius:8},qtyBtn:{fontSize:22,fontWeight:'800',paddingHorizontal:8},qty:{fontWeight:'800',paddingHorizontal:5},categoryRow:{flexDirection:'row',alignItems:'center',padding:16,borderWidth:1,borderColor:'#eee',borderRadius:12,marginBottom:10},categoryRowText:{flex:1,fontWeight:'700'},bottomNav:{position:'absolute',bottom:0,left:0,right:0,height:72,backgroundColor:'#fff',borderTopWidth:1,borderColor:'#eee',flexDirection:'row'},navItem:{flex:1,alignItems:'center',justifyContent:'center'},navIcon:{fontSize:24,color:'#777'},navLabel:{fontSize:11,color:'#777',marginTop:2},active:{color:'#111',fontWeight:'900'},pageTitle:{fontSize:26,fontWeight:'900',marginBottom:16},pageTitleSmall:{fontSize:20,fontWeight:'900',flex:1},topRow:{flexDirection:'row',alignItems:'center',padding:14,borderBottomWidth:1,borderColor:'#eee'},back:{fontSize:38,lineHeight:38,width:45},searchIcon:{fontSize:30},grid:{padding:12,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',paddingBottom:100},gridCard:{width:'48%'},filterRow:{paddingHorizontal:12,maxHeight:54},filterChip:{paddingHorizontal:12,paddingVertical:9,borderWidth:1,borderColor:'#ddd',borderRadius:18,marginRight:8},filterActive:{backgroundColor:'#111',borderColor:'#111'},filterText:{color:'#555'},filterActiveText:{color:'#fff',fontWeight:'700'},cartBar:{position:'absolute',bottom:15,left:16,right:16,backgroundColor:'#111',padding:17,borderRadius:12,alignItems:'center'},cartBarText:{color:'#fff',fontWeight:'900'},cartItem:{flexDirection:'row',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderColor:'#eee'},cartImage:{width:70,height:70,borderRadius:10,marginRight:12},summary:{borderTopWidth:1,borderColor:'#eee',marginTop:18,paddingTop:8},billRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:8},totalLabel:{fontWeight:'900',fontSize:18},infoCard:{backgroundColor:'#f3f3f3',borderRadius:14,padding:16,marginBottom:16},addressCard:{borderWidth:1,borderColor:'#eee',borderRadius:12,padding:16,marginBottom:8},paymentRow:{padding:16,borderWidth:1,borderColor:'#eee',borderRadius:12,marginBottom:10,flexDirection:'row',justifyContent:'space-between'},paymentSelected:{borderColor:'#111',backgroundColor:'#f6f6f6'},success:{alignItems:'center',paddingVertical:25},successIcon:{width:62,height:62,borderRadius:31,backgroundColor:'#111',color:'#fff',fontSize:34,textAlign:'center',lineHeight:62},successTitle:{fontSize:24,fontWeight:'900',marginTop:12},timeline:{paddingVertical:10},timelineRow:{flexDirection:'row',marginBottom:22},dot:{width:30,height:30,borderRadius:15,borderWidth:2,borderColor:'#ccc',alignItems:'center',justifyContent:'center',marginRight:12},dotActive:{backgroundColor:'#111',borderColor:'#111'},dotText:{color:'#fff',fontWeight:'900'},timelineTitle:{fontSize:16,fontWeight:'700'},activeTitle:{fontWeight:'900'},eta:{fontSize:22,fontWeight:'900',marginTop:5},empty:{alignItems:'center',paddingTop:80},emptyIcon:{fontSize:60,marginBottom:10},orderCard:{borderWidth:1,borderColor:'#eee',borderRadius:14,padding:16,marginBottom:10,flexDirection:'row',justifyContent:'space-between'},profileHero:{alignItems:'center',paddingVertical:10,marginBottom:10},bigAvatar:{width:76,height:76,borderRadius:38,backgroundColor:'#111',alignItems:'center',justifyContent:'center'},bigAvatarText:{color:'#fff',fontSize:32,fontWeight:'900'},profileRow:{flexDirection:'row',alignItems:'center',padding:17,borderBottomWidth:1,borderColor:'#eee'},rowIcon:{fontSize:22,width:42},chevron:{fontSize:28,color:'#777'},logout:{padding:16,alignItems:'center',marginTop:15},logoutText:{color:'#c00',fontWeight:'900'},label:{fontWeight:'800',marginBottom:8,marginTop:8}
});
