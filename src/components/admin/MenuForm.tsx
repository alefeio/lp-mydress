// src/components/admin/MenuForm.tsx

import { useState, useEffect, FormEvent } from 'react';

interface Link {
  text: string;
  url: string;
}

export default function MenuForm() {
  const [logoUrl, setLogoUrl] = useState('');
  const [links, setLinks] = useState<Link[]>([{ text: '', url: '' }]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para buscar os dados do menu existente
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/crud/menu');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setLogoUrl(data.logoUrl);
            setLinks(data.links);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar menu:', error);
      }
    };
    fetchMenu();
  }, []);

  const handleLinkChange = (index: number, field: keyof Link, value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleAddLink = () => {
    setLinks([...links, { text: '', url: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Salvando...');

    try {
      const response = await fetch('/api/crud/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl, links }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao salvar menu.');
      }

      setMessage('Menu salvo com sucesso!');
    } catch (error: any) {
      console.error(error);
      setMessage(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Gerenciar Menu</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
            URL da Logomarca
          </label>
          <input
            type="text"
            id="logoUrl"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700">Links do Menu</h3>
          {links.map((link, index) => (
            <div key={index} className="flex space-x-2 mt-2">
              <input
                type="text"
                placeholder="Texto do Link"
                value={link.text}
                onChange={(e) => handleLinkChange(index, 'text', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
              <input
                type="text"
                placeholder="URL do Link"
                value={link.url}
                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
              <button
                type="button"
                onClick={() => handleRemoveLink(index)}
                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddLink}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            + Adicionar Link
          </button>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Menu'}
          </button>
        </div>
      </form>
      {message && <p className="mt-4 text-center text-sm font-medium">{message}</p>}
    </div>
  );
}