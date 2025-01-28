import {useState, useRef} from "react";
import axios from "axios";
import IndexDBManager from "../../../services/indexDBManager.ts";

export interface Cocktail {
    id: string;
    name: string;
    imageSrc: string
    instructions: string;
    ingredients: string[];
}

interface CocktailAPIResponse {
    idDrink: string;
    strDrink: string;
    strInstructions: string;
    strDrinkThumb: string;
    [key: string]: string | null;
}

const useCocktails = () => {
    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const cocktailsRef = useRef<Cocktail[]>([])
    const [error, setError] = useState<string | null>(null);

    const fetchCocktails = async () => {
        try {
            const settled = await Promise.allSettled([fetchCocktailsFromAPI(), fetchCocktailsFromDB()]);
            const apiResult = settled[0].status === 'fulfilled' ? settled[0].value : [];
            const dbResult = settled[1].status === 'fulfilled' ? settled[1].value : [];
            let cocktailsWithImages = [];
            if (dbResult?.length > 0) {
                cocktailsWithImages = await Promise.all(
                    dbResult.map(async (drink: Cocktail) => {
                        const imageSrc = await IndexDBManager.getInstance().getImage('Images', drink.id);
                        return {
                            ...drink,
                            imageSrc: imageSrc
                        };
                    })
                );
            }
            cocktailsRef.current = [
                ...apiResult.map((drink: Cocktail) => ({
                    ...drink,
                    imageSrc: drink.imageSrc
                })),
                ...cocktailsWithImages,
            ]
            setCocktails(cocktailsRef.current)
            console.log("Cocktails fetched from both API and DB.");
        } catch (error) {
            console.error("Error fetching cocktails:", error);
        }
    };

    async function fetchCocktailsFromAPI() {
        setError(null);
        try {
            const response = await axios.get(
                "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=Mojito"
            );
            const drinks = response.data.drinks || [];
            const formattedDrinks = drinks.map((drink: CocktailAPIResponse) => ({
                id: drink.idDrink,
                name: drink.strDrink,
                imageSrc: drink.strDrinkThumb,
                instructions: drink.strInstructions,
                ingredients: Object.keys(drink)
                    .filter((key) => key.startsWith("strIngredient") && drink[key])
                    .map((key) => drink[key]),
            }));
            return formattedDrinks
        } catch (err: any) {
            setError(err?.message || "An error occurred while fetching cocktail.");
        }
    };

    async function fetchCocktailsFromDB() {
        setError(null);
        try {
            const indexDb = IndexDBManager.getInstance();
            const cocktails = await indexDb.getAllCocktails();

            if (!cocktails.length) {
                throw new Error("No cocktails found in the database.");
            }

            const formattedDrinks = cocktails.map((drink: Cocktail) => ({
                id: drink.id,
                name: drink.name,
                imageSrc: drink.imageSrc,
                instructions: drink.instructions,
                ingredients: drink.ingredients,
            }));
            return formattedDrinks
        } catch (err: any) {
            setError(err?.message || "An error occurred while fetching cocktails from the database.");
        }
    }

    const onSearch = (term: string): Cocktail[] => {
        const lowerTerm = term.toLowerCase();
        const cocktailsFound = cocktailsRef.current.filter(cocktail =>
            cocktail.name.toLowerCase().includes(lowerTerm)
        );
        setCocktails(cocktailsFound);
        return cocktailsFound;
    };

    return { cocktails, error, onSearch, fetchCocktails };
};

export default useCocktails;