import {Cocktail} from "../dashboard/useCocktails.tsx";
import {FC} from "react";
import "./CocktailDetails.css"

const CocktailDetails: FC<Cocktail> = (props) => {
    return <div className="cocktail-details">
        <div className={"horizontal-spaced-box"}>
            <div style={{display: "flex", flexDirection: 'column', rowGap: 8}}>
                <div>
                    <div className={"cocktail-details-title"}>Ingredients</div>
                    <ul>
                        {props.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className={"cocktail-details-title"}>Instructions</div>
                    <p>{props.instructions}</p>
                </div>
            </div>
            <img src={props.imageSrc} className={"cocktail-details-image"}/>
        </div>
    </div>
}

export default CocktailDetails
