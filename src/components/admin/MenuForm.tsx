import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Prisma } from "@prisma/client";

interface MenuItem {
  id: number;
  text: string;
  url: string;
}

export default function MenuForm() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [links, setLinks] = useState<MenuItem[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Carrega os dados do menu existentes
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("/api/crud/menu");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setLinks(data.links);
            setLogoUrl(data.logoUrl || '');
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do menu:", error);
      }
    };
    fetchMenu();
  }, []);

  const handleLinkChange = (index: number, field: keyof MenuItem, value: string) => {
    const newLinks = [...links];
    (newLinks[index][field] as string) = value;
    setLinks(newLinks);
  };

  const handleAddLink = () => {
    setLinks([...links, { id: Date.now(), text: "", url: "" }]);
  };

  const handleRemoveLink = (idToRemove: number) => {
    setLinks(links.filter((link) => link.id !== idToRemove));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return logoUrl;

    const formData = new FormData();
    formData.append("file", logoFile);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload da imagem");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error(error);
      setMessage("Erro ao fazer upload da logomarca.");
      setLoading(false);
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let newLogoUrl = logoUrl;
    if (logoFile) {
      newLogoUrl = await handleLogoUpload();
      if (!newLogoUrl) return;
    }

    try {
      const response = await fetch("/api/crud/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logoUrl: newLogoUrl, links }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar o menu");
      }

      const data = await response.json();
      setMessage("Menu salvo com sucesso!");
      setLoading(false);
      setLogoFile(null);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao salvar o menu.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      {message && (
        <p className={`mb-4 text-center ${message.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      {/* Upload da Logomarca */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Logomarca</label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full text-gray-700 bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          />
          {logoUrl && (
            <div className="w-24 h-auto">
              <img src={logoUrl} alt="Logomarca Atual" className="w-full h-auto object-contain" />
            </div>
          )}
        </div>
      </div>

      {/* Itens do Menu */}
      <label className="block text-gray-700 font-bold mb-2">Itens do Menu</label>
      <div className="space-y-4">
        {links.map((link, index) => (
          <div key={link.id} className="flex space-x-2">
            <input
              type="text"
              placeholder="Texto do Link"
              value={link.text}
              onChange={(e) => handleLinkChange(index, "text", e.target.value)}
              className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="URL"
              value={link.url}
              onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveLink(link.id)}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
            >
              -
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddLink}
        className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
      >
        + Adicionar Link
      </button>

      <button
        type="submit"
        className={`w-full mt-6 p-3 text-white font-bold rounded-md ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
        }`}
        disabled={loading}
      >
        {loading ? "Salvando..." : "Salvar Menu"}
      </button>
    </form>
  );
}