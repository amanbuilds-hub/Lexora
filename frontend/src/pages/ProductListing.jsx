import React from 'react';
import { ShoppingBag, Star, Heart } from 'lucide-react';

const ProductListing = () => {
  const products = [
    { id: 1, name: "Hand-Carved Teak Chair", category: "Carpentry", price: "₹4,500", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=500" },
    { id: 2, name: "Indigo Blue Pottery Vase", category: "Pottery", price: "₹1,200", img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=500" },
    { id: 3, name: "Pure Cotton Handloom Saree", category: "Textile", price: "₹2,800", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=500" },
    { id: 4, name: "Eco-Friendly Bamboo Lamp", category: "Carpentry", price: "₹900", img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=500" }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-black text-lexora-justice mb-6">Handcrafted with Hope.</h2>
            <p className="text-xl text-slate-500 leading-relaxed">
              Every product you purchase directly supports the rehabilitation and family welfare of undertrial prisoners. 
              Quality goods, created with dignity and care.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
            <div className="bg-lexora-gold/20 p-3 rounded-2xl text-lexora-gold">
              <Star fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-black text-lexora-justice">4.9/5 Average Rating</p>
              <p className="text-xs text-slate-400 font-bold uppercase">From 2,000+ Customers</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 right-6">
                  <button className="bg-white/80 backdrop-blur-md p-3 rounded-2xl text-slate-400 hover:text-red-500 transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-lexora-justice/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <button className="w-full bg-white text-lexora-justice py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl">
                    <ShoppingBag size={20} />
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="px-4">
                <p className="text-xs font-black text-lexora-gold uppercase tracking-widest mb-2">{product.category}</p>
                <h3 className="text-xl font-bold text-lexora-justice mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                <p className="text-2xl font-black text-slate-800">{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Story */}
        <div className="mt-32 bg-lexora-justice rounded-[4rem] p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lexora-gold/10 rounded-full blur-[100px]"></div>
          <div className="max-w-3xl relative z-10">
            <h3 className="text-4xl font-black mb-8 italic">"Building a new life, one chair at a time."</h3>
            <p className="text-blue-200 text-xl leading-relaxed mb-10">
              Our e-commerce platform anonymizes prisoner IDs to protect their future, while ensuring 100% of the earnings 
              are audited via our blockchain ledger. Your purchase helps bridge the gap between incarceration and reintegration.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-lexora-justice bg-slate-700 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="font-bold text-blue-200">+1.2k Other contributors this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
