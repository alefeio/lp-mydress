// /pages/admin/colecoes.tsx

import { useState, useEffect } from "react";
import Head from "next/head";
import { MdAddPhotoAlternate, MdDelete, MdEdit, MdClose, MdUpload } from 'react-icons/md';
import AdminLayout from "components/admin/AdminLayout";
import React from "react"; // Necessário para React.ChangeEvent, React.FormEvent

// --- ESTRUTURAS DE TIPO (MANTIDAS) ---

interface ColecaoItemFoto {
  id?: string;
  url: string | File; // Permite File para upload
  caption?: string | null;
  ordem: number; // Novo campo de ordem
  like?: number | null;
  view?: number | null;
  colecaoItemId?: string;
}

interface ColecaoItem {
  id?: string;
  productMark: string;
  productModel: string;
  cor: string;
  img: string | File; // Mantido para compatibilidade
  slug?: string;
  // Campos do banco de dados
  size?: string | null;
  price?: number | null;
  price_card?: number | null;
  like?: number | null;
  view?: number | null;
  colecaoId?: string;

  // CAMPOS NOVOS SOLICITADOS
  ordem: number; // Campo para ordenação
  fotos: ColecaoItemFoto[]; // Array para múltiplas fotos
}

interface Colecao {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  bgcolor: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  order: number;
  items: ColecaoItem[];
}

interface FormState {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  bgcolor: string;
  buttonText: string;
  buttonUrl: string;
  order: number;
  items: ColecaoItem[];
}

// ------------------------------------
// Componente de Administração de Coleções
// ------------------------------------

