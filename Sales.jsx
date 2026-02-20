import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    product: "",
    quantity: "",
    price: "",
  });

  const addSale = () => {
    if (!form.product || !form.quantity || !form.price) return;

    const newSale = {
      id: Date.now(),
      product: form.product,
      quantity: Number(form.quantity),
      price: Number(form.price),
      total: Number(form.quantity) * Number(form.price),
    };

    setSales([...sales, newSale]);

    setForm({
      product: "",
      quantity: "",
      price: "",
    });
  };

  const deleteSale = (id) => {
    setSales(sales.filter((sale) => sale.id !== id));
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        💰 Sales Management
      </h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">Total Revenue</h2>
          <p className="text-2xl font-bold text-green-600">
            ₹ {totalRevenue}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">Total Orders</h2>
          <p className="text-2xl font-bold text-purple-700">
            {sales.length}
          </p>
        </div>
      </div>

      {/* Add Sale Form */}
      <div className="bg-purple-100 p-6 rounded-2xl shadow-inner mb-8 grid md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={form.product}
          onChange={(e) =>
            setForm({ ...form, product: e.target.value })
          }
          className="p-3 rounded-lg border border-purple-300"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
          className="p-3 rounded-lg border border-purple-300"
        />

        <input
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          className="p-3 rounded-lg border border-purple-300"
        />

        <button
          onClick={addSale}
          className="bg-purple-600 text-white px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-700 transition"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Sales List */}
      <div className="space-y-4">
        {sales.map((sale) => (
          <div
            key={sale.id}
            className="bg-white p-5 rounded-2xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-purple-700 font-semibold text-lg">
                {sale.product}
              </h3>
              <p className="text-gray-600">
                Qty: {sale.quantity} × ₹{sale.price}
              </p>
              <p className="text-green-600 font-bold">
                Total: ₹ {sale.total}
              </p>
            </div>

            <button
              onClick={() => deleteSale(sale.id)}
              className="bg-purple-400 text-white p-3 rounded-xl hover:bg-purple-500 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}