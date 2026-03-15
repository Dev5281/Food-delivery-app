import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/card';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';


export default function Home() {
    const [search, setSearch] = useState('');
    const [foodCat, setFoodCat] = useState([]);
    const [foodItem, setFoodItem] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔄 Fetching food data from /api/foodData...');
            let response = await fetch("/api/foodData", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 Response status:', response.status, response.statusText);
            console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

            const contentType = response.headers.get("content-type");
            let data;
            
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
                console.log('✅ Received JSON data:', data);
            } else {
                const text = await response.text();
                console.error("❌ Server returned non-JSON response:", text.substring(0, 200));
                setError(`Server error: ${response.status} - ${text.substring(0, 100)}`);
                setFoodItem([]);
                setFoodCat([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                console.error("❌ Error response:", data);
                setError(data.message || "Failed to fetch food data");
                setFoodItem([]);
                setFoodCat([]);
                setLoading(false);
                return;
            }

            if (Array.isArray(data) && data.length === 2) {
                const items = data[0] || [];
                const categories = data[1] || [];
                console.log(`✅ Loaded ${items.length} food items and ${categories.length} categories`);
                setFoodItem(items);
                setFoodCat(categories);
                
                if (items.length === 0 && categories.length === 0) {
                    setError("No food items found in database. Please add food items to MongoDB.");
                }
            } else {
                console.error("❌ Unexpected response format:", data);
                setError("Unexpected data format received from server");
                setFoodItem([]);
                setFoodCat([]);
            }
        } catch (error) {
            console.error("❌ Error fetching data:", error);
            setError(`Network error: ${error.message}. Please check if the backend server is running.`);
            setFoodItem([]);
            setFoodCat([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % 5); 
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const images = [
        "https://c7.alamy.com/comp/HGB7RB/new-fast-food-ramen-burger-close-up-on-a-paper-on-the-wooden-table-HGB7RB.jpg",
        "https://c7.alamy.com/comp/PEY8XR/fast-food-full-frame-PEY8XR.jpg",
        "https://c7.alamy.com/comp/C90YNW/pizza-fast-food-with-tomato-and-cheese-closeup-C90YNW.jpg",
        "https://c7.alamy.com/comp/F2H6NR/ramen-soup-mushroom-with-duck-meat-F2H6NR.jpg",
        "https://c7.alamy.com/comp/MKTGW3/chicken-shawarma-doner-kebab-with-ayran-or-buttermilk-fast-food-concept-MKTGW3.jpg"
    ];

    const handlePrevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + 5) % 5);
    };

    const handleNextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % 5);
    };
  
    return (
        <>
            <Navbar />
            
            {/* Hero Banner Section */}
            <div className="relative w-full overflow-hidden">
                
                {/* Carousel */}
                <div className="relative h-56 md:h-96 bg-gray-200 rounded-xl overflow-hidden mx-4 mt-4 md:mx-6">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute w-full h-full transition-opacity duration-1000 ${currentIndex === index ? 'opacity-100' : 'opacity-0 hidden'}`}
                        >
                            <img src={image} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                    ))}

                    {/* Carousel Controls */}
                    <button
                        onClick={handlePrevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-all duration-300 shadow-lg"
                    >
                        <FaChevronLeft className="text-lg" />
                    </button>
                    <button
                        onClick={handleNextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-all duration-300 shadow-lg"
                    >
                        <FaChevronRight className="text-lg" />
                    </button>

                    {/* Carousel Indicators */}
                    <div className="absolute z-20 flex gap-2 bottom-4 left-1/2 transform -translate-x-1/2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    currentIndex === index ? 'bg-white w-8' : 'bg-white/60'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Search Bar Overlay */}
                <div className="flex justify-center -mt-8 px-4 relative z-30">
                    <div className="w-full max-w-2xl flex items-center gap-2 bg-white rounded-xl shadow-elevated p-2">
                        <FaSearch className="text-orange-500 ml-4" />
                        <input
                            className="flex-1 px-4 py-3 text-gray-800 placeholder-gray-500 outline-none text-sm md:text-base"
                            type="search"
                            placeholder="Search for delicious food..."
                            aria-label="Search"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value) }}
                        />
                        <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Food Categories Section */}
            <div className='w-full mx-0 max-w-none px-4 md:px-6 py-8'>
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                            <p className="text-gray-600 mt-4">Loading delicious food items...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-2xl mx-auto">
                        <p className="text-red-800 font-semibold text-lg">⚠️ Oops! Something went wrong</p>
                        <p className="text-red-700 mt-2">{error}</p>
                        <button 
                            onClick={loadData}
                            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                        >
                            Try Again
                        </button>
                    </div>
                ) : foodCat.length > 0 ? (
                    <div className="space-y-12">
                        {foodCat.map((data) => (
                            <div key={data._id} className='animate-fadeInUp'>
                                {/* Category Title */}
                                <div className="mb-6">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                                        <span className="text-3xl">🍽️</span>
                                        {data.CategoryName}
                                    </h2>
                                    <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
                                </div>

                                {/* Food Items Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {foodItem.length > 0 ? (
                                        foodItem
                                            .filter((item) => (item.CategoryName === data.CategoryName) && (item.name.toLowerCase().includes(search.toLocaleLowerCase())))
                                            .map((filterItems) => (
                                                <div key={filterItems._id} className='animate-fadeInUp'>
                                                    <Card 
                                                        foodItem={filterItems} 
                                                        options={filterItems.options[0]}
                                                    />
                                                </div>
                                            ))
                                    ) : (
                                        <div className="col-span-full text-center py-8">
                                            <p className="text-gray-500 text-lg">No food items found in this category</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🍔</div>
                        <p className="text-gray-500 text-lg mb-6">No food categories found yet.</p>
                        <button 
                            onClick={loadData}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                        >
                            Refresh
                        </button>
                    </div>
                )}
            </div>
            
            <Footer />
        </>
    );
}
