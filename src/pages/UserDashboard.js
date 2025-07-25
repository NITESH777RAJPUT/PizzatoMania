import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import pizzaBg from '../assets/pizza-bg.jpg';
import pizzaLogo from '../assets/pizza-logo.png';
import ProfileCard from '../components/ProfileCard';
import LiveTracker from '../components/LiveTracker'; // UPDATED: Path theek kiya gaya

// Pizza menu aur baki components (PizzaCard, MenuButton, etc.) waise hi rahenge jaise pehle the.
// ... (Saara existing pizzaMenu, priceList, NutritionInfoPopup, StarRating, MenuButton, PizzaCard, etc. code yahan paste karein)
// ✨ UPDATED: Added rating, reviews, nutrition, and type to pizza data
const pizzaMenu = [
    { name: 'Margherita', image: '/images/margherita.jpg', price: 199, rating: 4.5, reviews: 120, type: 'veg', nutrition: { calories: '250 kcal', protein: '12g', fat: '10g' } },
    { name: 'Farmhouse', image: '/images/farmhouse.jpg', price: 249, rating: 4.7, reviews: 250, type: 'veg', nutrition: { calories: '280 kcal', protein: '14g', fat: '12g' } },
    { name: 'Peppy Paneer', image: '/images/paneer.jpg', price: 269, rating: 4.6, reviews: 180, type: 'veg', nutrition: { calories: '320 kcal', protein: '16g', fat: '15g' } },
    { name: 'Veggie Delight', image: '/images/veggie.jpg', price: 229, rating: 4.3, reviews: 95, type: 'veg', nutrition: { calories: '260 kcal', protein: '11g', fat: '9g' } },
    { name: 'Cheese Burst', image: '/images/cheese.jpg', price: 299, rating: 4.8, reviews: 320, type: 'veg', nutrition: { calories: '350 kcal', protein: '18g', fat: '20g' } },
    { name: 'BBQ Chicken', image: '/images/bbq-chicken.jpg', price: 349, rating: 4.9, reviews: 410, type: 'non-veg', nutrition: { calories: '380 kcal', protein: '22g', fat: '18g' } },
    { name: 'Spicy Mexican', image: '/images/mexican.jpg', price: 279, rating: 4.4, reviews: 155, type: 'veg', nutrition: { calories: '310 kcal', protein: '13g', fat: '14g' } },
    { name: 'Mushroom Magic', image: '/images/mushroom.jpg', price: 259, rating: 4.2, reviews: 80, type: 'veg', nutrition: { calories: '270 kcal', protein: '12g', fat: '11g' } },
    { name: 'Paneer Tikka', image: '/images/paneer-tikka.jpg', price: 289, rating: 4.7, reviews: 290, type: 'veg', nutrition: { calories: '330 kcal', protein: '17g', fat: '16g' } },
    { name: 'Pepperoni', image: '/images/pepperoni.jpg', price: 369, rating: 4.9, reviews: 500, type: 'non-veg', nutrition: { calories: '400 kcal', protein: '25g', fat: '22g' } },
    { name: 'Supreme Veggie', image: '/images/veggie.jpg', price: 319, rating: 4.5, reviews: 110, type: 'veg', nutrition: { calories: '290 kcal', protein: '15g', fat: '13g' } },
    { name: 'Chicken Delight', image: '/images/bbq-chicken.jpg', price: 359, rating: 4.8, reviews: 350, type: 'non-veg', nutrition: { calories: '390 kcal', protein: '24g', fat: '20g' } },
    { name: 'Spicy Veggie', image: '/images/mexican.jpg', price: 289, rating: 4.3, reviews: 130, type: 'veg', nutrition: { calories: '315 kcal', protein: '14g', fat: '14g' } },
    { name: 'Cheese Lover', image: '/images/cheese.jpg', price: 329, rating: 4.7, reviews: 280, type: 'veg', nutrition: { calories: '360 kcal', protein: '20g', fat: '22g' } },
    { name: 'Tikka Supreme', image: '/images/paneer-tikka.jpg', price: 299, rating: 4.6, reviews: 210, type: 'veg', nutrition: { calories: '340 kcal', protein: '18g', fat: '17g' } },
    { name: 'Classic Margherita', image: '/images/margherita.jpg', price: 209, rating: 4.4, reviews: 90, type: 'veg', nutrition: { calories: '255 kcal', protein: '12g', fat: '10g' } },
    { name: 'Farm Fresh', image: '/images/farmhouse.jpg', price: 259, rating: 4.6, reviews: 190, type: 'veg', nutrition: { calories: '285 kcal', protein: '14g', fat: '12g' } },
    { name: 'Paneer Spice', image: '/images/paneer.jpg', price: 279, rating: 4.5, reviews: 170, type: 'veg', nutrition: { calories: '325 kcal', protein: '16g', fat: '15g' } },
    { name: 'Veggie Supreme', image: '/images/veggie.jpg', price: 239, rating: 4.2, reviews: 85, type: 'veg', nutrition: { calories: '265 kcal', protein: '11g', fat: '9g' } },
    { name: 'Cheese Overload', image: '/images/cheese.jpg', price: 309, rating: 4.9, reviews: 380, type: 'veg', nutrition: { calories: '355 kcal', protein: '18g', fat: '21g' } },
    { name: 'Margherita Deluxe', image: '/images/margherita.jpg', price: 219, rating: 4.5, reviews: 115, type: 'veg', nutrition: { calories: '260 kcal', protein: '13g', fat: '11g' } },
    { name: 'Farmhouse Deluxe', image: '/images/farmhouse.jpg', price: 279, rating: 4.7, reviews: 265, type: 'veg', nutrition: { calories: '290 kcal', protein: '15g', fat: '13g' } },
    { name: 'Paneer Extravaganza', image: '/images/paneer.jpg', price: 299, rating: 4.6, reviews: 195, type: 'veg', nutrition: { calories: '335 kcal', protein: '17g', fat: '16g' } },
    { name: 'Veggie Mania', image: '/images/veggie.jpg', price: 259, rating: 4.3, reviews: 105, type: 'veg', nutrition: { calories: '275 kcal', protein: '12g', fat: '10g' } },
    { name: 'Cheese Supreme', image: '/images/cheese.jpg', price: 339, rating: 4.8, reviews: 340, type: 'veg', nutrition: { calories: '370 kcal', protein: '20g', fat: '23g' } },
    { name: 'BBQ Blast', image: '/images/bbq-chicken.jpg', price: 369, rating: 4.9, reviews: 420, type: 'non-veg', nutrition: { calories: '390 kcal', protein: '23g', fat: '19g' } },
    { name: 'Mexican Heat', image: '/images/mexican.jpg', price: 299, rating: 4.4, reviews: 165, type: 'veg', nutrition: { calories: '320 kcal', protein: '14g', fat: '15g' } },
    { name: 'Mushroom Delight', image: '/images/mushroom.jpg', price: 269, rating: 4.2, reviews: 90, type: 'veg', nutrition: { calories: '275 kcal', protein: '12g', fat: '11g' } },
    { name: 'Tikka Blast', image: '/images/paneer-tikka.jpg', price: 309, rating: 4.7, reviews: 300, type: 'veg', nutrition: { calories: '345 kcal', protein: '18g', fat: '17g' } },
    { name: 'Pepperoni Supreme', image: '/images/pepperoni.jpg', price: 379, rating: 4.9, reviews: 520, type: 'non-veg', nutrition: { calories: '410 kcal', protein: '26g', fat: '23g' } },
    { name: 'Extra Cheese Margherita', image: '/images/margherita.jpg', price: 229, rating: 4.6, reviews: 140, type: 'veg', nutrition: { calories: '270 kcal', protein: '14g', fat: '12g' } },
    { name: 'Farmhouse Special', image: '/images/farmhouse.jpg', price: 269, rating: 4.8, reviews: 280, type: 'veg', nutrition: { calories: '295 kcal', protein: '15g', fat: '14g' } },
    { name: 'Paneer Supreme', image: '/images/paneer.jpg', price: 289, rating: 4.7, reviews: 200, type: 'veg', nutrition: { calories: '330 kcal', protein: '17g', fat: '16g' } },
    { name: 'Veggie Blast', image: '/images/veggie.jpg', price: 249, rating: 4.4, reviews: 100, type: 'veg', nutrition: { calories: '270 kcal', protein: '12g', fat: '10g' } },
    { name: 'Cheese Mania', image: '/images/cheese.jpg', price: 319, rating: 4.8, reviews: 360, type: 'veg', nutrition: { calories: '365 kcal', protein: '19g', fat: '22g' } },
    { name: 'BBQ Special', image: '/images/bbq-chicken.jpg', price: 359, rating: 4.9, reviews: 430, type: 'non-veg', nutrition: { calories: '395 kcal', protein: '24g', fat: '20g' } },
    { name: 'Mexican Supreme', image: '/images/mexican.jpg', price: 309, rating: 4.5, reviews: 175, type: 'veg', nutrition: { calories: '325 kcal', protein: '15g', fat: '15g' } },
    { name: 'Mushroom Supreme', image: '/images/mushroom.jpg', price: 279, rating: 4.3, reviews: 100, type: 'veg', nutrition: { calories: '280 kcal', protein: '13g', fat: '12g' } },
    { name: 'Tikka Delight', image: '/images/paneer-tikka.jpg', price: 319, rating: 4.7, reviews: 310, type: 'veg', nutrition: { calories: '350 kcal', protein: '19g', fat: '18g' } },
    { name: 'Pepperoni Delight', image: '/images/pepperoni.jpg', price: 389, rating: 4.9, reviews: 550, type: 'non-veg', nutrition: { calories: '420 kcal', protein: '27g', fat: '24g' } },
];
// Pricing structure (No changes here)
const priceList = {
  base: 30,
  sauce: 10,
  cheese: 20,
  veggie: 5,
  size: { small: 0.8, medium: 1.0, large: 1.3 },
};

