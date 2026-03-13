import { useState } from "react";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  Star,
  Image as ImageIcon,
  Check,
  Plus,
  Tag,
  Package,
} from "lucide-react";

export default function ProductCard({ product }) {
  const { addItem, isInCart } = useCart();

  const [imgError, setImgError] = useState(false);
  const inCart = isInCart(product.id);

  const handleAdd = () => {
    addItem(product);
    toast.success(`"${product.title.slice(0, 30)}…" added to cart`, {
      icon: <ShoppingCart className="w-4 h-4" />,
      style: {
        background: "linear-gradient(to right, #4f46e5, #9333ea)",
        color: "#fff",
      },
    });
  };

  const discountedPrice =
    product.price * (1 - (product.discountPercentage || 0) / 100);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 animate-fade-in">
      
      <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        {!imgError ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-slate-300 dark:text-slate-700" />
          </div>
        )}


        {product.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold shadow-lg">
            <Tag className="w-3 h-3" />-{Math.round(product.discountPercentage)}
            %
          </span>
        )}


        {inCart && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg">
            <Check className="w-3 h-3" />
            In cart
          </span>
        )}
      </div>


      <div className="flex flex-col flex-1 p-5 gap-3">

        <div className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {product.category}
          </span>
        </div>


        <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.title}
        </h3>


        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-display text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ₹{discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="ml-2 text-xs text-slate-400 line-through">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              inCart
                ? "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 text-indigo-700 dark:text-indigo-300 hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-900/70 dark:hover:to-purple-900/70 border border-indigo-200 dark:border-indigo-800"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl"
            }`}
          >
            {inCart ? (
              <>
                <Plus className="w-3.5 h-3.5" />
                Add more
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
