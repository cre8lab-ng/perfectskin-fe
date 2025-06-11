import { useState } from "react";
import { PiPhoneLight } from "react-icons/pi";
import { VscMail } from "react-icons/vsc";
import Image from "next/image";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FiSearch,FiHeart  } from "react-icons/fi";
import { RiUserLine } from "react-icons/ri";
import { IoBagHandleOutline } from "react-icons/io5";

const navItems = [
  "Skincare",
  "Makeup",
  "Fragrance",
  "Haircare & Nails",
  "Wellness & Supplements",
  "Lighting & Content Tools",
];

const megaMenus: Record<string, JSX.Element> = {
  Fragrance: (
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
  Skincare: (
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
};

export default function Header() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="w-full relative z-50">
      <div className="bg-darkpink text-white text-sm flex justify-between bh-container font-bold">
        <span>Enjoy a free gift with every order.</span>
        <span>Delivery: Lagos 1-3 days | Outside 2-5 days</span>

        <div className="flex gap-6 items-center">
          <a href="tel:0816259862" className="flex items-center gap-2">
            <PiPhoneLight size={20} />
            0816 259 8682
          </a>
          <span>|</span>
          <a
            href="mailto:support@beautyhub.ng"
            className="flex items-center gap-2"
          >
            <VscMail size={20} />
            support@beautyhub.ng
          </a>
        </div>
      </div>

      <div className="bg-lightpink flex justify-between items-center bh-container">
        <div>
          <Image
            src="/images/bh-logo.png"
            alt="BH Logo"
            width={100}
            height={100}
          />
        </div>

        <div className="hidden md:flex gap-6 text-pink-600 font-medium text-lg relative">
          {navItems.map((item) => (
            <div
              key={item}
              className="flex cursor-pointer"
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span className="text-base">{item}</span>
              <span className="ml-[0.5] mt-1">
                <MdOutlineKeyboardArrowDown />
              </span>
              {hoveredItem === item && megaMenus[item]}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 text-darkpink text-xl relative">
          <FiSearch className="cursor-pointer" />
          <RiUserLine className="cursor-pointer"/>

          <div className="relative">
          <FiHeart className="cursor-pointer"/>

            <span className="absolute -top-2 -right-2 text-xs bg-darkpink text-white w-5 h-5 rounded-full flex items-center justify-center">
              0
            </span>
          </div>
          <div className="relative">
          <IoBagHandleOutline className="cursor-pointer"/>

            <span className="absolute -top-2 -right-2 text-xs bg-darkpink text-white w-5 h-5 rounded-full flex items-center justify-center">
              1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
