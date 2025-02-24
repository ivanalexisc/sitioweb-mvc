async function addToCart(productId) {
    const res = await fetch(`/cart/add/${productId}`, { method: 'POST' });
    const data = await res.json();
    alert(data.message);
    location.reload();
  }
  
  async function removeFromCart(productId) {
    const res = await fetch(`/cart/remove/${productId}`, { method: 'POST' });
    const data = await res.json();
    alert(data.message);
    location.reload();
  }
  
  async function clearCart() {
    const res = await fetch(`/cart/clear`, { method: 'POST' });
    const data = await res.json();
    alert(data.message);
    location.reload();
  }
  