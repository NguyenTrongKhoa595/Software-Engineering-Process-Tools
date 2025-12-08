import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PaymentPage() {
  const [fullName, setFullName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [ccv, setCcv] = useState('');
  const [expDate, setExpDate] = useState(''); // YYYY-MM from <input type="month">
  const [message, setMessage] = useState(null); // { type: 'error'|'success', text }
  const router = useRouter();
  const [priceFromQuery, setPriceFromQuery] = useState(null);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [billId, setBillId] = useState('PROP-2023-0567');

  // Compute min for month picker (current month)
  function getMinMonth() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  useEffect(() => {
    // Read from sessionStorage instead of query params
    const storedData = sessionStorage.getItem('paymentData');
    if (storedData) {
      try {
        const { price, id, title } = JSON.parse(storedData);
        if (price) {
          const n = Number(String(price).replace(/[^0-9.-]+/g, ''));
          if (!Number.isNaN(n)) setPriceFromQuery(n);
        }
        if (id) setBillId(String(id));
        if (title) setPropertyTitle(String(title));
        // Clear the data after reading (optional, for security)
        // sessionStorage.removeItem('paymentData');
      } catch (e) {
        console.error('Error reading payment data:', e);
      }
    }

    // Replace feather icons after mount
    try {
      if (typeof window !== 'undefined' && window.feather && typeof window.feather.replace === 'function') {
        window.feather.replace();
      }
    } catch (e) {
      // ignore
    }
    const t = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.feather && typeof window.feather.replace === 'function') {
          window.feather.replace();
        }
      } catch (e) { }
    }, 200);
    return () => clearTimeout(t);
  }, []);

  // Format card number as user types (4-4-4-4)
  function onCardNumberChange(e) {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    if (v.length > 19) v = v.substring(0, 19);
    setCardNumber(v);
  }

  function showMessage(type, text) {
    setMessage({ type, text });
    if (type === 'success') {
      setTimeout(() => setMessage(null), 4000);
    }
  }

  function clearMessage() {
    setMessage(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    clearMessage();

    // simple presence validation
    if (!fullName.trim() || !cardNumber.trim() || !ccv.trim() || !expDate.trim()) {
      showMessage('error', 'Please fill in all fields');
      return;
    }

    const formattedCardNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(formattedCardNumber)) {
      showMessage('error', 'Please enter a valid 16-digit card number');
      return;
    }

    if (!/^\d{3}$/.test(ccv)) {
      showMessage('error', 'Please enter a valid 3-digit CCV');
      return;
    }

    // expDate may be YYYY-MM from type=month
    let expYear, expMonth;
    if (/^\d{4}-\d{2}$/.test(expDate)) {
      const parts = expDate.split('-');
      expYear = parseInt(parts[0], 10);
      expMonth = parseInt(parts[1], 10);
    } else {
      const m = expDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
      if (m) {
        expMonth = parseInt(m[1], 10);
        expYear = 2000 + parseInt(m[2], 10);
      } else {
        showMessage('error', 'Please enter a valid expiration date (use the picker or MM/YY)');
        return;
      }
    }

    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth() + 1;
    if (expYear < nowYear || (expYear === nowYear && expMonth < nowMonth)) {
      showMessage('error', 'The card is expired. Please use a valid expiration date.');
      return;
    }

    // All good
    showMessage('success', 'Payment processed successfully!');
    sessionStorage.removeItem('paymentData');
  }

  return (
    <>
      <Head>
        <title>PropertyPay - Secure Payment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
        <script src="https://unpkg.com/feather-icons"></script>
      </Head>

      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Payment Form Column */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Make Payment</h2>
                <p className="text-gray-600 mb-6">Please enter complete information for payment to be made</p>

                {/* Inline message */}
                {message && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className={`text-sm p-3 rounded mb-4 ${message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-green-50 border border-green-200 text-green-800'}`}>
                    {message.text}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <i data-feather="user" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <input id="fullname" name="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Doe" required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cardnumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <div className="relative">
                      <i data-feather="credit-card" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <input id="cardnumber" name="cardnumber" value={cardNumber} onChange={onCardNumberChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1234 5678 9012 3456" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ccv" className="block text-sm font-medium text-gray-700 mb-1">CCV</label>
                      <div className="relative">
                        <i data-feather="lock" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input id="ccv" name="ccv" value={ccv} onChange={(e) => setCcv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="123" required />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="expdate" className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                      <div className="relative">
                        <i data-feather="calendar" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input id="expdate" name="expdate" type="month" value={expDate} min={getMinMonth()} onChange={(e) => setExpDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center mt-8">
                    <i data-feather="check-circle" className="w-5 h-5 mr-2"></i>
                    Complete Payment
                  </button>
                </form>
              </div>
            </div>

            { }
            <div className="lg:w-1/2">
              <div className="bg-gray-100 rounded-xl shadow-lg p-8 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bill Number</span>
                    <span className="font-medium">{billId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property</span>
                    <span className="font-medium">{propertyTitle || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Price</span>
                    <span className="font-medium">{priceFromQuery ? `$${priceFromQuery.toLocaleString()}` : '$1,250,000'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-medium">$250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (20%)</span>
                    <span className="font-medium">{priceFromQuery ? `$${Math.round(priceFromQuery * 0.2).toLocaleString()}` : '$250,000'}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">{priceFromQuery ? `$${(priceFromQuery + 250 + Math.round(priceFromQuery * 0.2)).toLocaleString()}` : '$1,500,250'}</span>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <i data-feather="shield" className="text-blue-500 w-5 h-5 mt-1 mr-3"></i>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Secure Payment Guarantee</p>
                      <p className="text-xs text-blue-600 mt-1">Your payment information is encrypted and processed securely.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
