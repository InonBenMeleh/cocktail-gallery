import {FC} from "react";
import "./Card.css"

interface CocktailCardProps {
    imageSrc?: string,
    title: string,
    onClick: () => void
}

const CocktailCard: FC<CocktailCardProps> = ({title, imageSrc, onClick}) => {

    return <div className={"cocktail-card-container"} onClick={onClick}>
        <img src={imageSrc} alt={title} className="cocktail-card-image" />
        <div className={"cocktail-card-title"}>{title}</div>
    </div>
}

export default CocktailCard