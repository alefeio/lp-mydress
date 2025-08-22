import React, { useState } from 'react';
import { ColecaoProps } from '../types';

type FloatingButtonsProps = {
    colecoes: ColecaoProps[];
};

const FloatingButtons: React.FC<FloatingButtonsProps> = ({ colecoes }) => {
    const [showButtons, setShowButtons] = useState(false);

    const toggleButtons = () => {
        setShowButtons(!showButtons);
    };

    return (
        <div className="block sticky ml-4 top-1/2 transform -translate-y-1/2 z-50">
            {/* Botão para ocultar/visualizar */}
            <button
                onClick={toggleButtons}
                className="flex items-center justify-center w-8 h-8 mb-4 bg-white text-gray-500 opacity-80 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300"
                aria-label={showButtons ? "Ocultar botões" : "Mostrar botões"}
            >
                {/* Ícone de menu (três pontos) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
            </button>

            {showButtons && <div className={`space-y-4 transition-all duration-300 ease-in-out ${showButtons ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                {colecoes.map((colecao) => (
                    <a
                        key={colecao.id}
                        href={`#${colecao.slug}`}
                        className={`flex items-center ${colecao.bgcolor} justify-center w-8 h-8 rounded-full shadow-lg hover:opacity-80 transition-opacity duration-300`}
                        title={colecao.title}
                    >
                        <span className="font-bold text-sm text-white">{colecao.title.charAt(0)}</span>
                    </a>
                ))}
            </div>}
        </div>
    );
};

export default FloatingButtons;