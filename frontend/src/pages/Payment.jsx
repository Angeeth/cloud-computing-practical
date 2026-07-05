import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, CreditCard, Banknote, Smartphone, CheckCircle, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

function Payment() {
  const navigate = useNavigate();
  const { cart, placeOrder } = useContext(AppContext);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");

  // Flow control states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !address) {
      toast.error("Please fill in all shipping details");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment gateway response delay
    setTimeout(async () => {
      const orderData = {
        name,
        email,
        phone,
        address,
        paymentMethod,
      };

      const result = await placeOrder(orderData);
      setIsProcessing(false);

      if (result.success) {
        setCreatedOrder(result.order);
        setIsSuccess(true);
      } else {
        toast.error("Payment failed. Please try again.");
      }
    }, 2000);
  };

  // If order was successfully submitted, show success screen
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-[15px]" />
          <CheckCircle className="text-emerald-400 relative z-10 animate-bounce" size={72} />
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-md">
          Thank you for your purchase. Your payment was processed securely and your order details have been saved.
        </p>

        {/* Invoice breakdown card */}
        {createdOrder && (
          <div className="w-full mt-10 bg-[#111625] rounded-3xl p-6 border border-slate-800/80 text-left space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recipient Details</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck size={12} /> Paid via {createdOrder.paymentMethod}
              </span>
            </div>
            
            <div className="text-sm font-medium space-y-1.5 text-slate-300">
              <p><strong className="text-slate-400 font-normal">Name:</strong> {createdOrder.name}</p>
              <p><strong className="text-slate-400 font-normal">Email:</strong> {createdOrder.email}</p>
              <p><strong className="text-slate-400 font-normal">Phone:</strong> {createdOrder.phone}</p>
              <p><strong className="text-slate-400 font-normal">Shipping to:</strong> {createdOrder.address}</p>
            </div>

            <div className="border-t border-slate-800 pt-4 mt-2">
              <div className="flex justify-between items-center text-base font-extrabold">
                <span className="text-white">Total Amount</span>
                <span className="text-violet-400">₹{createdOrder.totalAmount?.toLocaleString() || total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex gap-4">
          <Link
            to="/"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-violet-500/10 transition duration-300 cursor-pointer text-sm"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // If no items in cart, block checkout
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-white mb-2">No Items for Checkout</h2>
        <p className="text-slate-400 text-sm mb-6">You need to add products to the cart first.</p>
        <Link to="/" className="text-violet-400 hover:text-violet-300 font-bold transition flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Go back shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
      
      {/* Back button & Title */}
      <div className="mb-10 flex flex-col gap-2">
        <Link to="/cart" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition duration-200 w-fit cursor-pointer">
          <ArrowLeft size={14} />
          <span>Back to Cart</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2">
          Secure Checkout
        </h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start relative">
        
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 bg-[#111625] rounded-3xl p-6 sm:p-8 border border-slate-800/60 space-y-6">
          
          <h2 className="text-lg font-bold text-white mb-2 tracking-tight">
            Shipping Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-900/60 text-slate-100 placeholder-slate-500 border border-slate-800/80 focus:border-violet-500/60 outline-none transition duration-300 text-sm"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="johndoe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 rounded-xl bg-slate-900/60 text-slate-100 placeholder-slate-500 border border-slate-800/80 focus:border-violet-500/60 outline-none transition duration-300 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-4 rounded-xl bg-slate-900/60 text-slate-100 placeholder-slate-500 border border-slate-800/80 focus:border-violet-500/60 outline-none transition duration-300 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Shipping Address</label>
              <textarea
                rows="3"
                placeholder="Enter your complete house number, street, city, state, pincode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-900/60 text-slate-100 placeholder-slate-500 border border-slate-800/80 focus:border-violet-500/60 outline-none transition duration-300 text-sm resize-none"
                required
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-4 border-t border-slate-800/80">
            <h2 className="text-lg font-bold text-white mb-4 tracking-tight">
              Payment Method
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {/* Card option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("Card")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                  paymentMethod === "Card"
                    ? "bg-violet-600/10 border-violet-500 text-white"
                    : "bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <CreditCard size={20} />
                <span className="text-xs font-semibold">Credit/Debit</span>
              </button>

              {/* UPI option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("UPI")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                  paymentMethod === "UPI"
                    ? "bg-violet-600/10 border-violet-500 text-white"
                    : "bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Smartphone size={20} />
                <span className="text-xs font-semibold">UPI/Wallet</span>
              </button>

              {/* COD option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                  paymentMethod === "COD"
                    ? "bg-violet-600/10 border-violet-500 text-white"
                    : "bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Banknote size={20} />
                <span className="text-xs font-semibold">Cash (COD)</span>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold py-4.5 rounded-xl flex justify-center items-center gap-2.5 transition duration-300 shadow-lg shadow-violet-600/10 disabled:shadow-none cursor-pointer text-base"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Pay & Place Order</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Order Items Summary panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111625] rounded-3xl p-6 border border-slate-800/60">
            <h2 className="text-base font-bold text-white mb-5 tracking-tight flex items-center justify-between">
              <span>Items Summary</span>
              <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </h2>

            {/* List mini products */}
            <div className="max-h-60 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-slate-800" />
                    <div>
                      <h4 className="text-sm text-white font-bold leading-none truncate max-w-[130px]">{item.name}</h4>
                      <span className="text-slate-400 text-xs mt-1 block">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-200">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800/60 mt-6 pt-5 space-y-3.5 text-sm font-medium">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-emerald-400 font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-base font-extrabold border-t border-slate-800/60 pt-4 mt-1">
                <span className="text-white">Grand Total</span>
                <span className="text-violet-400">₹{total.toLocaleString()}</span>
              </div>
            </div>

          </div>

          <div className="bg-[#111625] rounded-3xl p-5 border border-slate-800/60 flex items-start gap-3.5">
            <div className="text-violet-400 p-2 rounded-xl bg-violet-600/10 border border-violet-500/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Secure Checkouts Only</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Your data is protected using AES 256-bit encryption. Transactions are certified by PCI-DSS security standards.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Payment;