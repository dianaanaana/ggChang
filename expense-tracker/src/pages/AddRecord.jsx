import Layout from "../components/Layout";

export default function AddRecord() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Add Record</h2>

      <div className="bg-white p-4 rounded shadow max-w-md">
        <select className="w-full border px-3 py-2 mb-3 rounded">
          <option>Expense</option>
          <option>Income</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          className="w-full border px-3 py-2 mb-3 rounded"
        />

        <input
          type="text"
          placeholder="Category"
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Save
        </button>
      </div>
    </Layout>
  );
}
