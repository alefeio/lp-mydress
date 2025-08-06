import React from 'react';

const DressHighlight: React.FC = () => {
    return (
        <section className="py-10">
            <h2 className="text-3xl font-bold text-center mb-6">Featured Party Dresses</h2>
            <div className="flex flex-wrap justify-center">
                <div className="max-w-xs m-4 p-4 border rounded-lg shadow-lg">
                    <img src="/path-to-dress-image-1.jpg" alt="Party Dress 1" className="w-full h-64 object-cover rounded-lg mb-4" />
                    <h3 className="text-xl font-semibold">Elegant Evening Gown</h3>
                    <p className="text-gray-600">A stunning gown perfect for any formal occasion.</p>
                </div>
                <div className="max-w-xs m-4 p-4 border rounded-lg shadow-lg">
                    <img src="/path-to-dress-image-2.jpg" alt="Party Dress 2" className="w-full h-64 object-cover rounded-lg mb-4" />
                    <h3 className="text-xl font-semibold">Chic Cocktail Dress</h3>
                    <p className="text-gray-600">Stylish and fun, ideal for cocktail parties.</p>
                </div>
                <div className="max-w-xs m-4 p-4 border rounded-lg shadow-lg">
                    <img src="/path-to-dress-image-3.jpg" alt="Party Dress 3" className="w-full h-64 object-cover rounded-lg mb-4" />
                    <h3 className="text-xl font-semibold">Flirty Mini Dress</h3>
                    <p className="text-gray-600">Perfect for a night out with friends.</p>
                </div>
            </div>
        </section>
    );
};

export default DressHighlight;