export default function AdminColecoes() {
  const [colecoes, setColecoes] = useState<Colecao[]>([]);

  const [form, setForm] = useState<FormState>({
    title: "",
    subtitle: "",
    description: "",
    bgcolor: "",
    buttonText: "",
    buttonUrl: "",
    order: 0,
    items: [{
      id: undefined, slug: undefined, colecaoId: undefined, like: null, view: null,
      productMark: "",
      productModel: "",
      cor: "",
      img: "",
      size: null,
      price: null,
      price_card: null,
      ordem: 0,
      fotos: []
    }],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // NOVO ESTADO PARA O MODAL DE FOTOS
  const [showFotoModal, setShowFotoModal] = useState(false);
  // Armazena o índice do item no array `form.items` que está sendo editado
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchColecoes();
  }, []);

  // Função auxiliar para upload de uma única imagem (necessária para fotos)
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      throw new Error(uploadData.message || "Erro no upload da imagem via API.");
    }
    return uploadData.url;
  };


  const fetchColecoes = async () => {
    // Lógica de fetch (mantida)
    setLoading(true);
    try {
      const res = await fetch("/api/crud/colecoes", { method: "GET" });
      const data = await res.json();
      if (res.ok && data.success) {
        const sortedColecoes = data.colecoes.sort((a: Colecao, b: Colecao) => (a.order || 0) - (b.order || 0));
        setColecoes(sortedColecoes);
      } else {
        setError(data.message || "Erro ao carregar coleções.");
      }
    } catch (e) {
      setError("Erro ao conectar com a API.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // Lógica de reset (mantida)
    setForm({
      title: "",
      subtitle: "",
      description: "",
      bgcolor: "",
      buttonText: "",
      buttonUrl: "",
      order: 0,
      items: [{
        id: undefined, slug: undefined, colecaoId: undefined, like: null, view: null,
        productMark: "",
        productModel: "",
        cor: "",
        img: "",
        size: null,
        price: null,
        price_card: null,
        ordem: 0,
        fotos: []
      }],
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Lógica de handleFormChange (mantida)
    const { name, value } = e.target;
    if (name === "order") {
      setForm({ ...form, [name]: parseInt(value, 10) || 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    // Lógica de handleItemChange (mantida)
    const { name, value, files } = e.target;
    const newItems = [...form.items];

    if (name === "img" && files) {
      newItems[index] = { ...newItems[index], [name]: files[0] };
    } else if (name === "price" || name === "price_card" || name === "ordem") {
      const numericValue = value === "" ? null : parseFloat(value) || 0;
      newItems[index] = { ...newItems[index], [name]: numericValue };
    } else if (name === "size") {
      const stringValue = value === "" ? null : value;
      newItems[index] = { ...newItems[index], [name]: stringValue };
    } else {
      newItems[index] = { ...newItems[index], [name]: value };
    }

    setForm({ ...form, items: newItems });
  };

  const handleAddItem = () => {
    // Lógica de handleAddItem (mantida)
    setForm({
      ...form,
      items: [...form.items, {
        id: undefined, slug: undefined, colecaoId: undefined, like: null, view: null,
        productMark: "", productModel: "", cor: "", img: "",
        size: null, price: null, price_card: null,
        ordem: 0, fotos: [] // Novos campos
      }],
    });
  };

  const handleRemoveItem = (index: number) => {
    // Lógica de handleRemoveItem (mantida)
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleEdit = (colecao: Colecao) => {
    // Lógica de handleEdit (mantida)
    setForm({
      id: colecao.id,
      title: colecao.title,
      subtitle: colecao.subtitle || "",
      description: colecao.description || "",
      bgcolor: colecao.bgcolor || "",
      buttonText: colecao.buttonText || "",
      buttonUrl: colecao.buttonUrl || "",
      order: colecao.order || 0,
      items: colecao.items.map(item => ({
        ...item,
        img: item.img as string,
        size: item.size || null,
        price: item.price || null,
        price_card: item.price_card || null,
        like: item.like || null,
        view: item.view || null,
        ordem: item.ordem || 0,
        fotos: (item.fotos || []).map(foto => ({
          ...foto,
          url: foto.url as string,
          ordem: foto.ordem || 0
        })) as ColecaoItemFoto[]
      }))
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Lógica de handleSubmit (mantida)
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const itemsWithUrls = await Promise.all(
        form.items.map(async (item) => {
          let finalItem = { ...item };

          // 1. Upload da Imagem Principal (img)
          if (item.img instanceof File) {
            const url = await uploadImage(item.img);
            finalItem.img = url;
          }

          // 2. Processamento das fotos (se houver)
          const fotosWithUrls: any = await Promise.all(
            (item.fotos || []).map(async (foto) => {
              let fotoUrl = typeof foto.url === 'string' ? foto.url : '';
              if (foto.url instanceof File) {
                fotoUrl = await uploadImage(foto.url);
              }
              return {
                ...foto,
                url: fotoUrl,
                ordem: foto.ordem || 0,
                like: foto.like || 0,
                view: foto.view || 0,
              };
            })
          );

          finalItem.fotos = fotosWithUrls;

          return {
            ...finalItem,
            size: finalItem.size || null,
            price: finalItem.price || null,
            price_card: finalItem.price_card || null,
            ordem: finalItem.ordem || 0,
          }
        })
      );

      const method = form.id ? "PUT" : "POST";
      const body = {
        ...form,
        items: itemsWithUrls.map(({ colecaoId, ...rest }) => rest)
      };

      const res = await fetch("/api/crud/colecoes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Coleção ${form.id ? 'atualizada' : 'criada'} com sucesso!`);
        resetForm();
        fetchColecoes();
      } else {
        setError(data.message || `Erro ao ${form.id ? 'atualizar' : 'criar'} coleção.`);
      }
    } catch (e: any) {
      setError(e.message || "Erro ao conectar com a API ou no upload da imagem.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, isItem = false) => {
    // Lógica de handleDelete (mantida)
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

  // ------------------------------------------------------------------
  // NOVAS FUNÇÕES PARA GERENCIAMENTO DE FOTOS SECUNDÁRIAS (BOTÃO ATIVO)
  // ------------------------------------------------------------------

  const handleManageFotos = (index: number) => {
    setEditingItemIndex(index);
    setShowFotoModal(true);
  };

  const handleCloseFotoModal = () => {
    setEditingItemIndex(null);
    setShowFotoModal(false);
  };

  const handleAddFoto = () => {
    if (editingItemIndex === null) return;

    const newItems = [...form.items];
    const newItem = { ...newItems[editingItemIndex] };

    newItem.fotos = [...newItem.fotos, {
      url: "",
      caption: null,
      ordem: newItem.fotos.length + 1, // Sugere uma ordem inicial
      like: null,
      view: null
    }];

    newItems[editingItemIndex] = newItem;
    setForm({ ...form, items: newItems });
  };

  const handleRemoveFoto = (fotoIndex: number) => {
    if (editingItemIndex === null) return;

    const newItems = [...form.items];
    const newItem = { ...newItems[editingItemIndex] };

    newItem.fotos = newItem.fotos.filter((_, i) => i !== fotoIndex);

    // Reajusta a ordem após a remoção (opcional)
    newItem.fotos = newItem.fotos.map((foto, i) => ({ ...foto, ordem: i + 1 }));

    newItems[editingItemIndex] = newItem;
    setForm({ ...form, items: newItems });
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fotoIndex: number) => {
    if (editingItemIndex === null) return;

    const { name, value } = e.target;
    const newItems = [...form.items];
    const newFotos = [...newItems[editingItemIndex].fotos];

    if (name === "ordem") {
      const numericValue = parseInt(value, 10) || 0;
      newFotos[fotoIndex] = { ...newFotos[fotoIndex], [name]: numericValue };
    } else {
      newFotos[fotoIndex] = { ...newFotos[fotoIndex], [name]: value };
    }

    newItems[editingItemIndex].fotos = newFotos;
    setForm({ ...form, items: newItems });
  };

  const handleFotoFileChange = (e: React.ChangeEvent<HTMLInputElement>, fotoIndex: number) => {
    if (editingItemIndex === null || !e.target.files) return;

    const file = e.target.files[0];
    if (!file) return;

    const newItems = [...form.items];
    const newFotos = [...newItems[editingItemIndex].fotos];

    // Atualiza a URL com o objeto File para posterior upload no handleSubmit
    newFotos[fotoIndex] = { ...newFotos[fotoIndex], url: file };

    newItems[editingItemIndex].fotos = newFotos;
    setForm({ ...form, items: newItems });

    // Limpa o valor do input file para permitir o upload da mesma foto novamente se necessário
    e.target.value = '';
  };

  // ------------------------------------------------------------------
  // COMPONENTE MODAL DE FOTOS
  // ------------------------------------------------------------------

  const FotosModal = ({ itemIndex }: { itemIndex: number | null }) => {
    if (itemIndex === null || !showFotoModal) return null;

    const item = form.items[itemIndex];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Gerenciar Fotos Secundárias para {item.productModel} ({item.productMark})
            </h3>
            <button onClick={handleCloseFotoModal} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
              <MdClose size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {item.fotos.length === 0 ? (
              <p className="text-gray-500 italic">Nenhuma foto secundária adicionada. Adicione uma para começar.</p>
            ) : (
              item.fotos
                // A reordenação deve ser feita no estado ou no submit. Aqui, usamos a ordem atual do estado.
                .map((foto, fotoIndex) => {

                  const fotoUrl = typeof foto.url === 'string' ? foto.url : URL.createObjectURL(foto.url);

                  return (
                    <div key={foto.id || fotoIndex} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-300 rounded-lg mb-4 items-start md:items-center">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <img
                          src={fotoUrl}
                          alt={`Foto ${fotoIndex + 1}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex flex-col flex-1">
                          <label htmlFor={`foto-file-${itemIndex}-${fotoIndex}`} className="text-blue-500 border border-blue-300 p-2 rounded text-sm cursor-pointer flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-700">
                            <MdUpload size={16} />
                            {foto.url instanceof File ? 'Arquivo Selecionado' : 'Substituir Imagem'}
                          </label>
                          <input
                            type="file"
                            id={`foto-file-${itemIndex}-${fotoIndex}`}
                            name={`foto-file-${fotoIndex}`}
                            onChange={(e) => handleFotoFileChange(e, fotoIndex)}
                            className="hidden"
                            accept="image/*"
                          />
                          {foto.url instanceof File && <p className="text-xs text-gray-500 truncate mt-1">{foto.url.name}</p>}
                          {typeof foto.url === 'string' && foto.url && <p className="text-xs text-green-600 truncate mt-1">URL Existente</p>}
                        </div>
                      </div>

                      <input
                        type="text"
                        name="caption"
                        value={foto.caption || ''}
                        onChange={(e) => handleFotoChange(e, fotoIndex)}
                        placeholder="Legenda (opcional)"
                        className="p-2 border border-gray-300 rounded-lg w-full md:flex-1"
                      />

                      <input
                        type="number"
                        name="ordem"
                        value={foto.ordem || ''}
                        onChange={(e) => handleFotoChange(e, fotoIndex)}
                        placeholder="Ordem"
                        className="p-2 border border-gray-300 rounded-lg w-20 text-center"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveFoto(fotoIndex)}
                        className="text-red-500 hover:text-red-700 p-2 rounded transition duration-200"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  );
                })
            )}
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleAddFoto}
              className="bg-green-600 text-white p-3 rounded-lg flex items-center gap-2 font-semibold hover:bg-green-700 transition duration-200"
            >
              <MdAddPhotoAlternate size={20} /> Adicionar Nova Foto
            </button>
            <button
              type="button"
              onClick={handleCloseFotoModal}
              className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Fechar e Salvar
            </button>
          </div>
        </div>
      </div>
    );
  };


  return (
    <>
      <Head>
        <title>Admin - Coleções</title>
      </Head>
      <AdminLayout>
        <h1 className="text-4xl font-extrabold mb-8 text-gray-500">Gerenciar Coleções</h1>

        {/* Formulário de Criação/Edição (Mantido) */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-400">{form.id ? "Editar Coleção" : "Adicionar Nova Coleção"}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Campos da Coleção (Mantidos) */}
            <input type="text" name="title" value={form.title} onChange={handleFormChange} placeholder="Título" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
            <input type="text" name="subtitle" value={form.subtitle} onChange={handleFormChange} placeholder="Subtítulo" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
            <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Descrição" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
            <input type="text" name="bgcolor" value={form.bgcolor} onChange={handleFormChange} placeholder="Cor de Fundo (Ex: #F4F1DE)" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
            <input type="text" name="buttonText" value={form.buttonText} onChange={handleFormChange} placeholder="Texto do Botão" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
            <input type="url" name="buttonUrl" value={form.buttonUrl} onChange={handleFormChange} placeholder="URL do Botão" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
            <input type="number" name="order" value={form.order} onChange={handleFormChange} placeholder="Ordem" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />

            <h3 className="text-xl font-bold mt-6 text-gray-700 dark:text-gray-400">Itens da Coleção</h3>
            {form.items.map((item, index) => (
              <div key={item.id || index} className="flex flex-col md:flex-row gap-4 p-4 border border-dashed border-gray-300 rounded-lg relative">
                <button type="button" onClick={() => handleRemoveItem(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition duration-200">
                  <MdDelete size={24} />
                </button>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Campos do Item (Marca, Modelo, Cor, Tamanho, Preços, Ordem) - Mantidos */}
                  <input type="text" name="productMark" value={item.productMark} onChange={(e) => handleItemChange(e, index)} placeholder="Marca" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
                  <input type="text" name="productModel" value={item.productModel} onChange={(e) => handleItemChange(e, index)} placeholder="Modelo" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
                  <input type="text" name="cor" value={item.cor} onChange={(e) => handleItemChange(e, index)} placeholder="Cor" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />

                  <input type="text" name="size" value={item.size ?? ''} onChange={(e) => handleItemChange(e, index)} placeholder="Tamanho" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
                  <input type="number" name="price" value={item.price ?? ''} onChange={(e) => handleItemChange(e, index)} placeholder="Preço" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
                  <input type="number" name="price_card" value={item.price_card ?? ''} onChange={(e) => handleItemChange(e, index)} placeholder="Preço a prazo" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />

                  <input type="number" name="ordem" value={item.ordem ?? ''} onChange={(e) => handleItemChange(e, index)} placeholder="Ordem do Item" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
                </div>

                <div className="flex flex-col gap-2 p-3 border border-gray-300 rounded-lg">
                  {/* Campo Imagem Principal (img) - Mantido */}
                  <div className="flex flex-col items-center gap-2">
                    {typeof item.img === 'string' && item.img && (
                      <img src={item.img} alt="Imagem principal" className="w-20 h-20 object-cover rounded-lg" />
                    )}
                    <label htmlFor={`img-${index}`} className="w-full text-gray-500 cursor-pointer flex items-center justify-center gap-2 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 p-2 rounded-lg border">
                      <MdAddPhotoAlternate size={24} />
                      {item.img instanceof File ? item.img.name : "Imagem Principal (img)"}
                    </label>
                    <input
                      type="file"
                      name="img"
                      id={`img-${index}`}
                      onChange={(e) => handleItemChange(e, index)}
                      required={!item.img || item.img instanceof File}
                      className="hidden"
                    />
                  </div>

                  {/* Botão Gerenciar Fotos Secundárias (AGORA COM AÇÃO) */}
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Fotos Secundárias ({item.fotos.length})</h4>
                    <button
                      type="button"
                      onClick={() => handleManageFotos(index)} // Ação para abrir o modal
                      className="w-full text-blue-500 border border-blue-300 p-1 mt-1 rounded text-sm hover:bg-blue-50 dark:hover:bg-gray-700"
                    >
                      Gerenciar Fotos
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-gray-200 text-gray-800 p-3 rounded-lg mt-2 flex items-center justify-center gap-2 font-semibold hover:bg-gray-300 transition duration-200"
            >
              <MdAddPhotoAlternate size={20} /> Adicionar Novo Item à Coleção
            </button>

            {/* --- AÇÃO DO FORMULÁRIO (A CORREÇÃO ESTÁ AQUI) --- */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-600 dark:text-gray-400 p-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
                disabled={loading}
              >
                {form.id ? "Cancelar Edição" : "Limpar Formulário"}
              </button>
              <button
                type="submit" // Agora SEM caracteres especiais no comentário.
                className="bg-blue-600 text-white p-3 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-700 transition duration-200"
                disabled={loading}
              >
                {loading ? (form.id ? 'Atualizando...' : 'Criando...') : (form.id ? 'Atualizar Coleção' : 'Criar Coleção')}
              </button>
            </div>

            {error && <p className="text-red-500 mt-4 text-center font-semibold">{error}</p>}
          </form>
        </section>

        {/* Tabela de Coleções Existentes (Mantida) */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-400">Coleções Atuais</h2>
          {loading && !form.id && <p className="text-center text-blue-500">Carregando coleções...</p>}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ordem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Itens</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {colecoes.map((colecao) => (
                  <tr key={colecao.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{colecao.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{colecao.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-bold">{colecao.items.length}</span> itens
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2">
                      <button
                        onClick={() => handleEdit(colecao)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600 p-1 rounded transition duration-200"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(colecao.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600 p-1 rounded transition duration-200"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {colecoes.length === 0 && !loading && (
            <p className="text-center py-6 text-gray-500">Nenhuma coleção encontrada.</p>
          )}
        </section>

        {/* O Modal de Fotos é renderizado aqui, fora da estrutura principal do layout */}
        <FotosModal itemIndex={editingItemIndex} />
      </AdminLayout>
    </>
  );
}