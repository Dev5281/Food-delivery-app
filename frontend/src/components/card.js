import React, { useEffect, useRef, useState } from 'react'
import { UseDispatchCart, UseCart } from './ContextReducer';
import { FaPlus, FaCheck } from 'react-icons/fa';

export default function Card(props) {
    let dispatch = UseDispatchCart();
    let data = UseCart();
    const priceRef = useRef();
    let options = props.options;
    let priceOptions = Object.keys(options);
    const [qty, setQty] = useState(1);
    const [size, setSize] = useState("");
    const [added, setAdded] = useState(false);

    const handleAddCart = async () => {
        let finalPrice = qty * parseInt(options[size] || 0);
        let food = data.find(item => item.id === props.foodItem._id && item.size === size);
        for (const item of data) {
            if (item.id === props.foodItem._id) {
                food = item;
                break;
            }
        }
        if (food) {
            if (food.size === size) {
                await dispatch({ type: "UPDATE", id: props.foodItem._id, price: finalPrice, qty: qty })
                return
            }
            else {
                await dispatch({ type: "ADD", id: props.foodItem._id, name: props.foodItem.name, price: finalPrice, qty: qty, size: size })
                return
            }
        }
        await dispatch({ type: "ADD", id: props.foodItem._id, name: props.foodItem.name, price: finalPrice, qty: qty, size: size })
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    }
    
    let finalPrice = qty * parseInt(options[size] || 0);
    useEffect(() => {
        setSize(priceRef.current.value)
    }, [data])

    return (
        <div className="h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-elevated card-hover h-full flex flex-col transition-all duration-300 border border-gray-100">
                
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-200 group h-48">
                    <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src={props.foodItem.img}
                        alt={props.foodItem.name}
                    />
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ⭐ New
                    </div>
                </div>

                {/* Content Container */}
                <div className="px-5 py-4 flex-grow flex flex-col justify-between">
                    
                    {/* Title */}
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">
                            {props.foodItem.name}
                        </h3>
                        <p className="text-gray-500 text-xs mb-3">Delicious & Fresh</p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-3">
                        <label className="text-xs font-semibold text-gray-700 mb-2 block">Quantity</label>
                        <select
                            className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all'
                            onChange={(e) => setQty(e.target.value)}
                        >
                            {Array.from(Array(6), (e, i) => {
                                return (
                                    <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'Item' : 'Items'}</option>
                                )
                            })}
                        </select>
                    </div>

                    {/* Size Selector */}
                    <div className="mb-3">
                        <label className="text-xs font-semibold text-gray-700 mb-2 block">Size</label>
                        <select
                            className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all'
                            ref={priceRef}
                            onChange={(e) => setSize(e.target.value)}
                        >
                            {priceOptions.map((data) => {
                                return <option key={data} value={data}>{data}</option>
                            })}
                        </select>
                    </div>

                    {/* Price Display */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
                        <div className="flex items-baseline">
                            <span className="text-gray-600 text-sm">Price:</span>
                            <span className="text-2xl font-bold text-orange-600 ml-2">₹{finalPrice}</span>
                            <span className="text-gray-500 text-sm ml-1">/–</span>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddCart}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                            added
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg'
                        }`}
                    >
                        {added ? (
                            <>
                                <FaCheck className="text-lg" />
                                <span>Added!</span>
                            </>
                        ) : (
                            <>
                                <FaPlus className="text-lg" />
                                <span>Add to Cart</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
