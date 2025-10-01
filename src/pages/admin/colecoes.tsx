import { useState, useEffect } from "react";
import Head from "next/head";
import { MdAddPhotoAlternate, MdDelete, MdEdit, MdSwapVert } from 'react-icons/md';
import AdminLayout from "components/admin/AdminLayout";

// --- Definições de Tipo Atualizadas ---

// Novo tipo para as fotos secundárias
interface ColecaoItemFoto {
  id?: string;
  url: string | File; // File para upload, string para URL existente
  caption?: string | null;
  ordem: number; // Campo para ordenar as fotos secundárias
  colecaoItemId?: string; // Chave de relacionamento (opcional no frontend)
}

interface ColecaoItem {
  id?: string;
  productMark: string;
  productModel: string;
  cor: string;
  // Mantido como imagem principal/de capa
  img: string | File; 
  slug?: string;
  // NOVO: Campo de ordenação para o item dentro da coleção
  ordem: number; 
  // NOVO: Array para as fotos secundárias
  fotos: ColecaoItemFoto[]; 
  // Campos do banco de dados (também estão no `types/index.ts` e `schema.prisma`)
  size?: string | null;
  price?: number | null;
  price_card?: number | null;
  like?: number | null;
  view?: number | null;
  colecaoId?: string;
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

// --- Componente Principal ---

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
      productMark: "",
      productModel: "",
      cor: "",
      img: "",
      ordem: 0, // Novo campo
      fotos: [], // Novo campo
      size: "",
      price: 0,
      price_card: 0
    }],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchColecoes();
  }, []);

  // [Funções de Fetch, ResetForm, HandleFormChange - MANTIDAS IGUAIS (exceto tratamento do campo 'ordem' da coleção)]

  const fetchColecoes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crud/colecoes", { method: "GET" });
      const data = await res.json();
      if (res.ok && data.success) {
        // Ordena as coleções pelo campo 'order'
        const sortedColecoes = data.colecoes.sort((a: Colecao, b: Colecao) => a.order - b.order);
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
    setForm({
      title: "",
      subtitle: "",
      description: "",
      bgcolor: "",
      buttonText: "",
      buttonUrl: "",
      order: 0,
      items: [{
        productMark: "",
        productModel: "",
        cor: "",
        img: "",
        ordem: 0, // Resetar novo campo
        fotos: [], // Resetar novo campo
        size: "",
        price: 0,
        price_card: 0
      }],
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "order") {
      setForm({ ...form, [name]: parseInt(value, 10) || 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  
  // --- Funções de Item Atualizadas ---

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, files } = e.target;
    const newItems = [...form.items];

    if (name === "img" && files) {
      // Foto principal: apenas um arquivo
      newItems[index] = { ...newItems[index], [name]: files[0] };
    } else if (name === "price" || name === "price_card" || name === "ordem") {
      // Campos numéricos do item (incluindo o novo campo 'ordem')
      newItems[index] = { ...newItems[index], [name]: parseFloat(value) || 0 };
    } else {
      // Campos de texto do item
      newItems[index] = { ...newItems[index], [name]: value };
    }

    setForm({ ...form, items: newItems });
  };
  
  const handleMultiplePhotosUpload = (e: React.ChangeEvent<HTMLInputElement>, itemIndex: number) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: ColecaoItemFoto[] = Array.from(files).map((file, i) => ({
      url: file,
      caption: '',
      // Atribui uma ordem inicial baseada no número de fotos existentes + novas
      ordem: form.items[itemIndex].fotos.length + i, 
    }));

    const newItems = [...form.items];
    newItems[itemIndex] = {
      ...newItems[itemIndex],
      fotos: [...newItems[itemIndex].fotos, ...newPhotos],
    };

    setForm({ ...form, items: newItems });
  };

  const handlePhotoOrderChange = (itemIndex: number, photoIndex: number, newOrder: number) => {
    const newItems = [...form.items];
    const newFotos = [...newItems[itemIndex].fotos];
    newFotos[photoIndex].ordem = newOrder;

    // Opcional: Reordenar visualmente as fotos no estado para melhor UX
    newItems[itemIndex].fotos = newFotos.sort((a, b) => a.ordem - b.ordem);
    
    setForm({ ...form, items: newItems });
  };

  const handleRemovePhoto = (itemIndex: number, photoIndex: number) => {
    const newItems = [...form.items];
    newItems[itemIndex].fotos = newItems[itemIndex].fotos.filter((_, i) => i !== photoIndex);
    setForm({ ...form, items: newItems });
  };

  const handleAddItem = () => {
    setForm({
      ...form,
      items: [...form.items, { productMark: "", productModel: "", cor: "", img: "", ordem: 0, fotos: [], size: "", price: 0, price_card: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleEdit = (colecao: Colecao) => {
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
        // Assume que o campo 'ordem' já vem do DB
        ordem: (item as any).ordem || 0, 
        // Assume que 'fotos' (ColecaoItemFoto[]) está aninhado e pronto para edição
        fotos: (item as any).fotos?.map((foto: ColecaoItemFoto) => ({
          ...foto,
          url: foto.url as string // Garante que é string para URL existente
        })) || [], 
        size: item.size || '',
        price: item.price || 0,
        price_card: item.price_card || 0
      }))
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // --- Funções de Submissão Atualizadas (com upload de múltiplas fotos) ---

  const uploadFile = async (file: File) => {
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const itemsWithUploadedUrls = await Promise.all(
        form.items.map(async (item) => {
          // 1. Upload da IMAGEM PRINCIPAL (img)
          let mainImgUrl = item.img;
          if (item.img instanceof File) {
            mainImgUrl = await uploadFile(item.img);
          }

          // 2. Upload das FOTOS SECUNDÁRIAS (fotos)
          const uploadedFotos = await Promise.all(
            item.fotos.map(async (foto) => {
              let fotoUrl = foto.url;
              if (foto.url instanceof File) {
                fotoUrl = await uploadFile(foto.url);
              }
              return { ...foto, url: fotoUrl };
            })
          );
          
          return { 
            ...item, 
            img: mainImgUrl, 
            fotos: uploadedFotos,
          };
        })
      );

      const method = form.id ? "PUT" : "POST";
      const body = {
        ...form,
        // Remove campos internos antes de enviar, se necessário
        items: itemsWithUploadedUrls.map(({ colecaoId, ...rest }) => ({
             ...rest,
             // Remove o ID para criação de novas fotos/itens no DB se necessário
             fotos: rest.fotos.map(({ id, ...fotoRest }) => fotoRest)
        }))
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

  // [Função handleDelete - MANTIDA IGUAL]

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

  // --- Renderização do Componente Atualizada ---

  return (
    <>
      <Head>
        <title>Admin - Coleções</title>
      </Head>
      <AdminLayout>
        <h1 className="text-4xl font-extrabold mb-8 text-gray-500">Gerenciar Coleções</h1>

        {/* Formulário de Criação/Edição */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-400">{form.id ? "Editar Coleção" : "Adicionar Nova Coleção"}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Campos da Coleção */}
            <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Título da Coleção</span>
                <input type="text" name="title" value={form.title} onChange={handleFormChange} placeholder="Ex: Coleção Verão 2024" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
            </label>
            <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Subtítulo (Opcional)</span>
                <input type="text" name="subtitle" value={form.subtitle} onChange={handleFormChange} placeholder="Ex: Peças exclusivas e limitadas" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
            </label>
            <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Descrição (Opcional)</span>
                <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Detalhes sobre o tema da coleção" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Cor de Fundo (Ex: #F4F1DE)</span>
                    <input type="text" name="bgcolor" value={form.bgcolor} onChange={handleFormChange} placeholder="#F4F1DE" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
                </label>
                <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Texto do Botão (Ex: Ver Itens)</span>
                    <input type="text" name="buttonText" value={form.buttonText} onChange={handleFormChange} placeholder="Texto do Botão" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
                </label>
                <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-400">URL do Botão (Link de destino)</span>
                    <input type="url" name="buttonUrl" value={form.buttonUrl} onChange={handleFormChange} placeholder="/colecao/verao" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
                </label>
            </div>
            <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Ordem de Exibição da Coleção (Numérico)</span>
                <input type="number" name="order" value={form.order} onChange={handleFormChange} placeholder="1" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
            </label>

            <h3 className="text-xl font-bold mt-6 text-gray-700 dark:text-gray-400">Itens da Coleção</h3>
            {form.items.map((item, index) => (
              <div key={index} className="flex flex-col gap-4 p-4 border border-dashed border-gray-300 rounded-lg relative">
                <button type="button" onClick={() => handleRemoveItem(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition duration-200">
                  <MdDelete size={24} />
                </button>
                
                {/* Campos do Item da Coleção */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Marca</span>
                        <input type="text" name="productMark" value={item.productMark} onChange={(e) => handleItemChange(e, index)} placeholder="Marca" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Modelo</span>
                        <input type="text" name="productModel" value={item.productModel} onChange={(e) => handleItemChange(e, index)} placeholder="Modelo" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Cor</span>
                        <input type="text" name="cor" value={item.cor} onChange={(e) => handleItemChange(e, index)} placeholder="Cor" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Tamanho (Opcional)</span>
                        <input type="text" name="size" value={item.size || ''} onChange={(e) => handleItemChange(e, index)} placeholder="Tamanho (Ex: P, M, 38)" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Preço à Vista (R$)</span>
                        <input type="number" name="price" value={item.price || ''} onChange={(e) => handleItemChange(e, index)} placeholder="100" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Preço a Prazo (R$)</span>
                        <input type="number" name="price_card" value={item.price_card || ''} onChange={(e) => handleItemChange(e, index)} placeholder="110" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Ordem do Item na Coleção</span>
                        <input type="number" name="ordem" value={item.ordem} onChange={(e) => handleItemChange(e, index)} placeholder="0" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full text-gray-900 mt-1" />
                    </label>
                </div>
                
                {/* Upload da Imagem Principal (img) */}
                <div className="p-3 border border-gray-300 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-400 block mb-2">Imagem Principal (Capa)</span>
                    <div className="flex items-center gap-4">
                        {typeof item.img === 'string' && item.img && (
                            <img src={item.img} alt="Capa" className="w-16 h-16 object-cover rounded-lg" />
                        )}
                        <label htmlFor={`img-${index}`} className="flex-1 text-gray-500 cursor-pointer flex items-center justify-center gap-2 font-semibold hover:bg-gray-100 transition duration-200 p-2 rounded-lg border border-dashed border-gray-400">
                            <MdAddPhotoAlternate size={24} />
                            {item.img instanceof File ? item.img.name : "Escolher Imagem Principal (campo 'img')"}
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
                </div>

                {/* Upload e Gestão de Múltiplas Fotos (fotos) */}
                <div className="p-3 border border-gray-300 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Fotos Adicionais (Múltiplo Upload)</span>
                        <label htmlFor={`multiple-img-${index}`} className="text-blue-500 cursor-pointer flex items-center gap-1 text-sm hover:text-blue-700">
                            <MdAddPhotoAlternate size={20} /> Adicionar Fotos
                        </label>
                        <input
                            type="file"
                            multiple
                            id={`multiple-img-${index}`}
                            onChange={(e) => handleMultiplePhotosUpload(e, index)}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    
                    {/* Lista de Fotos Adicionais */}
                    <div className="flex flex-wrap gap-3 mt-4">
                        {item.fotos.sort((a, b) => a.ordem - b.ordem).map((foto, photoIndex) => (
                            <div key={photoIndex} className="relative w-28 h-36 border p-2 rounded-lg flex flex-col items-center shadow-sm bg-gray-50">
                                <button type="button" onClick={() => handleRemovePhoto(index, photoIndex)} className="absolute top-0 right-0 p-1 text-red-500 bg-white rounded-full leading-none z-10">
                                    <MdDelete size={16} />
                                </button>
                                <img 
                                    src={typeof foto.url === 'string' ? foto.url : URL.createObjectURL(foto.url)} 
                                    alt={`Foto ${photoIndex + 1}`} 
                                    className="w-full h-20 object-cover rounded-md mb-2"
                                />
                                <label className="block w-full">
                                    <span className="text-xs font-medium text-gray-600 block text-center">Ordem</span>
                                    <input
                                        type="number"
                                        value={foto.ordem}
                                        onChange={(e) => handlePhotoOrderChange(index, photoIndex, parseInt(e.target.value, 10) || 0)}
                                        placeholder="0"
                                        className="w-full p-1 text-xs text-center border rounded"
                                    />
                                </label>
                            </div>
                        ))}
                        {item.fotos.length === 0 && <p className="text-sm text-gray-500">Nenhuma foto adicional.</p>}
                    </div>
                </div>
              </div>
            ))}
            
            <button type="button" onClick={handleAddItem} className="bg-gray-200 text-gray-800 p-3 rounded-lg mt-2 flex items-center justify-center gap-2 font-semibold hover:bg-gray-300 transition duration-200">
              <MdAddPhotoAlternate size={24} /> Adicionar Novo Item
            </button>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button type="submit" disabled={loading} className="bg-blue-600 text-white p-4 rounded-lg flex-1 font-bold shadow-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400">
                {loading ? (form.id ? "Atualizando..." : "Salvando...") : (form.id ? "Atualizar Coleção" : "Salvar Coleção")}
              </button>
              {form.id && (
                <button type="button" onClick={resetForm} className="bg-red-500 text-white p-4 rounded-lg flex-1 font-bold shadow-md hover:bg-red-600 transition duration-200">
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>
          {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
        </section>

        {/* Lista de Coleções (MANTIDA IGUAL, exceto ordenação na exibição) */}
        {/* ... (código para listar coleções) ... */}
        
        <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-400">Coleções Existentes</h2>
          {loading ? (
            <p className="text-gray-600">Carregando...</p>
          ) : colecoes.length === 0 ? (
            <p className="text-gray-600">Nenhuma coleção encontrada.</p>
          ) : (
            colecoes.map((colecao) => (
              <div key={colecao.id} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-sm mb-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-400">{colecao.title}</h3>
                    <p className="text-sm text-gray-500">Ordem da Coleção: **{colecao.order}**</p>
                    <p className="text-sm text-gray-500">{colecao.subtitle}</p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button onClick={() => handleEdit(colecao)} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200">
                      <MdEdit size={20} className="text-white" />
                    </button>
                    <button onClick={() => handleDelete(colecao.id)} className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200">
                      <MdDelete size={20} className="text-white" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ordena os itens pela nova propriedade 'ordem' (se disponível) */}
                  {colecao.items.sort((a: any, b: any) => (a.ordem || 0) - (b.ordem || 0)).map((item) => (
                    <div key={item.id} className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <img src={item.img as string} alt={item.productModel} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-400">{item.productMark} - {item.productModel} ({item.cor})</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Ordem do Item: **{(item as any).ordem || 0}** | Tamanho: {item.size || 'N/A'} | Preço: R${item.price || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Fotos Adicionais: **{(item as any).fotos?.length || 0}**
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
        
      </AdminLayout>
    </>
  );
}