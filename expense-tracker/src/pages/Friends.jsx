import Layout from "../components/Layout";

export default function Friends() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Friends</h2>

      <div className="bg-white p-4 rounded shadow max-w-md mb-4">
        <input
          type="text"
          placeholder="Friend Email"
          className="w-full border px-3 py-2 mb-2 rounded"
        />
        <button className="w-full bg-green-500 text-white py-2 rounded">
          Add Friend
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow max-w-md">
        <h3 className="font-bold mb-2">Friend List</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>Alice</span>
            <span>$-1,200</span>
          </li>
          <li className="flex justify-between">
            <span>Bob</span>
            <span>$+3,000</span>
          </li>
        </ul>
      </div>
    </Layout>
  );
}
