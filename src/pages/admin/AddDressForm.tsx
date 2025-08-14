import { useState, FormEvent } from 'react';

export default function AddDressForm() {
  const [img, setImg] = useState('');
  const [productMark, setProductMark] = useState('');
  const [productModel, setProductModel] = useState('');
  const [cor, setCor] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('Enviando...');

    const response = await fetch('/api/dresses/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ img, productMark, productModel, cor }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Vestido adicionado com sucesso!');
      setImg('');
      setProductMark('');
      setProductModel('');
      setCor('');
    } else {
      setMessage(`Erro: ${data.message}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Adicionar Novo Vestido</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="img" className="block text-sm font-medium text-gray-700">URL da Imagem</label>
          <input
            type="text"
            id="img"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="productMark" className="block text-sm font-medium text-gray-700">Marca/Material</label>
          <input
            type="text"
            id="productMark"
            value={productMark}
            onChange={(e) => setProductMark(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="productModel" className="block text-sm font-medium text-gray-700">Modelo</label>
          <input
            type="text"
            id="productModel"
            value={productModel}
            onChange={(e) => setProductModel(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="cor" className="block text-sm font-medium text-gray-700">Cor (Nome da Coleção)</label>
          <input
            type="text"
            id="cor"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Adicionar Vestido
          </button>
        </div>
      </form>
      {message && <p className="mt-4 text-center text-sm font-medium">{message}</p>}
    </div>
  );
}