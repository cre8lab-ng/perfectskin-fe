// components/Header.tsx
'use client';

import { useState } from 'react';
// import { FaPhone, FaUser } from 'react-icons/fa';
// import { FiSearch } from 'react-icons/fi';
// import { HiOutlineHeart, HiOutlineShoppingBag } from 'react-icons/hi';
// import { MdEmail } from 'react-icons/md';

const navItems = [
  'Skincare',
  'Makeup',
  'Fragrance',
  'Haircare & Nails',
  'Wellness & Supplements',
  'Lighting & Content Tools',
];

const megaMenus: Record<string, JSX.Element> = {
  'Fragrance': (
    <div className="absolute top-full left-0 mt-2 w-[800px] bg-white shadow-lg p-6 grid grid-cols-3 gap-6 text-black z-50">
      <div>
        <h4 className="font-semibold mb-2">Shop By Product Use</h4>
        <ul className="space-y-1 text-sm">
          <li>Men Fragrance</li>
          <li>Women Fragrance</li>
          <li>Home Fragrance</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Shop By Product Type</h4>
        <ul className="space-y-1 text-sm">
          <li>Eau De Toilette</li>
          <li>Eau De Parfum</li>
          <li>Candles & Incense</li>
          <li>Body & Hair Mist</li>
          <li>Room Sprays</li>
          <li>Diffusers</li>
          <li>Linen Spray</li>
          <li>Perfume Sets</li>
          <li>Roll On</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Shop By Brand</h4>
        <ul className="space-y-1 text-sm">
          <li>Armaf</li>
          <li>Lattafa</li>
          <li>Tom Ford</li>
          <li>Lancome</li>
          <li>Zara</li>
          <li>Forvr Mood</li>
          <li>Mancera</li>
          <li>Jo Malone</li>
          <li>Paris Corner</li>
          <li>Air Wick</li>
          <li>Hugo Boss</li>
          <li>Armani</li>
          <li>Afnan</li>
          <li>Bvlgari</li>
          <li>Calvin Klein</li>
          <li>Kayali</li>
        </ul>
      </div>
    </div>
  ),
  'Skincare': (
    <div className="absolute top-full left-0 mt-2 w-[600px] bg-white shadow-lg p-6 grid grid-cols-2 gap-6 text-black z-50">
      <div>
        <h4 className="font-semibold mb-2">By Skin Type</h4>
        <ul className="space-y-1 text-sm">
          <li>Dry Skin</li>
          <li>Oily Skin</li>
          <li>Combination Skin</li>
          <li>Sensitive Skin</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">By Product</h4>
        <ul className="space-y-1 text-sm">
          <li>Cleansers</li>
          <li>Moisturizers</li>
          <li>Serums</li>
          <li>SPF</li>
        </ul>
      </div>
    </div>
  ),
  // Add others like Makeup, Haircare & Nails, etc.
};

export default function Header() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="w-full relative z-50">
      <div className="bg-pink-500 text-white text-sm flex justify-between px-4 py-2">
        <span>Enjoy a free gift with every order.</span>
        <div className="flex gap-6 items-center">
          <span>Delivery: Lagos 1-3 days | Outside 2-5 days</span>
          <div className="flex items-center gap-1">
            {/* <FaPhone /> */}
            <span>0816 259 8682</span>
          </div>
          <div className="flex items-center gap-1">
            {/* <MdEmail /> */}
            <span>support@beautyhub.ng</span>
          </div>
        </div>
      </div>

      <div className="bg-pink-100 flex justify-between items-center px-4 py-4 relative">
        <div className="flex items-center text-pink-600 font-bold text-3xl">
          <span className="text-5xl font-extrabold">B</span>
          <div className="flex flex-col ml-1 leading-tight">
            <span className="text-xl">eauty</span>
            <span className="text-xl -mt-1">Hub</span>
          </div>
        </div>

        <div className="hidden md:flex gap-6 text-pink-600 font-medium text-lg relative">
          {navItems.map((item) => (
            <div
              key={item}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span>{item}</span>
              <span className="ml-1">&#x25BE;</span>
              {hoveredItem === item && megaMenus[item]}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 text-pink-600 text-xl relative">
          {/* <FiSearch className="cursor-pointer" />
          <FaUser className="cursor-pointer" /> */}
          <div className="relative">
            {/* <HiOutlineHeart className="cursor-pointer" /> */}
            <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
              0
            </span>
          </div>
          <div className="relative">
            {/* <HiOutlineShoppingBag className="cursor-pointer" /> */}
            <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
              1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
