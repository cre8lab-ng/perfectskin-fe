import Image from "next/image";
import { PiPhoneLight } from "react-icons/pi";
import { VscMail } from "react-icons/vsc";
import { IoMdPin } from "react-icons/io";
import { GoClock } from "react-icons/go";
import { FaTiktok,FaInstagram,FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-white bh-container">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start mt-10">
        <div className="flex flex-col items-start">
          <Image
            src="/images/bh-logo.png"
            alt="BH Logo"
            width={200}
            height={200}
          />
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Returns & Refunds</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Get Help</h4>
          <ul className="space-y-2">
            <li>Tracking Order</li>
            <li>FAQs</li>
            <li>My Account</li>
            <li>My Wishlist</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
            <PiPhoneLight size="20" /> support@beautyhub.ng
            </li>
            <li className="flex items-center gap-2">
            <VscMail size={20} />
            0816 259 8682
            </li>
            <li className="flex items-center gap-2">
            <IoMdPin  size={20}/>
 41a Industrial Avenue, Sabo Yaba.
            </li>
            <li className="flex items-center gap-2">
            <GoClock size={20}/>
            Mon - Sat / 9:00 AM - 5:00 PM
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h4 className="mb-2 text-sm font-medium">
          Subscribe To Our Newsletter!
        </h4>
        <div className="flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-l"
          />
          <button className="bg-black text-white px-6 py-2 rounded-r">
            Send
          </button>
        </div>
      </div>

      <div className="mt-12 flex flex-col md:flex-row items-center justify-between text-sm ">
        <p className="text-center md:text-left mt-4 md:mt-0">
          COPYRIGHT © 2025 CRE8LAB
        </p>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <FaTiktok size={20} />
          <FaXTwitter size={20} />
          <FaInstagram size={20} />
          <FaWhatsapp size={20} />
        </div>
       
      </div>
    </footer>
  );
}
