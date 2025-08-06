import React from 'react';

const Clutches: React.FC = () => {
    return (
        <section className="py-10">
            <h2 className="text-2xl font-bold text-center mb-6">Stylish Clutches</h2>
            <p className="text-center mb-4">Explore our collection of elegant clutches that complement your party dresses.</p>
            <div className="flex flex-wrap justify-center">
                {/* Example clutch items can be added here */}
                <div className="m-4 p-4 border rounded shadow-lg">
                    <img src="/path-to-clutch-image.jpg" alt="Clutch 1" className="w-full h-auto mb-2" />
                    <h3 className="font-semibold">Clutch Style 1</h3>
                    <p className="text-sm">A chic clutch perfect for any occasion.</p>
                </div>
                <div className="m-4 p-4 border rounded shadow-lg">
                    <img src="/path-to-clutch-image.jpg" alt="Clutch 2" className="w-full h-auto mb-2" />
                    <h3 className="font-semibold">Clutch Style 2</h3>
                    <p className="text-sm">Elegant and stylish for your night out.</p>
                </div>
                {/* Add more clutch items as needed */}
            </div>
        </section>
    );
};

export default Clutches;