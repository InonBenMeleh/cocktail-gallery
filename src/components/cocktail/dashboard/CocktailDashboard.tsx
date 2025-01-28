import {FC, useEffect, useState} from "react";
import useCocktails, {Cocktail} from "./useCocktails.tsx";
import CocktailCard from "./card/CocktailCard.tsx";
import SearchBar from "../../../SearchBar.tsx";
import {Button, Spin, Modal} from "antd";
import "./cocktailDashboard.css"
import CocktailDetails from "../details/CocktailDetails.tsx";
import {useNavigate} from "react-router";

const CocktailDashboard: FC = () => {
    const [loadingCocktails, setLoadingCocktails] = useState(true);
    const {cocktails, onSearch, fetchCocktails} = useCocktails()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCocktails().finally(() => setLoadingCocktails(false))
    }, []);

    const showModal = (cocktail: Cocktail) => {
        setSelectedCocktail(cocktail); // Set the selected cocktail
        setIsModalVisible(true); // Show the modal
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Hide the modal
    };

    const onSearchHandler = async (term: string) => {
        try {
            setLoadingCocktails(true);
            onSearch(term);
        } catch (e) {
            console.error("Search Error: ", e);
        } finally {
            setLoadingCocktails(false);
        }
    };

    return <div className={"cocktails-dashboard-main-view-container"}>
        <div className={"cocktails-dashboard-top-bar-container"}>
            <SearchBar width={420} onSearch={onSearchHandler} placeholder={"search cocktail ..."}/>
            <Button onClick={() => navigate("/cocktails/cocktail/create")} size={"large"} type="primary">
                + Add Cocktail
            </Button>
        </div>
        <div className={"cocktails-dashboard-separator"}/>
        {loadingCocktails ? (
            <div className="cocktails-dashboard-loading">
                <Spin size="large" tip="Loading cocktails..." />
            </div>
        ) : (
            <div className="cocktails-dashboard-grid">
                {cocktails.map((cocktail: Cocktail) => (
                    <CocktailCard
                        key={cocktail.id}
                        title={cocktail.name}
                        imageSrc={cocktail.imageSrc}
                        onClick={() => showModal(cocktail)}
                    />
                ))}
            </div>
        )}
        <Modal
            title={selectedCocktail?.name}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={600}
        >
            {selectedCocktail && (
                <CocktailDetails {...selectedCocktail} />
            )}
        </Modal>
    </div>
}

export default CocktailDashboard
