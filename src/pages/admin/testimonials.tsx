// src/pages/admin/testimonials.tsx

import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import useSWR from 'swr';

interface Testimonial {
  id: string;
  name: string;
  type: 'texto' | 'foto' | 'video';
  content: string;
  createdAt: string;
  updatedAt: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Erro ao buscar dados.');
  }
  return res.json();
};

export default function Testimonials() {
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: '', type: 'texto', content: '' });
  const [file, setFile] = useState<File | null>(null);

  const { data: testimonials, error, mutate } = useSWR('/api/crud/testimonials', fetcher);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        type: editing.type as 'texto' | 'foto' | 'video',
        content: editing.content,
      });
    } else {
      setForm({ name: '', type: 'texto', content: '' });
    }
  }, [editing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'secreto'); // Substitua 'secreto' pelo seu 'upload_preset' do Cloudinary

    // Substitua 'seu_cloud_name' pelo seu nome de conta do Cloudinary
    const res = await fetch('https://api.cloudinary.com/v1_1/seu_cloud_name/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Falha ao fazer upload do arquivo para o Cloudinary.');
    }

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalContent = form.content;
    if (file && (form.type === 'foto' || form.type === 'video')) {
      try {
        finalContent = await uploadFile(file);
      } catch (uploadError) {
        alert('Erro ao fazer upload do arquivo.');
        console.error(uploadError);
        return;
      }
    }

    const url = '/api/crud/testimonials';
    const method = 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, content: finalContent, id: editing?.id }),
    });

    if (res.ok) {
      mutate();
      setEditing(null);
      setForm({ name: '', type: 'texto', content: '' });
      setFile(null);
    } else {
      alert('Erro ao salvar depoimento.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este depoimento?')) {
      const res = await fetch(`/api/crud/testimonials?id=${id}`, { method: 'DELETE' });

      if (res.ok) {
        mutate();
      } else {
        alert('Erro ao excluir depoimento.');
      }
    }
  };

  if (error) return <AdminLayout>Falha ao carregar depoimentos.</AdminLayout>;
  if (!testimonials) return <AdminLayout>Carregando...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Gerenciar Depoimentos</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editing ? 'Editar Depoimento' : 'Adicionar Novo Depoimento'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Cliente</label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Depoimento</label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as 'texto' | 'foto' | 'video' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="texto">Texto</option>
                <option value="foto">Foto</option>
                <option value="video">Vídeo</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                {form.type === 'texto' ? 'Conteúdo do Depoimento' : 'Arquivo'}
              </label>
              {form.type === 'texto' ? (
                <textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                ></textarea>
              ) : (
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                  required={!editing} // Arquivo é obrigatório na criação
                />
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                {editing ? 'Salvar Alterações' : 'Adicionar Depoimento'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="bg-gray-400 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Depoimentos Existentes</h2>
          <ul className="space-y-4">
            {testimonials.map((testimonial: Testimonial) => (
              <li key={testimonial.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm italic">{testimonial.type}</p>
                    {testimonial.type === 'texto' ? (
                      <p className="mt-2">{testimonial.content}</p>
                    ) : (
                      <a href={testimonial.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Visualizar {testimonial.type}
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditing(testimonial)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}