import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from "./IngredientForm/IngredientForm";
import IngredientList from "./IngredientList/IngredientList";
import Search from "./Search/Search";
import ErrorModal from "../UI/ErrorModal/ErrorModal";

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('RENDERING INGREDIENTS', userIngredients);
    }, [userIngredients]);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        setUserIngredients(filteredIngredients);
    }, []);

    const addIngredientHandler = ingredient => {
        setIsLoading(true);
        fetch('https://react-hooks-25093.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                setIsLoading(false);
                return response.json();
            })
            .then(responseData => {
                setUserIngredients(prevIngredients => [
                    ...prevIngredients,
                    {id: responseData.name, ...ingredient}
                ]);
            }).catch(error=>{
            setError(error.message);
        })
    };

    const removeIngredientHandler = ingredientId => {
        setIsLoading(true);
        fetch(`https://react-hooks-25093.firebaseio.com/ingredients/${ingredientId}.json`, {
            method: 'DELETE'
        }).then(response => {
            setIsLoading(false);
            setUserIngredients(prevIngredients =>
                prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
            );
        }).catch(error=>{
            setError(error.message);
            setIsLoading(false);
        })
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>
            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList
                    ingredients={userIngredients}
                    onRemoveItem={removeIngredientHandler}
                />
            </section>
        </div>
    );
};

export default Ingredients;