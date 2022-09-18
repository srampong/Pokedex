
import Router, { withRouter } from 'next/router'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';




const PokemonInfo = (props) => {


    const [isLoading, setLoading] = useState(false); //State for the loading indicator
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);
    




    /*
      pokemons fetching happens after page navigation, 
      so we need to switch Loading state on Router events.
    */
    useEffect(() => { //After the component is mounted set router event handlers
        Router.events.on('routeChangeStart', startLoading);
        Router.events.on('routeChangeComplete', stopLoading);


        return () => {
            Router.events.off('routeChangeStart', startLoading); //After the component is unmounted unset router event handlers
            Router.events.off('routeChangeComplete', stopLoading);
        }
    }, [])






    console.log(isLoading);


    let pokemonInfo = null;


    // if loading show loading screen  otherwise show pokemon data feteched from server
    if (isLoading)

        pokemonInfo = (<div className='  min-h-screen mx-auto justify-items-center content-center items-center flex justify-center' >

            <CircularProgress sx={{ color: "#86efac" }} /> 

        </div>)
    else

        return (

            <div className=" bg-cyan-50">
                <main className=" rounded-lg container pb-16  bg-cyan-50   mx-auto max-w-7xl min-h-screen">
                    <div className=" w-full mx-auto w-full py-36">
                        <div className=" p-2 flex flex-col mx-auto bg-cyan-50  h-3/4  rounded-lg">

                            <div className="  mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-7xl">
                                <div className="md:flex">
                                    <div className="md:shrink-0 items-center text-center justify-items-center flex justify-center content-center bg-green-300">
                                        <img className="h-48 w-full p-8 object-contain  md:h-full md:w-96" src={props.pokemon.sprites["front_default"]} alt="Img" />
                                        <p className="text-2xl absolute font-bold mt-32 md:mt-80 text-white  capitalize">{props.pokemon.name}</p>
                                    </div>
                                    <div className="p-8">
                                        <div className=" text-2xl text-green-500 tracking-wide  font-bold">Species </div>
                                        <p className="text-base mt-3 text-slate-500 mb-4 capitalize">{props.pokemon.species["name"]}</p>
                                        
                                        <div className=''>
                                            <h2 className="text-lg mt-3  text-green-500 font-semibold">Base Stats</h2>

                                            <div role="list" className=" mb-4 mt-3 grid md:grid-cols-3 grid-cols-1">
                                                <div role="listitem" className="flex flex-col justify-center bg-gray-200 px-2 py-2 shadow text-center rounded-lg mb-3 w-3/4">
                                                    <p className="text-sm font-bold capitalize">hp</p>
                                                    <p className="text-lg mt-2 text-gray-800">{props.pokemon["stats"][5]["base_stat"]}</p>
                                                </div>
                                                <div role="listitem" className="flex flex-col justify-center bg-gray-200 px-2 py-1 shadow  text-center rounded-lg mb-3 w-3/4">
                                                    <p className="text-sm font-bold capitalize">attack</p>
                                                    <p className="text-lg mt-2 text-gray-800">{props.pokemon["stats"][4]["base_stat"]}</p>
                                                </div>
                                                <div role="listitem" className="flex flex-col justify-center bg-gray-200 px-2 py-1 shadow  text-center rounded-lg mb-3 w-3/4">
                                                    <p className="text-sm font-bold capitalize">defense</p>
                                                    <p className="text-lg mt-2 text-gray-800">{props.pokemon["stats"][3]["base_stat"]}</p>
                                                </div>
                                                <div role="listitem" className="flex flex-col justify-center bg-gray-200 px-2 py-1 shadow text-center rounded-lg mb-3 w-3/4">
                                                    <p className="text-sm font-bold capitalize">special-attack</p>
                                                    <p className="text-lg mt-2 text-gray-800">{props.pokemon["stats"][2]["base_stat"]}</p>
                                                </div><div role="listitem" className="flex flex-col justify-center bg-gray-200 px-2 py-1 shadow  text-center rounded-lg mb-3 w-3/4">
                                                    <p className="text-sm font-bold capitalize">special-defense</p>
                                                    <p className="text-lg mt-2 text-gray-800">{props.pokemon["stats"][1]["base_stat"]}</p>
                                                </div>
                                                <div role="listitem" className="flex flex-col justify-center bg-gray-200 px-2 py-1 shadow  text-center rounded-lg mb-3 w-3/4">
                                                    <p className="text-sm font-bold capitalize">speed</p>
                                                    <p className="text-lg mt-2 text-gray-800">{props.pokemon["stats"][0]["base_stat"]}</p>
                                                </div>
                                            </div>

                                            <h2 className="text-lg font-bold text-green-500 mb-3">Types</h2>

                                             
                                              

                                                    <div role="list" className="flex flex-wrap mb-4">
                                                    {
                                                      props.pokemon.types.map((item, i) => {
                                                       return  <span role="listitem" className="mr-3 mb-5 text-sm bg-gray-200 text-black px-3 py-1 rounded-full text-center capitalize">{item["type"].name}</span>
                                                    })}
                                                    
                                                    </div>

                                         


                                            <h2 className="text-lg font-bold text-green-500">Weight</h2>
                                            <p className="text-lg mb-4">{ props.pokemon.weight} lbs</p>

                                            <h2 className="text-lg text-green-500 font-bold mb-3">Moves</h2>
                                            <div role="list" className="flex flex-wrap mb-4">
                                                    {
                                                      props.pokemon.moves.map((item, i) => {
                                                       return  <span role="listitem" className="mr-3 mb-5 text-sm bg-gray-200 text-black px-3 py-1 rounded-full text-center capitalize">{item["move"].name}</span>
                                                    })}
                                                    
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>



        )
}



// prefefetch data from server for better  SEO
export async function getServerSideProps({ query }) {

    const { pokemon } = query; // get the pokemon parameter passed to the route
    console.log("name " + pokemon);
    const pokemonInfo = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`); // fetch data from server


    // return data to client to be rendered
    return {
        props: {
            pokemon: pokemonInfo.data,
        }

    };

}




export default withRouter(PokemonInfo);
