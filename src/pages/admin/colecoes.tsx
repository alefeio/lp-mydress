import { useState, useEffect } from "react";
import Head from "next/head";
import { MdAddPhotoAlternate, MdDelete, MdEdit } from 'react-icons/md';
import AdminLayout from "components/admin/AdminLayout";

// --- NOVAS ESTRUTURAS DE TIPO SOLICITADAS ---

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
    
    // CORREÇÃO: Inicialização do estado com os novos campos e tipos corretos
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
            // NOVOS CAMPOS
            ordem: 0, 
            fotos: [] 
        }],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
        setLoading(true);
        try {
            const res = await fetch("/api/crud/colecoes", { method: "GET" });
            const data = await res.json();
            if (res.ok && data.success) {
                // CORREÇÃO: Tratando 'a.order' e 'b.order' possivelmente 'null'
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
        const { name, value } = e.target;
        if (name === "order") {
            setForm({ ...form, [name]: parseInt(value, 10) || 0 });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value, files } = e.target;
        const newItems = [...form.items];

        if (name === "img" && files) {
            newItems[index] = { ...newItems[index], [name]: files[0] };
        } else if (name === "price" || name === "price_card" || name === "ordem") {
            // CORREÇÃO: Trata price, price_card E ordem como números ou null
            const numericValue = value === "" ? null : parseFloat(value) || 0;
            newItems[index] = { ...newItems[index], [name]: numericValue };
        } else if (name === "size") {
             // Trata size como string ou null
            const stringValue = value === "" ? null : value;
            newItems[index] = { ...newItems[index], [name]: stringValue };
        } else {
            newItems[index] = { ...newItems[index], [name]: value };
        }

        setForm({ ...form, items: newItems });
    };

    const handleAddItem = () => {
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
                size: item.size || null, 
                price: item.price || null,
                price_card: item.price_card || null,
                like: item.like || null,
                view: item.view || null,
                // NOVOS CAMPOS
                ordem: item.ordem || 0, // Garante que seja um número (0 se nulo)
                // É necessário mapear as fotos para incluir o tipo File/string
                fotos: (item.fotos || []).map(foto => ({
                     ...foto,
                     url: foto.url as string, // Ao carregar do BD é string
                     ordem: foto.ordem || 0
                })) as ColecaoItemFoto[]
            }))
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
                                // Garante que a ordem e outros campos sejam números
                                ordem: foto.ordem || 0,
                                like: foto.like || 0,
                                view: foto.view || 0,
                            };
                        })
                    );
                    
                    finalItem.fotos = fotosWithUrls;

                    // Garante que campos nulos sejam tratados como null e não 0/"" se estiverem vazios
                    return {
                        ...finalItem,
                        size: finalItem.size || null,
                        price: finalItem.price || null,
                        price_card: finalItem.price_card || null,
                        ordem: finalItem.ordem || 0, // Campo ordem
                    }
                })
            );

            const method = form.id ? "PUT" : "POST";
            const body = {
                ...form,
                // Filtra o campo 'colecaoId' de cada item antes de enviar
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
                <h1 className="text-4xl font-extrabold mb-8 text-gray-500">Gerenciar Coleções</h1>

                {/* Formulário de Criação/Edição */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
                    <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-400">{form.id ? "Editar Coleção" : "Adicionar Nova Coleção"}</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                                    <input type="text" name="productMark" value={item.productMark} onChange={(e) => handleItemChange(e, index)} placeholder="Marca" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
                                    <input type="text" name="productModel" value={item.productModel} onChange={(e) => handleItemChange(e, index)} placeholder="Modelo" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
                                    <input type="text" name="cor" value={item.cor} onChange={(e) => handleItemChange(e, index)} placeholder="Cor" required className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
                                    
                                    <input type="text" name="size" value={item.size ?? ''} onChange={(e) => handleItemChange(e, index)} placeholder="Tamanho" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
                                    <input type="number" name="price" value={item.price ?? ''} onChange={(e) => handleItemChange(e, index)} placeholder="Preço" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
                                    <input type="number" name="price_card" value={item.price_card ?? ''} onChange={(e) => handleItemChange(e, index)} placeholder="Preço a prazo" className="p-3 dark:bg-gray-600 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900" />
                                    
                                    {/* CAMPO 'ORDEM' NO ITEM */}
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

                                    {/* Gerenciamento de Fotos Secundárias (fotos) */}
                                    <div className="mt-2">
                                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Fotos Secundárias ({item.fotos.length})</h4>
                                        {/* Este é um placeholder. Você precisaria de um modal ou lógica de expansão para gerenciar a ColecaoItemFoto[] */}
                                        <button type="button" className="w-full text-blue-500 border border-blue-300 p-1 mt-1 rounded text-sm hover:bg-blue-50 dark:hover:bg-gray-700">
                                            Gerenciar Fotos
                                        </button>
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

                {/* Lista de Coleções */}
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
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-400">{colecao.title} (Ordem: {colecao.order})</h3>
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
                                    {colecao.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                            <img src={item.img as string} alt={item.productModel} className="w-20 h-20 object-cover rounded-lg" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 dark:text-gray-400">{item.productMark} - {item.productModel} ({item.cor})</h4>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Ordem Item: {item.ordem || 'N/A'} | Tamanho: {item.size || 'N/A'} | Preço: R${item.price || 'N/A'} | A prazo: R${item.price_card || 'N/A'}
                                                </p>
                                                <p className="text-xs text-blue-500 mt-1">
                                                    Fotos Adicionais: {item.fotos?.length || 0}
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