// ✨ NEW: NutritionInfoPopup component
const NutritionInfoPopup = ({ pizza, onClose, theme }) => {
    if (!pizza.nutrition) return null;
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in`}>
            <div className={`p-6 rounded-2xl shadow-2xl max-w-sm w-full m-4 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{pizza.name}</h3>
                        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Nutritional Information</p>
                    </div>
                    <button onClick={onClose} className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`} aria-label="Close nutrition info">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Calories:</span><span className="font-semibold">{pizza.nutrition.calories}</span></div>
                    <div className="flex justify-between text-sm"><span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Protein:</span><span className="font-semibold">{pizza.nutrition.protein}</span></div>
                    <div className="flex justify-between text-sm"><span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Fat:</span><span className="font-semibold">{pizza.nutrition.fat}</span></div>
                </div>
                <MenuButton onClick={onClose} variant="secondary" className="w-full mt-6" ariaLabel="Close nutrition info">Close</MenuButton>
            </div>
        </div>
    );
};


// ✨ NEW: StarRating component
const StarRating = ({ rating = 0, theme }) => {
    const totalStars = 5;
    const starArray = Array.from({ length: totalStars });

    return (
        <div className="flex items-center">
            {starArray.map((_, index) => (
                <svg
                    key={index}
                    className={`w-4 h-4 ${
                        index < Math.floor(rating) ? 'text-yellow-400' : (theme === 'dark' ? 'text-gray-600' : 'text-gray-300')
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

// Re-designed Components
const MenuButton = ({ onClick, children, className, disabled, ariaLabel, variant = 'primary' }) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantClasses = {
        primary: 'bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        ghost: 'bg-transparent text-teal-500 hover:bg-teal-50 dark:hover:bg-gray-700',
    };
    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
            {children}
        </button>
    );
};

const PizzaCard = ({ pizza, onOrder, onCustomize, onAddToCart, onShowNutrition, theme }) => {
    return (
        <div className={`group relative rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-all duration-300 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <img src={pizza.image} alt={pizza.name} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="p-4 flex flex-col h-full">
                <h3 className={`text-lg font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{pizza.name}</h3>
                <div className="flex items-center gap-2 my-2">
                    <StarRating rating={pizza.rating} theme={theme} />
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>({pizza.reviews} reviews)</span>
                </div>
                <p className="text-teal-500 font-bold text-xl">₹{pizza.price}</p>
                 <div className="flex flex-col gap-2 mt-4 flex-grow">
                    <MenuButton onClick={() => onAddToCart(pizza)} className="w-full" ariaLabel={`Add ${pizza.name} to cart`}>Add to Cart</MenuButton>
                    <div className="flex gap-2">
                        <MenuButton onClick={() => onCustomize(pizza)} variant="ghost" className="w-full text-xs" ariaLabel={`Customize ${pizza.name} pizza`}>Customize</MenuButton>
                        <MenuButton onClick={() => onOrder(pizza)} variant="secondary" className="w-full text-xs" ariaLabel={`Order ${pizza.name} pizza`}>Order Now</MenuButton>
                    </div>
                </div>
                <div className="mt-auto pt-2">
                    <MenuButton onClick={() => onShowNutrition(pizza)} variant="ghost" className="w-full text-xs !text-gray-500 hover:!bg-gray-100 dark:hover:!bg-gray-700" ariaLabel={`View nutrition info for ${pizza.name}`}>
                        Nutrition Info
                    </MenuButton>
                </div>
            </div>
        </div>
    );
};


const SelectInput = ({ value, onChange, options, label, placeholder, price, id, theme }) => (
  <div className="relative">
    <label htmlFor={id} className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
      {label} {price && <span className="text-xs text-gray-500">(+₹{price})</span>}
    </label>
    <select id={id} className={`w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 appearance-none ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'}`} value={value} onChange={onChange} aria-label={label}>
      <option value="">{placeholder}</option>
      {options.map((option) => (<option key={option} value={option}>{option}</option>))}
    </select>
     <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
);

const AddressInput = ({ name, value, onChange, placeholder, id, theme }) => (
  <input id={id} name={name} placeholder={placeholder} className={`w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'}`} value={value} onChange={onChange} aria-label={placeholder}/>
);

const LoadingSpinner = ({ theme }) => (
  <div className="flex justify-center items-center py-16">
    <div className={`animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 ${theme === 'dark' ? 'border-teal-400' : 'border-teal-500'}`} aria-label="Loading"></div>
  </div>
);

const CartSummary = ({ cart, onViewCart, theme }) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <button onClick={onViewCart} className={`relative p-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${theme === 'dark' ? 'bg-gray-800 text-white focus:ring-offset-gray-900' : 'bg-white text-gray-800 focus:ring-offset-gray-100'}`} aria-label="View cart">
        <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        {totalItems > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">{totalItems}</span>)}
    </button>
  );
};

