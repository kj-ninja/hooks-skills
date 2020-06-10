import React, {useReducer, useState, useEffect, useCallback} from 'react';

import IngredientForm from "./IngredientForm/IngredientForm";
import IngredientList from "./IngredientList/IngredientList";
import Search from "./Search/Search";
import ErrorModal from "../UI/ErrorModal/ErrorModal";

const ingredientReducer = (currentIngredient, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredient, action.ingredient];
        case 'DELETE':
            return currentIngredient.filter(ing => ing.id !== action.id);
        case 'CLEAR':
        default:
            throw new Error('Should not get there!');
    }
};

const httpReducer = (currHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null};
        case 'RESPONSE':
            return {...currHttpState, loading: false};
        case 'ERROR':
            return {loading: false, error: action.errorMessage};
        case 'CLEAR':
            return {...currHttpState, error: null};
    }
};

const Ingredients = () => {
    const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
    const [httpState, dispatchHttp] = useReducer(httpReducer, {});
    // const [userIngredients, setUserIngredients] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState(null);

    useEffect(() => {
        console.log('RENDERING INGREDIENTS', userIngredients);
    }, [userIngredients]);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        dispatch({type: 'SET', ingredients: filteredIngredients});
        // setUserIngredients(filteredIngredients);
    }, []);

    const addIngredientHandler = ingredient => {
        dispatchHttp({type: 'SEND'});
        // setIsLoading(true);
        fetch('https://react-hooks-25093.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                dispatchHttp({type: 'RESPONSE'});
                // setIsLoading(false);
                return response.json();
            })
            .then(responseData => {
                dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
                // setUserIngredients(prevIngredients => [
                //     ...prevIngredients,
                //     {id: responseData.name, ...ingredient}
                // ]);
            }).catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: error.message})
            // setError(error.message);
        })
    };

    const removeIngredientHandler = ingredientId => {
        dispatchHttp({type: 'SEND'});
        // setIsLoading(true);
        fetch(`https://react-hooks-25093.firebaseio.com/ingredients/${ingredientId}.json`, {
            method: 'DELETE'
        }).then(response => {
            dispatchHttp({type: 'RESPONSE'});
            // setIsLoading(false);
            dispatch({type: 'DELETE', id: ingredientId});
            // setUserIngredients(prevIngredients =>
            //     prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
            // );
        }).catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: error.message})
            // setError(error.message);
            // setIsLoading(false);
        })
    };

    const clearError = () => {
        dispatchHttp({type: 'CLEAR'})
        // setError(null);
    };

    return (
        <div className="App">
            {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>
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