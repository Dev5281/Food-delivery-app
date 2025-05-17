import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/card';


export default function Home() {
    const [search,setSearch] = useState('');
    const [foodCat, setFoodCat] = useState([]);
    const [foodItem, setFoodItem] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const loadData = async () => {
        try {
            let response = await fetch("/api/foodData", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            response = await response.json();
            setFoodItem(response[0]);
            setFoodCat(response[1]);
        } catch (error) {
            console.error("Error fetching data:", error);
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
  
    return (
        <>
            <Navbar />
            <div id="default-carousel" class="relative w-full" data-carousel="slide">
        <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
            <div className='d-flex justfy-content-center'>

               <div className="flex justify-center items-center absolute top-10 left-1/2 transform -translate-x-1/2 z-50">
                   <input
                     className="w-80 bg-transparent placeholder:text-black text-black text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                     type="search"
                     placeholder="Search for food item"
                     aria-label="Search"
                     value={search} onChange={(e)=>{setSearch(e.target.value)}} 
                   />
                   <button
                     className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                     type="button"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                       <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                     </svg>
                
                     Search
                   </button> 
                 </div> 
            </div>
            
            {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ${currentIndex === index ? 'opacity-100' : 'opacity-0 hidden'}`}
                        >
                            <img src={image} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                        </div>
                    ))}
        </div>
       
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            <button type="button"className="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
            <button type="button"className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
            <button type="button"className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
            <button type="button"className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 4" data-carousel-slide-to="3"></button>
            <button type="button"className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 5" data-carousel-slide-to="4"></button>
        </div>
       
        <button type="button"className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                </svg>
                <span className="sr-only">Previous</span>
            </span>
        </button>
        <button type="button"className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="sr-only">Next</span>
            </span>
        </button>
    </div>
            <div className='w-full mx-0 max-w-none p-4'>
                {foodCat.length > 0 ? (
                    foodCat.map((data) => (
                        <div key={data._id} className='mb-5'>
                            <div className="font-bold text-lg">{data.CategoryName}</div>
                            <hr />
                            <div className="flex flex-wrap justify-start ">
                                {foodItem.length > 0 ? (
                                    foodItem
                                        .filter((item) => (item.CategoryName === data.CategoryName) && (item.name.toLowerCase().includes(search.toLocaleLowerCase())))
                                        .map((filterItems) =>{ return (
                                            <div key={filterItems._id} className='w-full md:w-1/2 lg:w-1/4'>
                                                <Card foodItem={filterItems} 
                                                  options={filterItems.options[0]} >    

                                                </Card>
                                            </div>
                                        )}
                                    )
                                ) : (
                                    <div className="col-12">No data found</div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center">Loading...</div>
                )}
            </div>
            
            <Footer />
        </>
    );
}
