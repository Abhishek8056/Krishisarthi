

import React, { useEffect, useState } from 'react'
import './Dashboard.css';
import ProductItem from '../../components/dashboardComponent/product/ProductItem';
import Dropdown from '../../components/dropdown/Dropdown';
import { getEquips, getEquipsList } from '../../api/equipments';
import { DateRangePicker } from 'react-date-range';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Navigate, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [equipments, setEquipments] = useState(null);
    const [equipList, setEquipList] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [change, setChange] = useState(false);
    const [perDay, setPerDay] = useState(10000);
    const [perHour, setPerHour] = useState(1000);
    const [distance, setDistance] = useState(1);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [filteredEquipments, setFilteredEquipments] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const getEquipments = async () => {
        const { data } = await getEquips();
        setEquipments(data);
        setFilteredEquipments(data);
        console.log(data);
      }
      getEquipments();
    }, [])

    useEffect(() => {
        const getEquipmentsList = async () => {
            const { data } = await getEquipsList();
            // console.log(data, "list");
            setEquipList(data);
          }
          getEquipmentsList();
    }, []);
    

    // useEffect(() => {
    //     if(searchInput)
    //         setFilteredEquipments(equipments?.filter(equipment => equipment?.title?.toLowerCase().includes(searchInput.toLowerCase())));
    //     if(perDay)
    //         setFilteredEquipments(equipments?.filter(equipment => equipment?.daily_rental<=(perDay)));
    // }, [change]);

    const handleFilter = (e) => {
        setSearchInput(e.target.value);
    }

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection'
    }

    const commands = [
        {
          command: ["search * item", "search *", "find * item", "find *"],
          callback: (redirectPage) => setVoiceSearch(redirectPage),
        },
      ];
    
      const { transcript } = useSpeechRecognition({ commands });
      const [voiceSearch, setVoiceSearch] = useState("");

      const pages = ["home", "dashboard", "booking", "contact", "tractor"];
        const urls = {
            home: "/",
            blog: "/dashboard",
            booking: "/booking",
            contact: "/contact",
            tractor: "/product/4",
        };
    
      if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
          return null;
      }
      console.log(voiceSearch, "voiceSearch");
    
      let redirect = "";
    
    //   if (voiceSearch) {
    //     searchInput=voiceSearch;
    //   }
    if (voiceSearch) {
      if (pages.includes(voiceSearch)) {
        //   if()
        // const item = equipments?.filter(eq => (eq.title.toLowerCase().includes(voiceSearch.toLowerCase())));
        // console.log(item, "filtered id");
        setSearchInput(voiceSearch);
        setVoiceSearch('');
        redirect = <p>Searching: {voiceSearch}</p>;
    //   setTimeout(() => {
    //     redirect = window.location = `/product/${item[0]?.id}`;
    //   }, 3000);
      } else {
          setSearchInput('');
          setVoiceSearch('');
      redirect = <p>Could not find page: {voiceSearch}</p>;
      }
    }



    return (
        <>
        {redirect}
        {/* <p id="transcript">Transcript: {transcript}</p> */}

        {/* <button onClick={SpeechRecognition.startListening}>Start</button> */}
            {/* <div className='h-4 w-full my-4 bg-[#D8F5DE]'></div> */}
            <div className='mx-auto my-10 max-w-7xl'>
                <div className='mt-4'>
                    <div className='flex justify-around'>
                        <h1 className='text-2xl font-bold text-right text-gray-600'>Search Equipments</h1>
                        <div className=''>
                            <div className="relative flex items-center w-full mb-4 input-group">
                                <i onClick={SpeechRecognition.startListening} className="mr-5 text-2xl cursor-pointer text-darkgreen tooltip fa-solid fa-microphone"><span className="tooltiptext">Search by Voice</span></i>

                                    <input onChange={(e) => handleFilter(e)} value={searchInput} type="search" className="relative flex-auto block w-full min-w-0 px-3 py-3 m-0 text-base font-normal text-gray-700 transition ease-in-out bg-white border border-gray-300 border-solid rounded searchInput form-control bg-clip-padding focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Enter your Equipment here......" aria-label="Search" aria-describedby="button-addon3" />
                                    <button className="inline-block px-6 py-2 text-sm font-medium leading-tight text-green-600 uppercase transition duration-150 ease-in-out rounded cursor-pointer searchBtn btn hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0" type="button" id="button-addon3">Search</button>
                                    
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-around mb-10'>
                        <div className="flex w-[240px] h-[40px] items-center border-2 rounded-lg border-[#68AC5D] px-1">
                            <i className="text-[#68AC5D] pl-4 pr-2 fa-solid fa-location-dot"></i>
                            <input className="searchDash appearance-none bg-transparent w-full text-gray-800 font-semibold mr-1 py-0.5 px-1 leading-tight focus:outline-none" type="text" placeholder="Enter Pincode (eg 226021)" aria-label="Full name" />
                        </div>
                        <h1 className='mt-3 mb-3 font-semibold text-center text-gray-500 text-md'>Search your desired Equipments directly by entering a keyword or the whole name.</h1>
                    </div>

                    <div className='flex justify-around w-full'>
                        <div className='w-1/4'>
                            <div className='bg-[#68AC5D] py-4 px-1 prFilter'>
                                <h1 className='text-lg font-bold text-center text-white'>Product Filters</h1>
                                
                            </div>
                            

                            <div className='py-6 border'>
                                <span className='text-lg mb-4 font-semibold text-[#4F4F4F] border-b-2 border-[#68AC5D] pb-1 ml-6'>Categories:</span>

                                <div className='my-5'>
                                    {
                                        equipList?.map(list => (
                                        <Dropdown key={list.id} title={list.name} />
                                        ))
                                    }
                                </div>

                                <span className='text-lg mb-4 font-semibold text-[#4F4F4F] border-b-2 border-[#68AC5D] pb-1 ml-6'>Brands</span>

                                <div className='my-5'>
                                    <Dropdown title="Mahindra" />
                                    <Dropdown title="John Deere" />
                                    <Dropdown title="CLAAS India" />
                                </div>

                                <span className='text-lg mb-4 font-semibold text-[#4F4F4F] border-b-2 border-[#68AC5D] pb-1 ml-6'>Price Range</span>

                                <div className='my-5'>
                                    <p className='text-md font-semibold text-[#4F4F4F] pl-8'>Price per day</p>
                                    <input type="range" id="perDay" min={0} max={149827} onChange={(e) => {setPerDay(e.target.value); setChange(!change)}} value={perDay}
                                        className="w-full h-6 p-0 text-green-100 bg-transparent appearance-none rangeInput form-range focus:outline-none focus:ring-0 focus:shadow-none"
                                    />
                                    <p className='text-md mb-3 font-normal text-[#4F4F4F] pl-8'>Rs. 0 to {perDay} </p>

                                    <p className='text-md font-semibold text-[#4F4F4F] pl-8'>Price per hour</p>
                                    <input type="range" id="customRange1" min={42} max={49827} onChange={(e) => {setPerHour(e.target.value); setChange(!change)}} value={perHour}
                                        className="w-full h-6 p-0 text-green-100 bg-transparent appearance-none rangeInput form-range focus:outline-none focus:ring-0 focus:shadow-none"
                                    />
                                    <p className='text-md mb-3 font-normal text-[#4F4F4F] pl-8'>Rs. 42 to {perHour}</p>

                                    <p className='text-md font-semibold text-[#4F4F4F] pl-8'>Distance from You</p>
                                    <input type="range" id="customRange1" min={0} max={6.6} onChange={(e) => {setDistance(e.target.value); setChange(!change)}} value={distance}
                                        className="w-full h-6 p-0 text-green-100 bg-transparent appearance-none rangeInput form-range focus:outline-none focus:ring-0 focus:shadow-none"
                                    />
                                    <p className='text-md font-normal text-[#4F4F4F] pl-8'>0 KM to {distance} KM</p>
                                </div>

                                <span className='text-lg mb-4 font-semibold text-[#4F4F4F] border-b-2 border-[#68AC5D] pb-1 ml-6'>Availability Date</span>

                                <p className='text-md pt-2 font-normal text-[#4F4F4F] pl-6'>From</p>

                                <div className='flex items-center justify-center'>
                                    <button onClick={() => setVisible1(!visible1)} className="w-1/2 px-2 py-1 my-4 text-sm font-normal text-center text-white rounded bg-darkgreen hover:bg-green-700">
                                        DD-MM-YYYY
                                    </button>
                                    <i className="ml-4 text-lg text-[#68AC5D] fa-solid fa-calendar"></i>
                                </div>
                                <div style={{ display: visible1 ? 'block' : 'none', height: '400px', width: '200px', 'zIndex': 1 }}>
                                    <DateRangePicker style={{ height: '300px', width: '280px' }}
                                        ranges={[selectionRange]}
                                        minDate={new Date()}
                                        // disabledDates={getDaysArray(new Date(),new Date())}
                                        rangeColors={["#68AC5D"]}
                                        // onChange={handleSelect}
                                        // maxDate={new Date()}
                                    />
                                </div>


                                <p className='text-md font-normal text-[#4F4F4F] pl-6'>To</p>
                                <div className='flex items-center justify-center'>
                                    <button onClick={() => setVisible2(!visible2)} className="w-1/2 px-2 py-1 my-4 text-sm font-normal text-center text-white rounded bg-darkgreen hover:bg-green-700">
                                        DD-MM-YYYY
                                    </button>
                                    <i className="ml-4 text-lg text-[#68AC5D] fa-solid fa-calendar"></i>
                                </div>
                                <div style={{ display: visible2 ? 'block' : 'none', height: '400px', width: '200px', 'zIndex': 1 }}>
                                    <DateRangePicker style={{ height: '300px', width: '280px' }}
                                        ranges={[selectionRange]}
                                        minDate={new Date()}
                                        // disabledDates={getDaysArray(new Date(),new Date())}
                                        rangeColors={["#68AC5D"]}
                                        // onChange={handleSelect}
                                        // maxDate={new Date()}
                                    />
                                </div>

                            </div>

                            {/* <div className='w-11/12'>
                                <div className='bg-[#68AC5D] -mt-5 py-4 ml-10 px-1 prFilter'>
                                    <h1 className='text-lg font-bold text-center text-white'>Set Date</h1>
                                </div>
                            </div> */}
                            


                        </div>

                        <div className='w-3/4 ml-8'>
                            <div className='relative flex justify-around'>
                                <h1 className='absolute top-0 left-0 text-2xl font-bold text-gray-600'>Featured Products</h1>
                                <button className="absolute top-0 right-10 shadow-md bg-darkgreen mx-auto hover:bg-green-700 text-white text-md font-normal py-1.5 px-3 rounded">
                                    More <i className="w-5 pl-1 fa-solid fa-angle-right"></i>
                                </button>
                            </div>

                            <div className='flex flex-wrap items-center'>
                                <div className='flex flex-wrap my-12'>
                                    {
                                        equipments?.filter(equipment => equipment?.title?.toLowerCase().includes(searchInput.toLowerCase()))?.map(equipment => (
                                            <ProductItem key={equipment.id} equipment={equipment} />
                                        ))
                                        // equipments?.map(equipment => (
                                        //     <ProductItem key={equipment.id} equipment={equipment} />
                                        // ))
                                    }
                                    {/* {
                                        filteredEquipments?.map(equipment => (
                                            <ProductItem key={equipment.id} equipment={equipment} />
                                        ))
                                    } */}
                                    {/* {
                                        equipments?.filter(equipment => equipment?.daily_rental<=(perDay))?.map(equipment => (
                                            <ProductItem key={equipment.id} equipment={equipment} />
                                        ))
                                    } */}
                                </div>
                            </div>

                            <div className='relative flex justify-around'>
                                <h1 className='absolute top-0 left-0 text-2xl font-bold text-gray-600'>All Products</h1>
                                <a className='absolute top-0 mx-auto text-sm font-normal text-green-600 right-10 hover:bg-green-700'>View All</a>
                            </div>

                            <div className='flex flex-wrap items-center'>
                                <div className='flex flex-wrap my-12'>
                                    {
                                        !searchInput ? (
                                            equipments?.map(equipment => (
                                                <ProductItem key={equipment.id} equipment={equipment} />
                                            ))
                                        ) : (
                                            equipments?.filter(equipment => equipment?.title?.toLowerCase().includes(searchInput.toLowerCase()))?.map(equipment => (
                                                <ProductItem key={equipment.id} equipment={equipment} />
                                            ))
                                        )
                                    }
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard