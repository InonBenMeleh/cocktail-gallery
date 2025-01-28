import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CocktailDashboard from "./components/cocktail/dashboard/CocktailDashboard";
import CreateCocktail from "./components/cocktail/create/CocktailCreate";
import "./App.css"

const App: React.FC = () => {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="cocktails/dashboard" element={<CocktailDashboard/>} />
            <Route path="cocktails/cocktail/create" element={<CreateCocktail/>} />
            <Route path="*" element={<CocktailDashboard />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;
