import Search from "antd/es/input/Search";
import {FC, useState} from "react";

interface SearchBarProps {
    onSearch: (value: string) => Promise<void>;
    placeholder: string
    width?: number
}

const SearchBar: FC<SearchBarProps> = ({onSearch, placeholder, width}) => {
    const [loading, setLoading] = useState(false)

    const onSearchClick = async (value: string) => {
        setLoading(true);
        try {
            await onSearch(value);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return <div id="cocktail-search-bar" style={{width: width ?? 420}}>
        <Search placeholder={placeholder} size="large" onSearch={onSearchClick} loading={loading} />
    </div>
}

export default SearchBar
