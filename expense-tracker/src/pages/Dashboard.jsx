import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Income</p>
          <p className="text-green-500 text-xl">$10,000</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Expense</p>
          <p className="text-red-500 text-xl">$7,500</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Recent Records</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>🍔 Food</span>
            <span className="text-red-500">-120</span>
          </li>
          <li className="flex justify-between">
            <span>💼 Salary</span>
            <span className="text-green-500">+3000</span>
          </li>
        </ul>
      </div>
    </Layout>
  );
}
