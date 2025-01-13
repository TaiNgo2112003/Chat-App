import React, { useState } from 'react';

const DiscoveryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', description: 'Description for Item 1' },
    { id: 2, name: 'Item 2', description: 'Description for Item 2' },
    { id: 3, name: 'Item 3', description: 'Description for Item 3' },
    { id: 4, name: 'Item 4', description: 'Description for Item 4' },
  ]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Discovery Page</h1>
      <div className="mb-4">
        <input
          type="text"
          className="input input-bordered w-full sm:w-1/2"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-500 text-center">No items found.</p>
        )}
      </div>
    </div>
  );
};

export default DiscoveryPage;
