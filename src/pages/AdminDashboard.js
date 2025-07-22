import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ setAdminToken }) => {
  const [inventory, setInventory] = useState({ base: {}, sauce: {}, cheese: {}, veggies: {}, meat: {} });
  const [pizzas, setPizzas] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({ category: 'base', name: '', quantity: '' });
  const [newPizza, setNewPizza] = useState({
    name: '', price: '', image: '', rating: '', reviews: '', isVeg: true,
  });
  const [editPizza, setEditPizza] = useState(null);
  const [lowStockWarning, setLowStockWarning] = useState(false);

  const navigate = useNavigate();
  const INVENTORY_THRESHOLD = 20; // Example threshold

  // Define checkStockLevels function as it's a dependency for fetchInventory
  const checkStockLevels = useCallback((inventoryData) => {
    const totalBase = Object.values(inventoryData.base).reduce((sum, qty) => sum + qty, 0);
    setLowStockWarning(totalBase < INVENTORY_THRESHOLD);
  }, [INVENTORY_THRESHOLD]); // checkStockLevels depends on INVENTORY_THRESHOLD

  // Wrapped data fetching functions in useCallback
  const fetchInventory = useCallback(async () => {
    try {
      const res = await axios.get('https://pizzamania-0igb.onrender.com/api/inventory');
      setInventory(res.data);
      checkStockLevels(res.data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      alert('Failed to fetch inventory. Please try again.');
    }
  }, [checkStockLevels]); // fetchInventory depends on checkStockLevels

  const fetchPizzas = useCallback(async () => {
    try {
      const res = await axios.get('https://pizzamania-0igb.onrender.com/api/pizzas');
      setPizzas(res.data || []);
    } catch (error) {
      console.error('Failed to fetch pizzas:', error);
      alert('Failed to fetch pizzas. Please try again.');
    }
  }, []); // No external dependencies

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get('https://pizzamania-0igb.onrender.com/api/orders/admin/orders');
      const modifiedOrders = res.data.map(order => ({ ...order, newStatus: order.status }));
      setOrders(modifiedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      alert('Failed to fetch orders. Please try again.');
    }
  }, []); // No external dependencies

  // useEffect hook to fetch data on component mount
  useEffect(() => {
    fetchInventory();
    fetchPizzas();
    fetchOrders();
  }, [fetchInventory, fetchPizzas, fetchOrders]); // Now dependencies are stable due to useCallback


  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    navigate('/login');
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || newItem.quantity === '') {
      return alert('Please enter a valid item name and quantity.');
    }
    try {
      const res = await axios.post('https://pizzamania-0igb.onrender.com/api/inventory/add', {
        category: newItem.category,
        name: newItem.name.trim(),
        quantity: parseInt(newItem.quantity) || 0,
      });
      setNewItem({ category: 'base', name: '', quantity: '' });
      setInventory(res.data);
      alert(`Item "${newItem.name.trim()}" added successfully!`);
      // Re-check stock levels after adding item
      checkStockLevels(res.data);
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item. Please try again.');
    }
  };

  const handleDeleteItem = async (category, itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}" from ${category}?`)) return;
    try {
      const res = await axios.delete('https://pizzamania-0igb.onrender.com/api/inventory/delete', {
        data: { category, name: itemName }
      });
      setInventory(res.data);
      alert(`Item "${itemName}" deleted successfully.`);
      // Re-check stock levels after deleting item
      checkStockLevels(res.data);
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleQuantityChange = async (category, itemName, change) => {
    try {
      const res = await axios.put('https://pizzamania-0igb.onrender.com/api/inventory/update-quantity', {
        category, itemName, change,
      });
      setInventory(res.data);
      checkStockLevels(res.data);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const handleAddPizza = async (e) => {
    e.preventDefault();
    if (!newPizza.name || !newPizza.price || !newPizza.image || newPizza.rating === '' || newPizza.reviews === '') {
      return alert('Please fill all pizza fields.');
    }
    try {
      const res = await axios.post('https://pizzamania-0igb.onrender.com/api/pizzas/add', {
        ...newPizza,
        price: parseFloat(newPizza.price) || 0,
        rating: parseFloat(newPizza.rating) || 0,
        reviews: parseInt(newPizza.reviews) || 0,
      });
      setNewPizza({ name: '', price: '', image: '', rating: '', reviews: '', isVeg: true });
      setPizzas(res.data || []);
      alert(`Pizza "${newPizza.name}" added successfully!`);
    } catch (error) {
      console.error('Error adding pizza:', error);
      alert('Error adding pizza. Please try again.');
    }
  };

  const handleEditPizza = async () => {
    if (!editPizza.name || !editPizza.price || !editPizza.image || editPizza.rating === '' || editPizza.reviews === '') {
      return alert('Please fill all fields for editing pizza.');
    }
    try {
      const res = await axios.put('https://pizzamania-0igb.onrender.com/api/pizzas/edit', {
        originalName: editPizza.originalName,
        updatedPizza: {
          ...editPizza,
          price: parseFloat(editPizza.price) || 0,
          rating: parseFloat(editPizza.rating) || 0,
          reviews: parseInt(editPizza.reviews) || 0,
        },
      });
      setEditPizza(null);
      setPizzas(res.data || []);
      alert(`Pizza "${editPizza.name}" updated successfully!`);
    } catch (error) {
      console.error('Error updating pizza:', error);
      alert('Error updating pizza. Please try again.');
    }
  };

  const handleDeletePizza = async (name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await axios.delete('https://pizzamania-0igb.onrender.com/api/pizzas/delete', {
        data: { name },
      });
      setPizzas(res.data || []);
      alert(`Pizza "${name}" deleted successfully.`);
    } catch (error) {
      console.error('Error deleting pizza:', error);
      alert('Error deleting pizza. Please try again.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`https://pizzamania-0igb.onrender.com/api/orders/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      const updatedOrders = orders.map(order =>
        order.order_id === orderId ? { ...order, status: newStatus, newStatus } : order
      );
      setOrders(updatedOrders);
      alert(`Order ${orderId} status updated to "${newStatus}".`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleManualStockCheck = () => {
    fetchInventory();
    alert('Stock levels checked!');
  };

  const orderStatuses = ["Order Placed", "Preparing", "Out for Delivery", "Delivered"];

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
            🍕 Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
          >
            Logout
          </button>
        </div>

        {/* Inventory Management */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-indigo-500 pb-3">
            Inventory Management
          </h2>
          {lowStockWarning && (
            <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-5 py-4 rounded-lg mb-6 flex items-center space-x-3 shadow-sm">
              <span className="text-2xl">⚠️</span>
              <p className="font-semibold">Warning: Total pizza base stock is below {INVENTORY_THRESHOLD}!</p>
            </div>
          )}
          <button
            onClick={handleManualStockCheck}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg mb-6 shadow-md transition duration-200 ease-in-out"
          >
            Check Stock Levels
          </button>

          {/* Add New Item Form */}
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 items-end">
            <div className="md:col-span-1">
              <label htmlFor="item-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="item-category"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="base">Base</option>
                <option value="sauce">Sauce</option>
                <option value="cheese">Cheese</option>
                <option value="veggies">Veggies</option>
                <option value="meat">Meat</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input
                id="item-name"
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g., Thin Crust"
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="item-quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                id="item-quantity"
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                placeholder="e.g., 100"
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-1">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-lg shadow-md transition duration-200 ease-in-out"
              >
                Add Item
              </button>
            </div>
          </form>

          {/* Inventory List */}
          <div className="space-y-6">
            {['base', 'sauce', 'cheese', 'veggies', 'meat'].map(category => (
              <div key={category} className="bg-gray-50 p-5 rounded-lg shadow-inner border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 capitalize">{category}</h3>
                <ul className="space-y-2">
                  {Object.entries(inventory[category]).length > 0 ? (
                    Object.entries(inventory[category]).map(([name, qty]) => (
                      <li key={name} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm border border-gray-100">
                        <span className="text-gray-700 font-medium">{name}: <span className="text-indigo-600 font-bold">{qty}</span></span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleQuantityChange(category, name, 1)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition duration-200 ease-in-out"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleQuantityChange(category, name, -1)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm transition duration-200 ease-in-out"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleDeleteItem(category, name)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition duration-200 ease-in-out"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No {category} items in stock.</p>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Pizza Management */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-indigo-500 pb-3">
            Pizza Management
          </h2>
          {/* Add New Pizza Form */}
          <form onSubmit={handleAddPizza} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-5 bg-gray-50 rounded-lg shadow-inner">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Add New Pizza</h3>
            </div>
            <div>
              <label htmlFor="pizza-name" className="block text-sm font-medium text-gray-700 mb-1">Pizza Name</label>
              <input
                id="pizza-name"
                type="text"
                value={newPizza.name}
                onChange={(e) => setNewPizza({ ...newPizza, name: e.target.value })}
                placeholder="Margherita Delight"
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="pizza-price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                id="pizza-price"
                type="number"
                value={newPizza.price}
                onChange={(e) => setNewPizza({ ...newPizza, price: e.target.value })}
                placeholder="299.00"
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="pizza-image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                id="pizza-image"
                type="text"
                value={newPizza.image}
                onChange={(e) => setNewPizza({ ...newPizza, image: e.target.value })}
                placeholder="https://example.com/pizza.jpg"
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="pizza-rating" className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
              <input
                id="pizza-rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={newPizza.rating}
                onChange={(e) => setNewPizza({ ...newPizza, rating: e.target.value })}
                placeholder="4.5"
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="pizza-reviews" className="block text-sm font-medium text-gray-700 mb-1">Number of Reviews</label>
              <input
                id="pizza-reviews"
                type="number"
                value={newPizza.reviews}
                onChange={(e) => setNewPizza({ ...newPizza, reviews: e.target.value })}
                placeholder="120"
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2 flex items-center">
              <input
                id="is-veg"
                type="checkbox"
                checked={newPizza.isVeg}
                onChange={(e) => setNewPizza({ ...newPizza, isVeg: e.target.checked })}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
              />
              <label htmlFor="is-veg" className="text-sm font-medium text-gray-700">Vegetarian Pizza</label>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition duration-200 ease-in-out">
                Add Pizza
              </button>
            </div>
          </form>

          {/* Pizza List */}
          <div className="space-y-4">
            {pizzas.length > 0 ? pizzas.map(pizza => (
              <div key={pizza.name} className="border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-4 mb-3 md:mb-0">
                  <img src={pizza.image} alt={pizza.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{pizza.name} - <span className="text-green-600">₹{pizza.price.toFixed(2)}</span></p>
                    <p className="text-sm text-gray-600">
                      Rating: <span className="font-bold text-yellow-500">{pizza.rating} ★</span> ({pizza.reviews} reviews)
                      <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${pizza.isVeg ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {pizza.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setEditPizza({ ...pizza, originalName: pizza.name })}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md font-medium shadow-sm transition duration-200 ease-in-out"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePizza(pizza.name)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition duration-200 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 italic p-4 text-center">No pizzas available. Add some using the form above!</p>
            )}
          </div>

          {/* Edit Pizza Form */}
          {editPizza && (
            <form onSubmit={handleEditPizza} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-blue-50 rounded-lg shadow-inner border border-blue-200">
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Edit Pizza: <span className="font-bold">{editPizza.originalName}</span></h3>
              </div>
              <div>
                <label htmlFor="edit-pizza-name" className="block text-sm font-medium text-gray-700 mb-1">Pizza Name</label>
                <input
                  id="edit-pizza-name"
                  type="text"
                  value={editPizza.name}
                  onChange={(e) => setEditPizza({ ...editPizza, name: e.target.value })}
                  placeholder="Pizza Name"
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-pizza-price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  id="edit-pizza-price"
                  type="number"
                  value={editPizza.price}
                  onChange={(e) => setEditPizza({ ...editPizza, price: e.target.value })}
                  placeholder="Price"
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="edit-pizza-image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  id="edit-pizza-image"
                  type="text"
                  value={editPizza.image}
                  onChange={(e) => setEditPizza({ ...editPizza, image: e.target.value })}
                  placeholder="Image URL"
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-pizza-rating" className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                <input
                  id="edit-pizza-rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={editPizza.rating}
                  onChange={(e) => setEditPizza({ ...editPizza, rating: e.target.value })}
                  placeholder="Rating"
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-pizza-reviews" className="block text-sm font-medium text-gray-700 mb-1">Number of Reviews</label>
                <input
                  id="edit-pizza-reviews"
                  type="number"
                  value={editPizza.reviews}
                  onChange={(e) => setEditPizza({ ...editPizza, reviews: e.target.value })}
                  placeholder="Reviews"
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2 flex items-center">
                <input
                  id="edit-is-veg"
                  type="checkbox"
                  checked={editPizza.isVeg}
                  onChange={(e) => setEditPizza({ ...editPizza, isVeg: e.target.checked })}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                />
                <label htmlFor="edit-is-veg" className="text-sm font-medium text-gray-700">Vegetarian Pizza</label>
              </div>
              <div className="md:col-span-2 flex space-x-3 mt-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition duration-200 ease-in-out">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditPizza(null)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-lg shadow-md transition duration-200 ease-in-out"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Orders Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-indigo-500 pb-3">
            Manage Orders
          </h2>
          <div className="space-y-4">
            {orders.length > 0 ? orders.map((order) => (
              <div key={order.order_id} className="border border-gray-200 p-5 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-white hover:bg-gray-50 transition-colors duration-200">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Order ID</p>
                  <p className="font-mono text-gray-800 text-lg break-words">{order.order_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">User Email</p>
                  <p className="font-semibold text-gray-800 break-words">{order.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Price</p>
                  <p className="font-bold text-2xl text-green-600">₹{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-gray-500 font-medium">Current Status: <span className={`font-semibold ${order.status === 'Delivered' ? 'text-green-700' : 'text-indigo-600'}`}>{order.status}</span></p>
                  <select
                    value={order.newStatus}
                    onChange={(e) => {
                      const updatedOrders = orders.map(o =>
                        o.order_id === order.order_id ? { ...o, newStatus: e.target.value } : o
                      );
                      setOrders(updatedOrders);
                    }}
                    disabled={order.status === 'Delivered'}
                    className={`block w-full p-2 border border-gray-300 rounded-md shadow-sm text-base ${
                      order.status === 'Delivered' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {order.status !== 'Delivered' && order.newStatus !== order.status && (
                    <button
                      onClick={() => handleStatusChange(order.order_id, order.newStatus)}
                      className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-md w-full shadow-md transition duration-200 ease-in-out"
                    >
                      Update Status
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <p className="text-gray-500 italic p-4 text-center">No active orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;