import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    customer: "",
    product: "",
    quantity: "",
    status: "Pending",
  });

  const addOrder = () => {
    if (!form.customer || !form.product || !form.quantity) return;

    setOrders([
      ...orders,
      { ...form, id: Date.now(), quantity: Number(form.quantity) },
    ]);

    setForm({
      customer: "",
      product: "",
      quantity: "",
      status: "Pending",
    });
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const toggleStatus = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? {
              ...order,
              status:
                order.status === "Pending" ? "Completed" : "Pending",
            }
          : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        🛒 Orders Management
      </h1>

      {/* Add Order Form */}
      <div className="bg-purple-100 p-6 rounded-2xl shadow-inner mb-8 grid md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Customer Name"
          value={form.customer}
          onChange={(e) =>
            setForm({ ...form, customer: e.target.value })
          }
          className="p-3 rounded-lg border border-purple-300"
        />

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

        <button
          onClick={addOrder}
          className="bg-purple-600 text-white px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-700 transition"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-5 rounded-2xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-purple-700 font-semibold text-lg">
                {order.customer}
              </h3>
              <p className="text-gray-600">
                {order.product} — Qty: {order.quantity}
              </p>
              <p
                className={`mt-1 font-semibold ${
                  order.status === "Pending"
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {order.status}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => toggleStatus(order.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
              >
                Toggle
              </button>

              <button
                onClick={() => deleteOrder(order.id)}
                className="bg-purple-400 text-white p-3 rounded-xl hover:bg-purple-500 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}