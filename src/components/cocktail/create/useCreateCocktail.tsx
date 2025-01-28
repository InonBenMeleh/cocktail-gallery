import { useNavigate } from "react-router";
import { message } from "antd";
import IndexDBManager from "../../../services/indexDBManager.ts";
import { Cocktail } from "../dashboard/useCocktails.tsx";

export const useCreateCocktail = () => {
    const navigate = useNavigate();

    const createCocktail = async (
        cocktailName: string,
        ingredients: string[],
        instructions: string,
        image: File | null
    ) => {
        if (!cocktailName || ingredients.every((ing) => !ing.trim()) || !instructions || !image) {
            message.error("Please fill out all fields, including uploading an image.");
            return;
        }

        const id = `${Date.now()}`;
        const payload: Cocktail = {
            id,
            name: cocktailName,
            ingredients: ingredients.filter((ingredient) => ingredient.trim() !== ""),
            instructions,
            imageSrc: id,
        };

        try {
            const dbManager = IndexDBManager.getInstance();
            await dbManager.addCocktail(payload);
            await dbManager.addImage("Images", id, image);
            message.success("Cocktail saved successfully!");
            navigate("/*"); // Navigate to the dashboard
        } catch (error) {
            console.error("Error saving cocktail:", error);
            message.error("Failed to save the cocktail. Please try again.");
        }
    };

    return { createCocktail };
};