const AddToCartPopup = ({ pizza, onConfirm, onCancel, theme }) => {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const finalPrice = (pizza.price * priceList.size[selectedSize] * quantity).toFixed(2);
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in`}>
      <div className={`p-6 rounded-2xl shadow-2xl max-w-sm w-full m-4 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{pizza.name}</h3>
        <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Customize your addition</p>
        <div className="space-y-5">
          <SelectInput label="Size" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} options={['small', 'medium', 'large']} placeholder="Select Size" id="cart-size-select" theme={theme}/>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Quantity</label>
            <div className="flex items-center gap-4">
               <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`} aria-label="Decrease quantity">-</button>
              <span className={`text-lg font-bold w-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{quantity}</span>
              <button onClick={() => setQuantity((prev) => prev + 1)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`} aria-label="Increase quantity">+</button>
            </div>
          </div>
           <div className="text-center pt-2">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Price</p>
                <p className="text-teal-500 font-bold text-3xl">₹{finalPrice}</p>
            </div>
          <div className="flex gap-3 pt-2">
            <MenuButton onClick={onCancel} variant="secondary" className="w-full" ariaLabel="Cancel add to cart">Cancel</MenuButton>
            <MenuButton onClick={() => onConfirm(pizza, selectedSize, quantity)} className="w-full" ariaLabel="Confirm add to cart">Add to Cart</MenuButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✨ NEW: FeedbackPopup component
const FeedbackPopup = ({ order, onClose, onSubmit, theme }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (rating === 0) {
            alert('Please provide a star rating.');
            return;
        }
        onSubmit(order.order_id, rating, comment);
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in`}>
            <div className={`p-6 rounded-2xl shadow-2xl max-w-sm w-full m-4 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Rate Your Order</h3>
                        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Order ID: <span className="font-mono text-xs">{order.order_id}</span></p>
                    </div>
                    <button onClick={onClose} className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`} aria-label="Close feedback form">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Overall Rating</label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`w-8 h-8 cursor-pointer ${
                                        star <= rating ? 'text-yellow-400' : (theme === 'dark' ? 'text-gray-600' : 'text-gray-300')
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    onClick={() => setRating(star)}
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="feedback-comment" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Comments (Optional)</label>
                        <textarea
                            id="feedback-comment"
                            rows="4"
                            className={`w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'}`}
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <MenuButton onClick={onClose} variant="secondary" className="w-full" ariaLabel="Cancel feedback">Cancel</MenuButton>
                        <MenuButton onClick={handleSubmit} className="w-full" ariaLabel="Submit feedback">Submit Feedback</MenuButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ✨ NEW: OrderDetailsPopup component
const OrderDetailsPopup = ({ order, onClose, onCancelOrder, theme }) => {
    if (!order) return null;

    const isCancellable = order.status === 'Pending' || order.status === 'Preparing';

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in`}>
            <div className={`p-6 rounded-2xl shadow-2xl max-w-lg w-full m-4 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Order Details</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Order ID: <span className="font-mono text-xs">{order.order_id}</span></p>
                    </div>
                    <button onClick={onClose} className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`} aria-label="Close order details">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Items:</p>
                        <ul className="list-disc list-inside ml-2 text-sm">
                            {order.pizza_details.cartItems ? (
                                order.pizza_details.cartItems.map((item, index) => (
                                    <li key={index} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {item.pizzaName} ({item.size}, Qty: {item.quantity}) - ₹{(item.price * item.quantity).toFixed(2)}
                                    </li>
                                ))
                            ) : (
                                <li className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Custom Pizza: {order.pizza_details.selectedBase}, {order.pizza_details.selectedSauce}, {order.pizza_details.selectedCheese}, {order.pizza_details.selectedVeggies?.join(', ') || 'No veggies'} (Size: {order.pizza_details.size}, Qty: {order.pizza_details.quantity})
                                </li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Delivery Address:</p>
                        <p className={`text-sm ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {order.address.name}, {order.address.phone}<br/>
                            {order.address.street}, {order.address.city}, {order.address.pincode}
                        </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Total Amount:</p>
                        <p className="text-teal-500 font-bold text-xl">₹{order.totalPrice.toFixed(2)}</p>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Status:</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Pending' || order.status === 'Preparing' ? (theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800') : order.status === 'Out for Delivery' ? (theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800') : (theme === 'dark' ? 'bg-teal-900 text-teal-300' : 'bg-teal-100 text-teal-800')}`}>{order.status}</span>
                    </div>
                    
                    {order.feedback && (
                        <div>
                            <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Your Feedback:</p>
                            <div className="ml-2">
                                <StarRating rating={order.feedback.rating} theme={theme} />
                                {order.feedback.comment && <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>"{order.feedback.comment}"</p>}
                            </div>
                        </div>
                    )}

                </div>

                <div className="flex gap-3 pt-2">
                    {isCancellable && (
                        <MenuButton onClick={() => onCancelOrder(order.order_id)} variant="danger" className="w-full" ariaLabel="Cancel order">Cancel Order</MenuButton>
                    )}
                    <MenuButton onClick={onClose} variant="secondary" className="w-full" ariaLabel="Close">Close</MenuButton>
                </div>
            </div>
        </div>
    );
};


