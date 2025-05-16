import React, { useEffect, useRef, useState } from 'react'
import { UseDispatchCart, UseCart } from './ContextReducer';
export default function Card(props) {
let dispatch = UseDispatchCart();
    let data = UseCart();
    const priceRef = useRef();
    let options = props.options;
    let priceOptions = Object.keys(options);
    const [qty,setQty] = useState(1);
    const [size, setSize]= useState("");
    const handleAddCart = async()=>{
        let finalPrice = qty* parseInt(options[size]||0);
        let food = data.find(item => item.id === props.foodItem._id && item.size ===size);
        for (const item of data ){
            if(item.id ===props.foodItem._id){
                food = item;
                break;
            }
        }
        if(food){
            if(food.size === size){
                await dispatch({type:"UPDATE", id:props.foodItem._id, price: finalPrice, qty: qty})
                return 
            }
            else{
                await dispatch({type:"ADD",id:props.foodItem._id, name: props.foodItem.name, price: finalPrice,qty:qty,size:size})
                return
            }
            
        }
      await dispatch({type:"ADD",id:props.foodItem._id, name: props.foodItem.name, price: finalPrice,qty:qty,size:size})
     
    }
    let finalPrice = qty* parseInt(options[size]||0);
    useEffect(()=>{
        setSize(priceRef.current.value)
    },[data])
  return (
    <div><div className=" max-w-sm rounded overflow-hidden shadow-lg m-3">
                <img className="w-full" src={props.foodItem.img} alt="unavailable" style={{height:"120px",objectFit:"fill"}} />
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{props.foodItem.name}</div>
                   
                </div>
                <div className="container w-100">
                    <select className='m-2 h-100 bg-grey-700 rounded'onChange={(e)=> setQty(e.target.value)}>
                        {Array.from(Array(6), (e, i) => {
                            return (
                                <option key={i + 1} value={i + 1}>Q {i + 1}</option>
                            )
                        })}
                    </select>
                    <select className='m-2 h-100 bg-grey-700 rounded' ref={priceRef} onChange={(e)=> setSize(e.target.value)}>

                        {priceOptions.map((data)=>{
                            return <option key={data} value={data}>{data}</option>
                        })}
                    </select>
                    <div className=' inline h-100 bg-white rounded text-xl ml-12'>₹{finalPrice}/-</div>
                    <hr></hr>
                    <div className="flex flex-wrap justify-center mt-2 mb-2 ">
                    <button className="btn btn-success w-full hover:bg-gray-100" onClick={handleAddCart}>
                        Add to Cart
                    </button>
                </div> 
                </div>
            </div></div>
  )
}
