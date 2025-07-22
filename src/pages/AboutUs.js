// src/pages/AboutUs.js
import React from 'react';

function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-red-100 text-gray-800 px-6 py-20 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-5xl font-extrabold text-red-600 drop-shadow-lg mb-10 text-center">
        🍕 Welcome to PizzaZone
      </h1>

      {/* Description Block */}
      <div className="max-w-5xl space-y-10 text-xl leading-relaxed text-center">
        <p>
          At <strong>PizzaZone</strong>, we serve happiness with every slice! From oven to doorstep, our pizzas are made
          with fresh ingredients, handcrafted dough, and our secret sauce that keeps customers coming back for more.
        </p>

        <p>
          Whether you're a fan of cheesy Margherita, fiery Spicy Paneer, or a fully loaded Veggie Delight —
          we’ve got you covered. Our chefs blend taste and creativity to give you the ultimate pizza experience.
        </p>

        <p>
          We’re not just a pizza delivery service — we’re a community of pizza lovers! Fast delivery, friendly service, and
          flavors that excite your taste buds — that’s the <strong>PizzaZone</strong> promise. 🧀❤️
        </p>

        <p>
          So whether it's a party, movie night, or late-night hunger — we are just a click away.
          Thank you for choosing <span className="font-semibold text-red-500">PizzaZone</span> — Where Every Slice is Love!
        </p>
      </div>

      {/* Bottom Emoji Strip (Optional) */}
      <div className="mt-16 text-4xl">
        🍕❤️🧀🔥🚀
      </div>
    </div>
  );
}

export default AboutUs;
