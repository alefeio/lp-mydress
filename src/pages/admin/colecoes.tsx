// src/pages/admin/colecoes.tsx

import { useState, useEffect } from "react";
import Head from "next/head";
import { MdAddPhotoAlternate, MdDelete } from 'react-icons/md';
import AdminLayout from "components/admin/AdminLayout";

// Definições de tipo
interface ColecaoItem {
  id?: string;
  productMark: string;
  productModel: string;
  cor: string;
  img: string | File;
  slug?: string; // Adicionado, mas será gerado no backend
}

interface Colecao {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  bgcolor: string | null;
  buttonText: string | null;
  buttonUrl: string | null; // Adicionado
  items: ColecaoItem[];
}

interface FormState {
  title: string;
  subtitle: string;
  description: string;
  bgcolor: string;
  buttonText: string;
  buttonUrl: string; // Adicionado
  items: ColecaoItem[];
}

export default function AdminColecoes() {
  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [form, setForm] = useState<FormState>({
    title: "",
    subtitle: "",
    description: "",
    bgcolor: "",
    buttonText: "",
    buttonUrl: "", // Adicionado
    items: [{ productMark: "", productModel: "", cor: "", img: "" }],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchColecoes();
  }, []);

  const fetchColecoes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crud/colecoes", { method: "GET" });
      const data = await res.json();
      if (res.ok && data.success) {
        setColecoes(data.colecoes);
      } else {
        setError(data.message || "Erro ao carregar coleções.");
      }
    } catch (e) {
      setError("Erro ao conectar com a API.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, files } = e.target;
    const newItems = [...form.items];
  
    if (name === "img" && files) {
      newItems[index] = { ...newItems[index], [name]: files[0] };
    } else {
      newItems[index] = { ...newItems[index], [name]: value };
    }
  
    setForm({ ...form, items: newItems });
  };
  

  const handleAddItem = () => {
    setForm({
      ...form,
      items: [...form.items, { productMark: "", productModel: "", cor: "", img: "" }],
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const itemsWithUrls = await Promise.all(
        form.items.map(async (item) => {
          if (item.img instanceof File) {
            const formData = new FormData();
            formData.append("file", item.img);
            // Substitua 'mydress_upload' pelo seu upload preset do Cloudinary
            formData.append("upload_preset", "mydress_upload"); 
  
            // Substitua 'mydress-cloud' pelo seu cloud name do Cloudinary
            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/mydress-cloud/image/upload`, {
              method: "POST",
              body: formData,
            });
  
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) {
              throw new Error(uploadData.error.message || "Erro no upload da imagem");
            }
            return { ...item, img: uploadData.secure_url };
          }
          return item;
        })
      );
  
      const res = await fetch("/api/crud/colecoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: itemsWithUrls }),
      });
  
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Coleção criada com sucesso!");
        setForm({
          title: "",
          subtitle: "",
          description: "",
          bgcolor: "",
          buttonText: "",
          buttonUrl: "",
          items: [{ productMark: "", productModel: "", cor: "", img: "" }],
        });
        fetchColecoes();
      } else {
        setError(data.message || "Erro ao criar coleção.");
      }
    } catch (e: any) {
      setError(e.message || "Erro ao conectar com a API.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async (id: string, isItem = false) => {
    if (!confirm(`Tem certeza que deseja excluir ${isItem ? "este item" : "esta coleção"}?`)) return;

    try {
      const res = await fetch("/api/crud/colecoes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isItem }),
      });
      if (res.ok) {
        alert(`${isItem ? "Item" : "Coleção"} excluído com sucesso!`);
        fetchColecoes();
      } else {
        const data = await res.json();
        setError(data.message || "Erro ao excluir.");
      }
    } catch (e) {
      setError("Erro ao conectar com a API.");
    }
  };

  return (
    <>
      <Head>
        <title>Admin - Coleções</title>
      </Head>
      <AdminLayout>
        <main className="container mx-auto p-4 mt-20">
          <h1 className="text-3xl font-bold mb-6">Gerenciar Coleções</h1>
          
          {/* Formulário de Criação/Edição */}
          <section className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Adicionar Nova Coleção</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" name="title" value={form.title} onChange={handleFormChange} placeholder="Título" required className="p-2 border rounded" />
              <input type="text" name="subtitle" value={form.subtitle} onChange={handleFormChange} placeholder="Subtítulo" className="p-2 border rounded" />
              <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Descrição" className="p-2 border rounded" />
              <input type="text" name="bgcolor" value={form.bgcolor} onChange={handleFormChange} placeholder="Cor de Fundo (Ex: #F4F1DE)" className="p-2 border rounded" />
              <input type="text" name="buttonText" value={form.buttonText} onChange={handleFormChange} placeholder="Texto do Botão" className="p-2 border rounded" />
              <input type="url" name="buttonUrl" value={form.buttonUrl} onChange={handleFormChange} placeholder="URL do Botão" className="p-2 border rounded" /> {/* Adicionado */}
              
              <h3 className="text-xl font-semibold mt-4">Itens da Coleção</h3>
              {form.items.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-2 items-center">
                  <input type="text" name="productMark" value={item.productMark as string} onChange={(e) => handleItemChange(e, index)} placeholder="Marca" required className="p-2 border rounded flex-1" />
                  <input type="text" name="productModel" value={item.productModel as string} onChange={(e) => handleItemChange(e, index)} placeholder="Modelo" required className="p-2 border rounded flex-1" />
                  <input type="text" name="cor" value={item.cor as string} onChange={(e) => handleItemChange(e, index)} placeholder="Cor" required className="p-2 border rounded flex-1" />
                  
                  <div className="flex-1 w-full flex items-center gap-2 border rounded p-2">
                    <label htmlFor={`img-${index}`} className="flex-1 text-gray-500 cursor-pointer">
                      {item.img instanceof File ? item.img.name : "Escolher arquivo..."}
                    </label>
                    <input type="file" name="img" id={`img-${index}`} onChange={(e) => handleItemChange(e, index)} required className="hidden" />
                  </div>

                  <button type="button" onClick={() => handleRemoveItem(index)} className="bg-red-500 text-white p-2 rounded">
                    <MdDelete />
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddItem} className="bg-blue-500 text-white p-2 rounded mt-2 flex items-center justify-center gap-2">
                <MdAddPhotoAlternate /> Adicionar Novo Item
              </button>
              
              <button type="submit" disabled={loading} className="bg-green-500 text-white p-3 rounded mt-4">
                {loading ? "Salvando..." : "Salvar Coleção"}
              </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </section>

          {/* Lista de Coleções */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Coleções Existentes</h2>
            {loading ? (
              <p>Carregando...</p>
            ) : colecoes.length === 0 ? (
              <p>Nenhuma coleção encontrada.</p>
            ) : (
              colecoes.map((colecao) => (
                <div key={colecao.id} className="bg-white p-4 rounded-lg shadow mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{colecao.title}</h3>
                    <div>
                      <button onClick={() => handleDelete(colecao.id)} className="bg-red-500 text-white p-2 rounded ml-2">Excluir Coleção</button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Subtítulo:</strong> {colecao.subtitle}</p>
                    <p><strong>Descrição:</strong> {colecao.description}</p>
                    <p><strong>URL do Botão:</strong> {colecao.buttonUrl || 'N/A'}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold">Itens:</h4>
                    {colecao.items.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row gap-2 items-center bg-gray-50 p-2 rounded mt-1">
                        <img src={item.img as string} alt={item.productModel} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <span>{item.productMark} - {item.productModel} ({item.cor})</span>
                          <p className="text-xs text-gray-500">Slug: {item.slug}</p>
                        </div>
                        <button onClick={() => handleDelete(item.id as string, true)} className="bg-red-400 text-white p-1 rounded text-xs">Excluir Item</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
      </AdminLayout>
    </>
  );
}