// --- Main Dashboard Component ---
const UserDashboard = ({ setToken }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({ name: 'Guest User', photo: '/images/default-user.png', address: { name: '', phone: '', street: '', city: '', pincode: '' } });
  const [editMode, setEditMode] = useState(false);
  const [bases, setBases] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [veggies, setVeggies] = useState([]);
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedSauce, setSelectedSauce] = useState('');
  const [selectedCheese, setSelectedCheese] = useState('');
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '', pincode: '' });
  const [step, setStep] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isDirectOrder, setIsDirectOrder] = useState(false);
  const [selectedPizzaPrice, setSelectedPizzaPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [cartCheckout, setCartCheckout] = useState(false);
  const [showAddToCartPopup, setShowAddToCartPopup] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const pizzaContainerRef = useRef(null);
  const profileContainerRef = useRef(null);
  const [sortBy, setSortBy] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showNutritionPopup, setShowNutritionPopup] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  // ✨ NEW: State for live tracking and feedback
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [showLiveTracker, setShowLiveTracker] = useState(false); // Changed to true when tracking starts
  const trackingIntervalRef = useRef(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackOrder, setFeedbackOrder] = useState(null);
  // ✨ NEW: State for order details popup
  const [showOrderDetailsPopup, setShowOrderDetailsPopup] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);


  // --- API Calls and Logic ---
  useEffect(() => {
    // ... (Saara existing useEffect code for fetching varieties, profile, cart)
    const API_URL = process.env.REACT_APP_API_URL || 'https://pizzamania-0igb.onrender.com';
    const fetchVarieties = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/varieties`);
        setBases(response.data.bases || []);
        setSauces(response.data.sauces || []);
        setCheeses(response.data.cheeses || []);
        setVeggies([...(response.data.varieties || []), 'Bell Peppers', 'Black Olives', 'Jalapenos', 'Sweet Corn', 'Cherry Tomatoes']);
      } catch (error) {
        console.error('Error fetching varieties:', error);
        setVeggies(['Onion', 'Tomato', 'Capsicum', 'Mushroom', 'Spinach', 'Bell Peppers', 'Black Olives', 'Jalapenos', 'Sweet Corn', 'Cherry Tomatoes']);
        // alert('Failed to load pizza options. Using default options.'); // Removed alert for better UX
      } finally {
        setIsLoading(false);
      }
    };
    const fetchUserProfile = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) { setCart([]); return; }
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/profile/${email}`);
        setUserProfile({ name: res.data.name, photo: res.data.photo, address: res.data.address || { name: '', phone: '', street: '', city: '', pincode: '' }});
        setAddress(res.data.address || { name: '', phone: '', street: '', city: '', pincode: '' });
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        // alert('Failed to load profile. Please try again.'); // Removed alert for better UX
      } finally {
        setIsLoading(false);
      }
    };
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token || token === 'undefined') { setCart([]); return; }
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/cart`, { headers: { Authorization: `Bearer ${token}` } });
        setCart(response.data.items || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
        if (error.response?.status === 401) {
          // alert("Session expired. Please login again."); // Removed alert for better UX
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
          navigate("/login");
        } else {
          // alert("Failed to load cart. Please try again."); // Removed alert for better UX
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchVarieties();
    fetchUserProfile();
    fetchCart();
  }, [navigate]);


  // ✨ NEW: useEffect for tracking
  useEffect(() => {
    // Agar trackingOrder set hai aur status Delivered nahi hai, tabhi interval shuru karein
    if (trackingOrder && trackingOrder.status !== 'Delivered') {
      setShowLiveTracker(true); // LiveTracker dikhana shuru karein
      trackingIntervalRef.current = setInterval(() => {
        fetchOrderStatus(trackingOrder.order_id);
      }, 5000); // Har 5 second mein status update karein
    } else {
      clearInterval(trackingIntervalRef.current); // Interval clear karein
      setShowLiveTracker(false); // LiveTracker hide karein
    }

    // Cleanup function: component unmount hone par interval clear karein
    return () => clearInterval(trackingIntervalRef.current);
  }, [trackingOrder]); // trackingOrder change hone par effect re-run karein


  const fetchOrders = async () => {
    const email = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');
    if (!email || !token) { alert('Please log in to view your orders.'); return; }
    setIsLoading(true);
    try {
      const response = await axios.get(`https://pizzamania-0igb.onrender.com/api/orders/${email}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(response.data || []);
      setStep(4);
    } catch (error) { console.error('Error fetching orders:', error); alert('Failed to load orders. Please try again.'); } 
    finally { setIsLoading(false); }
  };
  
  // ✨ NEW: Function to fetch a single order's status
  const fetchOrderStatus = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get(`https://pizzamania-0igb.onrender.com/api/orders/status/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrackingOrder(response.data); // Update tracking order state
      if (response.data.status === 'Delivered') {
        clearInterval(trackingIntervalRef.current); // Stop polling once delivered
        setShowLiveTracker(false); // Hide tracker
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
      clearInterval(trackingIntervalRef.current); // Stop on error
      setShowLiveTracker(false); // Hide tracker on error
    }
  };


  const handlePayment = async () => {
    if (totalPrice <= 0) { alert('Please select or customize a pizza or add items to cart before payment.'); return; }
    if (!validateAddress()) return;
    setIsLoading(true);
    try {
      const response = await axios.post('https://pizzamania-0igb.onrender.com/api/orders/create-order', { amount: totalPrice });

      const { id: order_id, amount } = response.data;
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_etV3KSpnoWM3Av', amount: amount * 100, currency: 'INR', name: 'Pizza Mania', description: 'Pizza Order', order_id: order_id,
        handler: async function (paymentResponse) {
          try {
            const res = await axios.post('https://pizzamania-0igb.onrender.com/api/orders/confirm-payment', {
                order_id,
                payment_id: paymentResponse.razorpay_payment_id,
                userEmail: localStorage.getItem('userEmail') || 'guest@example.com',
                pizza_details: cartCheckout ? { cartItems: cart } : { selectedBase, selectedSauce, selectedCheese, selectedVeggies, size: selectedSize, quantity },
                address,
                totalPrice,
              }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            
            setTrackingOrder(res.data.order); // Set the order for tracking
            setShowLiveTracker(true); // Show live tracker
            if (cartCheckout) { await handleClearCart(); }
            setStep(8); // Go to tracking screen
            
          } catch (error) { console.error('Error confirming payment:', error); alert('Payment confirmation failed. Please try again.'); }
        },
        prefill: { name: address.name, email: localStorage.getItem('userEmail') || 'customer@example.com', contact: address.phone, },
        notes: { address: `${address.street}, ${address.city}, ${address.pincode}` },
        theme: { color: '#14b8a6' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) { console.error('Payment error:', error); alert('Payment failed. Please try again.'); } finally { setIsLoading(false); }
  };

  // ✨ NEW: Handler to start tracking an existing order
  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
    setStep(8);
  };

  // ✨ NEW: Handler for submitting feedback
  const handleSubmitFeedback = async (orderId, rating, comment) => {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please log in to submit feedback.'); return; }
    setIsLoading(true);
    try {
      await axios.post(
        `https://pizzamania-0igb.onrender.com/api/orders/${orderId}/feedback`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Feedback submitted successfully!');
      // Update the order in the local state to reflect feedback given
      setOrders(prevOrders => prevOrders.map(order => 
        order.order_id === orderId ? { ...order, feedback: { rating, comment } } : order
      ));
      setShowFeedbackPopup(false);
      setFeedbackOrder(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✨ NEW: Handler to show feedback popup
  const handleShowFeedback = (order) => {
    setFeedbackOrder(order);
    setShowFeedbackPopup(true);
  };

  // ✨ NEW: Handler to show order details popup
  const handleShowOrderDetails = (order) => {
    setSelectedOrderDetails(order);
    setShowOrderDetailsPopup(true);
  };

  // ✨ NEW: Handler to cancel an order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) { alert('Please log in to cancel orders.'); return; }
    setIsLoading(true);
    try {
      await axios.post(
        `https://pizzamania-0igb.onrender.com/api/orders/${orderId}/cancel`,
        {}, // No body needed for a simple cancel
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Order cancelled successfully!');
      // Update the order status in the local state
      setOrders(prevOrders => prevOrders.map(order => 
        order.order_id === orderId ? { ...order, status: 'Cancelled' } : order
      ));
      setShowOrderDetailsPopup(false); // Close popup after cancellation
      setSelectedOrderDetails(null);
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // ... (Baaki saare functions jaise saveAddress, handleAddToCart, etc. waise hi rahenge)
  const saveAddress = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) { alert('Please log in to save your address.'); return; }
    if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) { alert('Please fill all address fields.'); return; }
    setIsLoading(true);
    try {
      await axios.post(`https://pizzamania-0igb.onrender.com/api/profile/${email}/address`, { address });
      setUserProfile((prev) => ({ ...prev, address }));
      alert('Address saved successfully!');
      setStep(0);
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (pizza, size, quantity) => {
    const token = localStorage.getItem('token');
    console.log('Token in handleAddToCart:', token); // Debug log
    if (!token) { alert('Please log in to add items to cart.'); return; }
    setIsLoading(true);
    try {
      const response = await axios.post('https://pizzamania-0igb.onrender.com/api/cart/add', { pizzaName: pizza.name, price: pizza.price * priceList.size[size], quantity, size, image: pizza.image, }, { headers: { Authorization: `Bearer ${token}` } });
      setCart(response.data.items || []);
      alert(`${pizza.name} added to cart!`);
      setShowAddToCartPopup(false);
      setSelectedPizza(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateQuantity = async (pizzaName, size, delta) => {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please log in to update cart.'); return; }
    const item = cart.find((i) => i.pizzaName === pizzaName && i.size === size);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) {
        handleRemoveFromCart(pizzaName, size);
        return;
    }
    try {
      const response = await axios.put('https://pizzamania-0igb.onrender.com/api/cart/update', { pizzaName, size, quantity: newQuantity }, { headers: { Authorization: `Bearer ${token}` } });
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      alert('Failed to update cart. Please try again.');
    }
  };

  const handleRemoveFromCart = async (pizzaName, size) => {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please log in to remove items from cart.'); return; }
    setIsLoading(true);
    try {
      const response = await axios.delete('https://pizzamania-0igb.onrender.com/api/cart/remove', { headers: { Authorization: `Bearer ${token}` }, data: { pizzaName, size }, });
      setCart(response.data.items || []);
      alert(`${pizzaName} removed from cart!`);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove from cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please log in to clear cart.'); return; }
    setIsLoading(true);
    try {
      const response = await axios.delete('https://pizzamania-0igb.onrender.com/api/cart/clear', { headers: { Authorization: `Bearer ${token}` }, });
      setCart(response.data.items || []);
      alert('Cart cleared successfully!');
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let finalPrice = 0;
    if (isDirectOrder) { 
        finalPrice = (selectedPizzaPrice || 0) * (priceList.size[selectedSize] || 1) * quantity;
    } else if (cartCheckout) { 
        finalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    } else { 
        const pizzaBasePrice = selectedPizzaPrice || 0;
        const basePrice = selectedBase ? priceList.base : 0;
        const saucePrice = selectedSauce ? priceList.sauce : 0;
        const cheesePrice = selectedCheese ? priceList.cheese : 0;
        const veggiePrice = selectedVeggies.length * priceList.veggie;
        const subtotal = (pizzaBasePrice + basePrice + saucePrice + cheesePrice + veggiePrice) * (priceList.size[selectedSize] || 1);
        finalPrice = subtotal * quantity;
    }
    setTotalPrice(finalPrice);
  }, [selectedBase, selectedSauce, selectedCheese, selectedVeggies, selectedSize, isDirectOrder, selectedPizzaPrice, quantity, cart, cartCheckout]);

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('userEmail'); setToken(null); navigate('/login'); };
  const handleAddressChange = (e) => { setAddress({ ...address, [e.target.name]: e.target.value }); };
  const handleVeggieChange = (e) => { const value = e.target.value; setSelectedVeggies((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]); };
  const handleDirectOrder = (pizza) => { setIsDirectOrder(true); setCartCheckout(false); setSelectedPizzaPrice(pizza.price); setSelectedBase(pizza.name + ' Base'); setSelectedSauce('Standard Sauce'); setSelectedCheese('Standard Cheese'); setSelectedVeggies([]); setSelectedSize('medium'); setQuantity(1); setStep(2); };
  const handleCustomize = (pizza) => { setIsDirectOrder(false); setCartCheckout(false); setSelectedPizzaPrice(pizza.price); setSelectedBase(''); setSelectedSauce(''); setSelectedCheese(''); setSelectedVeggies([]); setQuantity(1); setStep(1); };
  const handleAddToCartPopup = (pizza) => { setSelectedPizza(pizza); setShowAddToCartPopup(true); };
  const validateCustomization = () => { if (!selectedBase || !selectedSauce || !selectedCheese) { alert('Please select base, sauce, and cheese to proceed.'); return false; } return true; };
  const validateAddress = () => { const { name, phone, street, city, pincode } = address; if (!name || !phone || !street || !city || !pincode) { alert('Please fill all address fields.'); return false; } return true; };
  
  const handleReorder = async (order) => {
    if (!order.pizza_details.cartItems) {
      alert("Cannot reorder custom pizzas yet.");
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to reorder.');
      return;
    }
    setIsLoading(true);
    try {
      // Add each item from the past order to the current cart
      for (const item of order.pizza_details.cartItems) {
        await axios.post(
          'https://pizzamania-0igb.onrender.com/api/cart/add',
          {
            pizzaName: item.pizzaName,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            image: item.image,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      // Fetch the updated cart
      const response = await axios.get('https://pizzamania-0igb.onrender.com/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.items || []);
      alert('Items from your past order have been added to your cart!');
      setStep(7); // Navigate to cart view
    } catch (error) {
      console.error('Error reordering:', error);
      alert('Failed to reorder. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => { setTheme(theme === 'light' ? 'dark' : 'light'); };
  const handleSearchChange = (e) => { setSearchQuery(e.target.value); };
  const handleClearSearch = () => { setSearchQuery(''); }; // ✨ NEW: Clear search
  const handleViewCart = () => { setStep(7); };
  const handleClearOrderSearch = () => { setOrderSearchQuery(''); }; // ✨ NEW: Clear order search

  const filteredPizzas = pizzaMenu
    .filter((pizza) => pizza.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((pizza) => {
        if (filterType === 'veg') return pizza.type === 'veg';
        if (filterType === 'non-veg') return pizza.type === 'non-veg';
        return true;
    })
    .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
    });

  const filteredOrders = orders.filter(order => {
      if (!orderSearchQuery) return true;
      if (order.pizza_details.cartItems) {
          return order.pizza_details.cartItems.some(item =>
              item.pizzaName.toLowerCase().includes(orderSearchQuery.toLowerCase())
          );
      }
      return (order.pizza_details.selectedBase || '').toLowerCase().includes(orderSearchQuery.toLowerCase());
  });

  // --- JSX Rendering ---
  

  return (
    <div className={`min-h-screen w-full flex font-sans ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
       <aside className={`fixed top-0 left-0 h-full shadow-xl z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 p-4 flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center gap-3 px-2 mb-8">
                    <img src={pizzaLogo} alt="Pizza Mania Logo" className="w-10 h-10" />
                    <h1 className="text-xl font-bold">Pizza Mania</h1>
                </div>
                <nav className="flex-grow space-y-2">
                    {[
                        { label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3', onClick: () => { setStep(0); setIsSidebarOpen(false); setSearchQuery(''); setShowLiveTracker(false); setTrackingOrder(null); } },
                        { label: 'My Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', onClick: () => { fetchOrders(); setIsSidebarOpen(false); setShowLiveTracker(false); setTrackingOrder(null); } },
                        { label: 'Cart', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', onClick: () => { setStep(7); setIsSidebarOpen(false); setShowLiveTracker(false); setTrackingOrder(null); } },
                        { label: 'My Address', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', onClick: () => { setStep(6); setIsSidebarOpen(false); setShowLiveTracker(false); setTrackingOrder(null); } },
                    ].map(({ label, icon, onClick }) => (
                        <button key={label} className={`flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} onClick={onClick}>
                            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} /></svg>
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>
                <div className="mt-auto">
                     <button onClick={handleLogout} className={`flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-red-500 ${theme === 'dark' ? 'hover:bg-red-900/50' : 'hover:bg-red-50'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            
            {/* Sidebar Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsSidebarOpen(false)}></div>}

            <main className="w-full flex-1 flex flex-col">
                {/* Header */}
                <header className={`sticky top-0 z-30 flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'bg-gray-900/80 border-gray-700 backdrop-blur-sm' : 'bg-gray-50/80 border-gray-200 backdrop-blur-sm'}`}>
                    <div className="flex items-center gap-2">
                        {/* Mobile menu toggle */}
                        <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`} onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        {/* Search input (hidden on small screens, shown on sm and up) */}
                        <div className="relative hidden sm:block">
                            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.65-1.65z" /></svg>
                            <input type="text" placeholder="Search Pizzas..." value={searchQuery} onChange={handleSearchChange} className={`w-64 pl-10 p-2 rounded-lg border-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`} aria-label="Search pizzas" />
                            {searchQuery && ( // ✨ NEW: Clear search button
                                <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Theme toggle */}
                        <button onClick={toggleTheme} className="p-2 rounded-full transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                             <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={theme === 'light' ? 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' : 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'} /></svg>
                        </button>
                        {/* Cart Summary */}
                        <CartSummary cart={cart} onViewCart={handleViewCart} theme={theme} />
                        {/* User Profile / Edit Profile */}
                        <div
  className="flex items-center gap-3 cursor-pointer"
  onClick={() => setEditMode(true)}
>
  {userProfile?.photo ? (
    <img
      src={
        userProfile.photo.startsWith('http')
          ? userProfile.photo
          : `https://pizzamania-0igb.onrender.com/uploads/${userProfile.photo}`
      }
      alt="User profile"
      className="w-10 h-10 rounded-full border-2 border-teal-500 shadow-sm object-cover"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold shadow-sm border-2 border-teal-500">
      {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
    </div>
  )}

  <div className="hidden md:block">
    <p
      className={`font-semibold text-sm truncate ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}
    >
      {userProfile?.name || 'User'}
    </p>
    <p
      className={`text-xs ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}
    >
      Edit Profile
    </p>
  </div>
</div>

                    </div>
                </header>

      <div ref={pizzaContainerRef} className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {isLoading && <LoadingSpinner theme={theme} />}
        

        {/* Home Screen (Step 0) */}
        {!isLoading && step === 0 && (
           <div className="animate-fade-in">
             {/* Live tracker rendering block (only if required) */}
            {showLiveTracker && trackingOrder && trackingOrder.status !== 'Delivered' && (
              <div className="mb-8">
                <LiveTracker order={trackingOrder} theme={theme} />
              </div>
            )}

            <div className="mb-8 rounded-xl overflow-hidden" style={{backgroundImage: `url(${pizzaBg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                <div className={`p-8 md:p-16 text-center ${theme === 'dark' ? 'bg-black/70' : 'bg-black/50'}`}>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Taste the Perfection</h2>
                    <p className="text-lg text-gray-200">Freshly baked pizzas, delivered right to your door.</p>
                </div>
            </div>
            
            <div className={`flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{searchQuery ? `Results for "${searchQuery}"` : "Our Bestsellers"}</h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"> {/* Added flex-col for mobile */}
                    <SelectInput value={filterType} onChange={(e) => setFilterType(e.target.value)} options={['veg', 'non-veg']} placeholder="Filter by Type" id="filter-type-select" theme={theme} />
                    <SelectInput value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={['rating', 'price-asc', 'price-desc']} placeholder="Sort by" id="sort-by-select" theme={theme} />
                </div>
            </div>
            
            {filteredPizzas.length === 0 ? (
                <div className="text-center py-16"><p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No pizzas found. Try a different search!</p></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPizzas.map((pizza, index) => (<PizzaCard key={index} pizza={pizza} onOrder={handleDirectOrder} onCustomize={handleCustomize} onAddToCart={handleAddToCartPopup} onShowNutrition={(p) => { setSelectedPizza(p); setShowNutritionPopup(true); }} theme={theme} />))}
                </div>
            )}
        </div>
        )}

        {/* Steps 1, 2, 3, 6 (Customization, Address, etc.) */}
        {!isLoading && (step === 1 || step === 2 || step === 3 || step === 6) && (
           <div className={`max-w-2xl mx-auto p-6 rounded-xl shadow-lg animate-slide-up ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                            {step === 1 && (
                                <div className="space-y-6">
                                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Customize Your Pizza</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <SelectInput label="Base" value={selectedBase} onChange={(e) => setSelectedBase(e.target.value)} options={bases} placeholder="Select Base" price={priceList.base} id="base-select" theme={theme} />
                                        <SelectInput label="Sauce" value={selectedSauce} onChange={(e) => setSelectedSauce(e.target.value)} options={sauces} placeholder="Select Sauce" price={priceList.sauce} id="sauce-select" theme={theme} />
                                        <SelectInput label="Cheese" value={selectedCheese} onChange={(e) => setSelectedCheese(e.target.value)} options={cheeses} placeholder="Select Cheese" price={priceList.cheese} id="cheese-select" theme={theme} />
                                        <SelectInput label="Size" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} options={['small', 'medium', 'large']} placeholder="Select Size" id="size-select" theme={theme} />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Veggies <span className="text-xs text-gray-400">(₹5 each)</span></label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                            {veggies.map((veg) => (
                                                <label key={veg} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                                    <input type="checkbox" value={veg} checked={selectedVeggies.includes(veg)} onChange={handleVeggieChange} className="h-4 w-4 text-teal-500 focus:ring-teal-500 rounded border-gray-300 dark:bg-gray-800 dark:border-gray-600" aria-label={`Select ${veg}`} />
                                                    <span className={`text-sm font-medium`}>{veg}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center flex-wrap gap-4"> {/* Added flex-wrap for mobile */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-1`}>Quantity</label>
                                            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value === '' ? 1 : Number(e.target.value))} className={`w-24 p-2 rounded-lg border-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} aria-label="Select quantity" />
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Price</p>
                                            <p className="text-teal-500 font-bold text-3xl">₹{totalPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-wrap"> {/* Added flex-wrap for mobile */}
                                        <MenuButton onClick={() => setStep(0)} variant="secondary" ariaLabel="Go back to menu">Back to Menu</MenuButton>
                                        <MenuButton onClick={() => { if (validateCustomization()) setStep(2); }} ariaLabel="Proceed to address step">Next: Address</MenuButton>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <h3 className={`text-2xl font-bold`}>Delivery Address</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <AddressInput name='name' value={address.name} onChange={handleAddressChange} placeholder='Full Name' id='address-name' theme={theme} />
                                        <AddressInput name='phone' value={address.phone} onChange={handleAddressChange} placeholder='Phone Number' id='address-phone' theme={theme} />
                                        <div className="sm:col-span-2"><AddressInput name='street' value={address.street} onChange={handleAddressChange} placeholder='Street Address' id='address-street' theme={theme} /></div>
                                        <AddressInput name='city' value={address.city} onChange={handleAddressChange} placeholder='City' id='address-city' theme={theme} />
                                        <AddressInput name='pincode' value={address.pincode} onChange={handleAddressChange} placeholder='Pincode' id='address-pincode' theme={theme} />
                                    </div>
                                    <div className="flex justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-wrap"> {/* Added flex-wrap for mobile */}
                                        <MenuButton onClick={() => setStep(isDirectOrder || cartCheckout ? 0 : 1)} variant="secondary" ariaLabel="Go back to previous step">Back</MenuButton>
                                        <MenuButton onClick={() => { if (validateAddress()) setStep(3); }} ariaLabel="Proceed to confirm order">Next: Confirm Order</MenuButton>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <h3 className={`text-2xl font-bold`}>Confirm Your Order</h3>
                                    <div className={`p-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                        {cartCheckout ? (
                                            <div className="space-y-3">
                                                <h4 className={`text-lg font-semibold`}>Cart Items</h4>
                                                {cart.map((item, index) => (
                                                    <div key={index} className={`flex justify-between items-center text-sm flex-wrap`}> {/* Added flex-wrap */}
                                                        <span><strong>{item.pizzaName}</strong> ({item.size}, Qty: {item.quantity})</span>
                                                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-2 text-sm">
                                                <p><strong className='font-semibold'>Pizza:</strong> {selectedBase}, {selectedSauce}, {selectedCheese}, {selectedVeggies.join(', ') || 'No veggies'}</p>
                                                <p><strong className='font-semibold'>Size:</strong> {selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)}</p>
                                                <p><strong className='font-semibold'>Quantity:</strong> {quantity}</p>
                                            </div>
                                        )}
                                        <div className={`my-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}></div>
                                        <div className="space-y-2 text-sm">
                                             <h4 className={`text-lg font-semibold`}>Shipping To</h4>
                                            <p>{address.name}, {address.phone}</p>
                                            <p>{address.street}, {address.city}, {address.pincode}</p>
                                        </div>
                                         <div className="mt-4 pt-4 border-t flex justify-between items-center border-gray-200 dark:border-gray-700 flex-wrap gap-2"> {/* Added flex-wrap */}
                                            <p className={`text-lg font-bold`}>Total Amount</p>
                                            <p className="text-teal-500 font-bold text-2xl">₹{totalPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between gap-4 flex-wrap"> {/* Added flex-wrap for mobile */}
                                        <MenuButton onClick={() => setStep(2)} variant="secondary" ariaLabel="Go back to address step">Back</MenuButton>
                                        <MenuButton onClick={handlePayment} disabled={isLoading} ariaLabel="Proceed to payment">{isLoading ? 'Processing...' : 'Proceed to Pay'}</MenuButton>
                                    </div>
                                </div>
                            )}

                             {step === 6 && (
                                <div className="space-y-6">
                                    <h3 className={`text-2xl font-bold`}>Manage Your Address</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <AddressInput name='name' value={address.name} onChange={handleAddressChange} placeholder='Full Name' id='address-name' theme={theme} />
                                        <AddressInput name='phone' value={address.phone} onChange={handleAddressChange} placeholder='Phone Number' id='address-phone' theme={theme} />
                                        <div className="sm:col-span-2"><AddressInput name='street' value={address.street} onChange={handleAddressChange} placeholder='Street Address' id='address-street' theme={theme} /></div>
                                        <AddressInput name='city' value={address.city} onChange={handleAddressChange} placeholder='City' id='address-city' theme={theme} />
                                        <AddressInput name='pincode' value={address.pincode} onChange={handleAddressChange} placeholder='Pincode' id='address-pincode' theme={theme} />
                                    </div>
                                    <div className="flex justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-wrap"> {/* Added flex-wrap for mobile */}
                                        <MenuButton onClick={() => setStep(0)} variant="secondary" ariaLabel="Back to menu">Back</MenuButton>
                                        <MenuButton onClick={saveAddress} disabled={isLoading} ariaLabel="Save address">{isLoading ? 'Saving...' : 'Save Address'}</MenuButton>
                                    </div>
                                </div>
                            )}
                        </div>
        )}

        {/* My Orders (Step 4) */}
        {!isLoading && step === 4 && (
          <div className="space-y-6 animate-slide-up">
            <div className={`flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <h3 className={`text-2xl font-bold`}>My Orders</h3>
                {/* Search input for orders */}
                 <div className="relative w-full sm:w-auto"> {/* Added w-full for mobile */}
                    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.65-1.65z" /></svg>
                    <input type="text" placeholder="Search in orders..." value={orderSearchQuery} onChange={(e) => setOrderSearchQuery(e.target.value)} className={`w-full sm:w-64 pl-10 p-2 rounded-lg border-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 text-sm ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-200 text-gray-900 border-gray-300'}`} aria-label="Search past orders" />
                    {orderSearchQuery && ( // ✨ NEW: Clear order search button
                        <button onClick={handleClearOrderSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>
            </div>
            {filteredOrders.length === 0 ? (
              <div className={`text-center py-16 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{orderSearchQuery ? 'No orders match your search.' : 'You have no past orders.'}</p>
                  <MenuButton onClick={() => setStep(0)} ariaLabel="Go to menu">Go to Menu</MenuButton>
              </div>
            ) : (
              <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="overflow-x-auto"> {/* Ensures horizontal scroll for table on small screens */}
                      <table className="w-full text-left table-auto">
                          <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                              <tr className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                  <th className="p-4">Order ID</th><th className="p-4">Pizza</th><th className="p-4">Details</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {filteredOrders.map((order) => (
                                  <tr key={order.order_id} className={`text-sm`}>
                                      <td className="p-4 font-mono text-xs">{order.order_id}</td>
                                      <td className="p-4 font-semibold">{order.pizza_details.cartItems ? order.pizza_details.cartItems.map((item) => item.pizzaName).join(', ') : order.pizza_details.selectedBase || 'Custom Pizza'}</td>
                                      <td className="p-4">{order.pizza_details.size || order.pizza_details.cartItems?.[0]?.size || 'N/A'}, Qty: {order.pizza_details.quantity || order.pizza_details.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 1}</td>
                                      <td className="p-4 font-semibold">₹{order.totalPrice}</td>
                                      <td className="p-4">
                                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.status === 'Pending' || order.status === 'Preparing' ? (theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800') : order.status === 'Out for Delivery' ? (theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800') : (theme === 'dark' ? 'bg-teal-900 text-teal-300' : 'bg-teal-100 text-teal-800')}`}>{order.status}</span>
                                      </td>
                                      <td className="p-4 flex gap-2 flex-wrap"> {/* Added flex-wrap for buttons */}
                                        <MenuButton onClick={() => handleShowOrderDetails(order)} variant="ghost" className="text-xs !px-3 !py-1" ariaLabel={`View details for ${order.order_id}`}>View Details</MenuButton> {/* ✨ NEW: View Details Button */}
                                        <MenuButton onClick={() => handleReorder(order)} variant="ghost" className="text-xs !px-3 !py-1" ariaLabel={`Reorder ${order.order_id}`}>Reorder</MenuButton>
                                        {/* ✨ TRACK BUTTON */}
                                        {(order.status === 'Preparing' || order.status === 'Out for Delivery') && (
                                            <MenuButton
                                                onClick={() => handleTrackOrder(order)}
                                                variant="primary"
                                                className="text-xs !px-3 !py-1"
                                                ariaLabel={`Track ${order.order_id}`}
                                            >
                                                Track
                                            </MenuButton>
                                        )}
                                        {/* ✨ FEEDBACK BUTTON */}
                                        {order.status === 'Delivered' && !order.feedback && (
                                            <MenuButton
                                                onClick={() => handleShowFeedback(order)}
                                                variant="secondary"
                                                className="text-xs !px-3 !py-1"
                                                ariaLabel={`Feedback for ${order.order_id}`}
                                            >
                                                Give Feedback
                                            </MenuButton>
                                        )}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
            )}
            <MenuButton onClick={() => setStep(0)} variant="secondary" ariaLabel="Back to menu">Back to Menu</MenuButton>
          </div>
        )}

        {/* Cart (Step 7) */}
        {!isLoading && step === 7 && (
           <div className="space-y-6 animate-slide-up">
                            <h3 className={`text-2xl font-bold`}>Your Cart</h3>
                             {cart.length === 0 ? (
                                <div className={`text-center py-16 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                    <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Your cart is empty. Let's add some pizzas!</p>
                                    <MenuButton onClick={() => setStep(0)} ariaLabel="Go to menu">Go to Menu</MenuButton>
                                </div>
                            ) : (
                                <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="overflow-x-auto"> {/* Ensures horizontal scroll for table on small screens */}
                                        <table className="w-full text-left table-auto">
                                            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                                <tr className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    <th className="p-4">Product</th><th className="p-4">Size</th><th className="p-4">Quantity</th><th className="p-4">Price</th><th className="p-4">Total</th><th className="p-4"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {cart.map((item, index) => (
                                                    <tr key={index} className={`text-sm`}>
                                                        <td className="p-4 flex items-center gap-3">
                                                            <img src={item.image} alt={item.pizzaName} className="w-12 h-12 object-cover rounded-md" />
                                                            <span className="font-semibold">{item.pizzaName}</span>
                                                        </td>
                                                        <td className="p-4">{item.size.charAt(0).toUpperCase() + item.size.slice(1)}</td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <button onClick={() => handleUpdateQuantity(item.pizzaName, item.size, -1)} className={`w-7 h-7 flex items-center justify-center rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>-</button>
                                                                <span>{item.quantity}</span>
                                                                <button onClick={() => handleUpdateQuantity(item.pizzaName, item.size, 1)} className={`w-7 h-7 flex items-center justify-center rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>+</button>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">₹{item.price.toFixed(2)}</td>
                                                        <td className="p-4 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</td>
                                                        <td className="p-4"><MenuButton onClick={() => handleRemoveFromCart(item.pizzaName, item.size)} variant="danger" className="text-xs !px-3 !py-1" ariaLabel={`Remove ${item.pizzaName} from cart`}>Remove</MenuButton></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className={`p-4 flex justify-between items-center border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex-wrap gap-2`}> {/* Added flex-wrap */}
                                        <MenuButton onClick={handleClearCart} variant="danger" ariaLabel="Clear cart">Clear Cart</MenuButton>
                                        <div className="text-right">
                                            <p className={`text-lg font-bold`}>Subtotal: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Taxes and shipping calculated at checkout.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between gap-4 mt-6 flex-wrap"> {/* Added flex-wrap */}
                                <MenuButton onClick={() => setStep(0)} variant="secondary" ariaLabel="Back to menu">Continue Shopping</MenuButton>
                                {cart.length > 0 && <MenuButton onClick={() => { setCartCheckout(true); setStep(2); }} ariaLabel="Proceed to checkout">Proceed to Checkout</MenuButton>}
                            </div>
                        </div>
        )}
        
        {/* ✨ NEW: Live Tracking Screen (Step 8) */}
        {!isLoading && step === 8 && trackingOrder && (
            <div className="animate-fade-in">
                <LiveTracker order={trackingOrder} theme={theme} />
                <div className="text-center mt-6">
                    <MenuButton onClick={() => { setStep(4); fetchOrders(); }} variant="secondary" ariaLabel="Back to my orders">Back to My Orders</MenuButton>
                </div>
            </div>
        )}

      </div>

      {/* Popups and Modals */}
      {editMode && (
         <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in ${theme === 'dark' ? 'bg-gray-900/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
            <div ref={profileContainerRef} className={`w-full max-w-md p-6 rounded-2xl shadow-2xl relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <button onClick={() => setEditMode(false)} className={`absolute top-4 right-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`} aria-label="Close profile editor">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <ProfileCard name={userProfile.name} photo={userProfile.photo} email={localStorage.getItem('userEmail')} onUpdate={(updatedProfile) => { setUserProfile((prev) => ({ ...prev, name: updatedProfile.name, photo: updatedProfile.photo })); setEditMode(false); }} theme={theme} />
            </div>
        </div>
      )}
      {showAddToCartPopup && selectedPizza && <AddToCartPopup pizza={selectedPizza} onConfirm={handleAddToCart} onCancel={() => { setShowAddToCartPopup(false); setSelectedPizza(null); }} theme={theme} />}
      {showNutritionPopup && selectedPizza && <NutritionInfoPopup pizza={selectedPizza} onClose={() => { setShowNutritionPopup(false); setSelectedPizza(null); }} theme={theme} />}
      {/* ✨ NEW: Feedback Popup */}
      {showFeedbackPopup && feedbackOrder && (
        <FeedbackPopup
          order={feedbackOrder}
          onClose={() => { setShowFeedbackPopup(false); setFeedbackOrder(null); }}
          onSubmit={handleSubmitFeedback}
          theme={theme}
        />
      )}
      {/* ✨ NEW: Order Details Popup */}
      {showOrderDetailsPopup && selectedOrderDetails && (
        <OrderDetailsPopup
          order={selectedOrderDetails}
          onClose={() => { setShowOrderDetailsPopup(false); setSelectedOrderDetails(null); }}
          onCancelOrder={handleCancelOrder}
          theme={theme}
        />
      )}
    </main>
    
    <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-bounce { animation: bounce 1s infinite; }
    `}</style>
    </div>
  );
};

export default UserDashboard;