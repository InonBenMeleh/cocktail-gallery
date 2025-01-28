import { useState } from "react";
import { Button, Input, Typography } from "antd";
import { useNavigate } from "react-router";
import ImageDropzone from "../../common/ImageDropZone.tsx";
const { TextArea } = Input;
import "./CocktailCreate.css";
import {useCreateCocktail} from "./useCreateCocktail.tsx";

const CocktailCreate = () => {
    const navigate = useNavigate();
    const [cocktailName, setCocktailName] = useState("");
    const [ingredients, setIngredients] = useState<string[]>([""]);
    const [instructions, setInstructions] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const {createCocktail} = useCreateCocktail()

    const handleIngredientChange = (value: string, index: number) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;

        if (value.trim() !== "" && index === ingredients.length - 1) {
            newIngredients.push("");
        }

        setIngredients(newIngredients);
    };

    const removeIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleImageUpload = (file: File | null) => {
        setImage(file);
    };

    const handleSubmit = async () => {
        createCocktail(cocktailName, ingredients, instructions, image).then();
    };

    return (
        <div className="cocktail-create-page-container">
            <div style={{display: 'flex', width: '100%', justifyItems: 'start'}}>
                <Button onClick={() => navigate(-1)} size="large" type="link">
                    Back
                </Button>
            </div>
            <div className="cocktail-create-input">
                <Typography.Title level={4}>Cocktail Name</Typography.Title>
                <Input
                    value={cocktailName}
                    onChange={(e) => setCocktailName(e.target.value)}
                    placeholder="Enter cocktail name"
                />
            </div>
            <div className="cocktail-create-input">
                <Typography.Title level={4}>Ingredients</Typography.Title>
                {ingredients.map((ingredient, index) => (
                    <div key={index} style={{display: "flex", gap: "8px", marginBottom: "8px"}}>
                        <Input
                            placeholder={`Ingredient ${index + 1}`}
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(e.target.value, index)}
                        />
                        {ingredients.length > 1 && (
                            <Button
                                type="text"
                                danger
                                onClick={() => removeIngredient(index)}
                                style={{padding: "0 8px"}}
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            <div className="cocktail-create-input">
                <Typography.Title level={4}>Instructions</Typography.Title>
                <TextArea
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Enter instructions here"
                />
            </div>
            <div className="cocktail-create-input">
                <Typography.Title level={4}>Upload Image</Typography.Title>
                <ImageDropzone onUpload={handleImageUpload}/>
            </div>
            <div className={"cocktail-create-footer"}>
                <Button onClick={handleSubmit} size="large" type="primary" style={{marginTop: 24}}>
                    Submit
                </Button>
            </div>
        </div>
)};

export default CocktailCreate;
