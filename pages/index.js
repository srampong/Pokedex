
import ReactPaginate from 'react-paginate'
import Router, { withRouter } from 'next/router'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


const Home = (props) => {


  const [isLoading, setLoading] = useState(false); //State for the loading indicator
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);


  //State for storing data feteched from server
  const [pokemons, setPokemons] = useState(props.pokemons);
  const [pokemonsData, setPokemonsData] = useState(props.pokemons);
  const [query, setQuery] = useState("");

  

  /*
    pokemons fetching happens after page navigation, 
    so we need to switch Loading state on Router events.
  */
  useEffect(() => { //After the component is mounted set router event handlers
    Router.events.on('routeChangeStart', startLoading);
    Router.events.on('routeChangeComplete', stopLoading);
    setPokemons(props.pokemons)
    setPokemonsData(props.pokemons)

    console.log("pagination")
    
    //After the component is unmounted unset router event handlers
    return () => {
      Router.events.off('routeChangeStart', startLoading);
      Router.events.off('routeChangeComplete', stopLoading);
    }
  }, [props.pokemons])// reload the page anytime the data changes

  //When new page selected in paggination, we take current path and query parrams.
  // Then add or modify page parram and then navigate to the new route.
  const pagginationHandler = (page) => {

    console.log(page.selected);
    const currentPath = props.router.pathname;
    const currentQuery = props.router.query;
    currentQuery.page = page.selected ;
   
    
    props.router.push({
      pathname: currentPath,
      query: currentQuery,
    });

  };


 
  
  //When the user types in the search bar we check if the length is greater than 3,
  // if its greater than 3 filter the data fetched from the server with the search keyword and update the
  // pokemons state variable to display the search result otherwise display the original data fetch from the server.
  const requestSearch = (event) => {

     if(event.target.value === "" || event.target.value.length < 2)
     {
        
       setQuery("");
       setPokemons(props.pokemons); 
      
     }
     else 
     {
         
          setQuery(event.target.value)
          const filteredRows = props.pokemons.filter((row) => {
            return row.name.toLowerCase().includes(query.toLowerCase());
          });
      
          
          if(filteredRows.length > 0)
          {
            setPokemons(filteredRows);
            
          }else{

            setPokemons([]); 

          }
     } 
    
  };


  console.log(isLoading);
  
 
  let pokemonItems = null;

    // if loading show loading screen  otherwise show pokemons data feteched from server
  if(isLoading)

   pokemonItems = ( <div className='  min-h-screen mx-auto justify-items-center content-center items-center flex justify-center' >

    <CircularProgress sx={{color:"#86efac"}}/>

   </div>)
 else

 
    //Generating pokemon list with pagination
  pokemonItems = (
      <div className="grid grid-cols-1 md:mx-16 mx-8 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-16 mx-auto">
      
      { 
     
          pokemons.map((pookemon ,i)=> {

          return  <a key={pookemon.name} href={`/pokemon/${pookemon.name}`}>
          <div className="max-w-sm rounded shadow-md h-50 text-center flex flex-col justify-center bg-white">
            <div className="h-1/4 my-4 ">
              <img className="h-32 aspect-auto mx-auto" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pookemon.url.split("/")[6]}.png`} alt="bulbasaur" />
            </div>
            <div className="h-1/2 flex flex-col justify-end mb-8"><h1 className="text-lg font-bold capitalize">{pookemon.name}</h1>
            </div>
          </div>
        </a>      

        })}

     

    </div>
      
        
      
    );


  return (

    <div className="bg-cyan-50">
      <main className="container pb-16 mx-auto bg-cyan-50  min-h-screen  ">
        <div className="min-h-screen">
          <div>
            <h1 className="text-3xl text-green-500 text-center pt-10">Pokédex</h1>
            <p className="text-center mt-6 text-xs mx-4 md:mx-0 md:text-lg text-gray-500">The Pokédex contains detailed stats for every creature from the Pokemon games.</p>
          </div>

          <div>
            <form className="pt-2 relative mx-auto text-gray-600  w-3/4 mt-8">
              <input  onChange={requestSearch} className="border-2 border-green-100  bg-white  h-12 w-full px-4 md:px- pr-16 rounded-lg text-xs md:text-sm  focus:outline-none " type="search" name="search" placeholder="Search for Pokemons" />
              <button type="submit" className="absolute right-0 top-1 mt-5 mr-4 ">
                <svg className=" h-4 w-4 text-green-500  " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>

              </button>

            </form>

          </div>

          {pokemonItems}

         
         
           
            <ReactPaginate
              breakLabel={""}
              breakClassName={' item break-me'}
              activeClassName={'item active'}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              disabledClassName={'disabled-page'}
              nextClassName={" next "}
              nextLabel={"Next"}
              pageClassName={'item pagination-page '}
              initialPage={0}
              pageCount={props.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={pagginationHandler}
              previousClassName={" previous"}
              previousLabel={ "Previous"}
            />

          


        </div>


      </main>

    </div>

  )
  }




// prefefetch data from server for better  SEO with pagination

export async function getServerSideProps({query}) {
   
  const limit = 16;
  const page =  query.page || 0; //if page empty we request the first page
  console.log("page "+page)
  const offset = page*limit; // set the offset by mutliplying the page number with the limit 
  const pokemons = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);

  
  
  //return data fetched from server and pagination parameters
  return {
    props:{totalCount: pokemons.data.count,
    pageCount: Math.round(pokemons.data.count / limit),
    currentPage: page,
    perPage: limit,
    pokemons: pokemons.data.results,
  }
  
  };

  }



export default withRouter(Home);
